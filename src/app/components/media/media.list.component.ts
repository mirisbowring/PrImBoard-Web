import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter as fil, withLatestFrom } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { ModalTagComponent } from '../modals/modal.tag.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MediaMessage, Message } from 'src/app/models/message';
import { ModalEventComponent } from '../modals/modal.event.component';
import { ModalDeleteComponent } from '../modals/modal.delete.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxScrollEvent } from '../../directives/ngx-scroll-event.directive';
import { ModalUserGroupComponent } from '../modals/modal.usergroup.component';
import { KeycloakService } from 'keycloak-angular';
import { AuthImagePipe } from 'src/app/services/pipes/authImage.pipe';
import { HelperService } from 'src/app/services/helper.service';
import { ModalMediaViewComponent } from '../modals/modal.media.view.component';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-media-list',
  templateUrl: './media.list.component.html',
  styleUrls: ['./media.list.component.css']
})
export class MediaListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mediastream', { read: ElementRef }) public mediastream: ElementRef;
  @ViewChild('mainView') mainView: ElementRef;

  vScrollerHeight = 0;

  meta = {
    reload: true,
    rowItems: 0,
    rows: 15,
    viewWidth: 0,
    viewHeight: 0,
    thumbnailSize: 132, // inclusive margins
    endIndex: 0,
  };

  initialized = false;
  refreshing = false;
  reachedTop = false;
  reachedBottom = false;

  private subscriptions = new Subscription();

  media: Media[] = [];
  medialength = 0;
  cols = 12;
  filter: string;
  private curID: string;
  private eventID: string;
  // multiselect params
  multiselect = false;
  selected = new Set(); // stores the IDs of the selected images
  rangeStart: Media;
  // carousel init data
  private selectedIndex: number;

  constructor(
    private mediaService: MediaService,
    route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private keyCloakService: KeycloakService,
  ) {
    // route parser
    this.subscriptions.add(
      this.router.events.pipe(
        fil(e => e instanceof NavigationEnd),
        withLatestFrom(route.params, route.fragment)
      ).subscribe(([e, params, fragment]) => {
        // show items for event
        this.eventID = null;
        if ((e as NavigationEnd).urlAfterRedirects.startsWith('/event/')) {
          this.eventID = params.id;
        } else if ((e as NavigationEnd).urlAfterRedirects.startsWith('/home')) {
        } else {
          return;
        }
        if (this.curID !== fragment) {
          this.curID = fragment;
        }
        if (this.filter !== params.filter) {
          this.filter = params.filter;
        }
        if (this.initialized) {
          this.media = [];
          this.requestMedia(this.curID ? 'from' : '', this.curID, true, false);
        }
      })
    );
    // message listener
    this.subscriptions.add(
      this.messageService.getMessage().subscribe((message: Message) => {
        if (message.multiselect !== undefined) {
          this.multiselect = message.multiselect;
          if (!this.multiselect) {
            this.selected = new Set();
            this.rangeStart = null;
          }
        }
        let modalRef: NgbModalRef;
        let status = 0;
        if (message.openTagDialog !== undefined) {
          modalRef = this.modalService.open(ModalTagComponent);
        } else if (message.openEventDialog !== undefined) {
          modalRef = this.modalService.open(ModalEventComponent);
        } else if (message.openDeleteDialog !== undefined) {
          modalRef = this.modalService.open(ModalDeleteComponent);
        } else if (message.openAccessDialog !== undefined) {
          modalRef = this.modalService.open(ModalUserGroupComponent);
        } else if (message.openMediaCarouselDialog !== undefined) {
          modalRef = this.modalService.open(ModalMediaViewComponent, {scrollable: true, size: 'xl'});
          status = 1;
        }
        if (modalRef != null) {
          switch (status) {
            case 0:
              modalRef.componentInstance.data = Array.from(this.selected.values());
              modalRef.componentInstance.typ = 'media';
              break;
            case 1:
              modalRef.componentInstance.dataIndex = this.selectedIndex;
              modalRef.componentInstance.data = this.media;
              modalRef.componentInstance.typ = 'media';
              break;
            default:
              console.error("unexpected modal open status");
          }

          modalRef.result.then((res: MediaMessage) => {
            if (res.updatedTags) {
              this.updateMediaCache(res.media, 'Mapped tags successfully!')
            } else if (res.updatedEvents) {
              this.updateMediaCache(res.media, 'Mapped events successfully!')
            } else if (res.updatedGroups) {
              this.updateMediaCache(res.media, 'Granted access to specified groups!')
            }else if (res.deleted) {
              for (const m of res.media) {
                const index = this.media.findIndex(med => med.id === m.id);
                this.media.splice(index, 1);
              }
            }
          });
        }
      })
    );
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.onResize();
    this.requestMedia('from', this.curID, false, false);
    this.initialized = true;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  counter(i: number): number[] {
    if (this.media.length > 0 && this.media.length > this.meta.rows * this.meta.rowItems) {
      return new Array(i);
    } else {
      return new Array(0);
    }
  }

  mediaTrackBy(index: number, med: Media): string {
    return med.id;
  }

  async onResize() {
    // this.meta.viewWidth = this.mainView.nativeElement.offsetWidth;
    this.vScrollerHeight = (window.innerHeight - 56);
    this.meta.rowItems = Math.ceil(this.meta.viewWidth / this.meta.thumbnailSize);
    this.meta.rows = Math.ceil(this.vScrollerHeight / 80);

    // calc cols
    const width = window.innerWidth;
    if (width >= 1200 ) {
      this.cols = 12;
    } else if (width >= 992 ) {
      this.cols = 10;
    } else if (width >= 768 ) {
      this.cols = 8;
    } else if (width >= 576) {
      this.cols = 5;
    } else if (width < 576) {
      this.cols = 3;
    }

    this.media = this.media;
  }

  getRows() {
    return [].constructor(Math.ceil(this.medialength/this.cols));
  }

  onScroll(event: NgxScrollEvent) {
    if (this.refreshing || (this.reachedBottom && this.reachedTop)) {
      return
    }
    if (event.isReachingBottom && ! this.reachedBottom) {
      const id = (this.media.length > 0) ? this.media[this.media.length - 1].id : '';
      this.requestMedia('after', id, false, false);
    }
    if (event.isReachingTop && this.reachedTop !== true) {
      const id = (this.media.length > 0) ? this.media[0].id : '';
      this.requestMedia('before', id, false, true);
    }
  }

  openCarouselDialog(index: number): void {
    this.selectedIndex = index;
    this.messageService.sendMessage({ openMediaCarouselDialog: true });
  }

  requestMedia(param: string, id: string, fill: boolean, asc: boolean) {
    if (this.refreshing) {
      return;
    }
    this.refreshing = true;
    if (id == null) {
      id = '';
    }
    const size = (this.cols * this.meta.rows);
    this.mediaService.getMediaPage(id, size, this.filter, param, this.eventID, asc)
      .subscribe((data: Media[]) => {
        if (asc && data != null) {
          data = data.reverse();
        }
        switch (param) {
          case 'after':
            this.reachedBottom = (data == null || data.length < size);
            if (data == null) {
              break;
            }
            if (this.media.length === 0 && data != null && data.length < size) {
              this.fillTop(data);
            }
            this.media = this.media.concat(data);
            this.medialength = this.media.length;
            break;
          case 'before':
            this.reachedTop = (data == null || data.length < size );
            if (data == null) {
              break;
            }
            if (this.media.length === 0 && data != null && data.length < size) {
              this.fillBottom(data);
            }
            this.media = data.concat(this.media);
            this.medialength = this.media.length;
            break;
          case 'from':
            this.reachedBottom = (data == null || data.length < size);
            if (data == null) {
              break;
            }
            if (this.media.length === 0 && data != null && data.length < size) {
              this.fillTop(data);
            }
            this.media = this.media.concat(data);
            this.medialength = this.media.length;
            break;
          case 'until':
            this.reachedTop = (data == null || data.length < size);
            if (data == null) {
              break;
            }
            if (this.media.length === 0 && data != null && data.length < size) {
              this.fillBottom(data);
            }
            this.media = data.concat(this.media);
            this.medialength = this.media.length;
            break;
          case '':
            this.reachedBottom = (data == null || data.length < size);
            if (data == null) {
              break;
            }
            if (this.media.length === 0 && data != null && data.length < size) {
              this.fillTop(data);
            }
            this.media = this.media.concat(data);
            this.medialength = this.media.length;
            break;
        }
        this.refreshing = false;
      });
  }

  fillBottom(response: Media[]): void {
    if (response.length > 0 && this.reachedBottom === false) {
      this.refreshing = false;
      this.requestMedia('after', response[response.length - 1].id, false, false);
    }
  }

  fillTop(response: Media[]): void {
    if (response.length > 0 && this.reachedTop === false) {
      this.refreshing = false;
      this.requestMedia('before', response[0].id, false, true);
    }
  }

  selectMedia(m: Media): void {
    this.selected.add(m);
  }

  unselectMedia(m: Media): void {
    const index = this.selected.delete(m);
  }

  startRange(m: Media): void {
    this.rangeStart = m;
  }

  thumbURL(m: Media): string {
    return HelperService.thumbURL(m, this.keyCloakService.getUsername(), false)
  }

  endRange(m: Media): void {
    // get index
    const start = this.media.indexOf(this.rangeStart);
    const end = this.media.indexOf(m);
    let tmp: Media[];
    // check if selected forwards or backwards
    if (start > end) {
      tmp = this.media.slice(end, start + 1);
    } else {
      tmp = this.media.slice(start, end + 1);
    }
    // append selection to set
    this.selected = new Set([...this.selected, ...tmp]);
    // disable range selection
    this.rangeStart = null;
  }

  updateMediaCache(updates: Media[], message: string): void {
    if (updates === undefined) {
      return;
    }
    // iterate over all fetched media
    for (let i = 0; i < this.media.length; i++) {
      // create tmp index
      let index = -1;
      // iterate over all returned media (updated ones)
      for (let j = 0; j < updates.length; j++) {
        // set tmp index if match found and break inner loop
        if (updates[j].id === this.media[i].id) {
          index = j;
          break;
        }
      }
      // replace element if match found
      if (index > -1) {
        this.media[i] = updates[index];
        if (updates.length === 1) {
          // break outer loop if this was the last matched item from response
          break;
        } else {
          // remove from response to increase iteration performance
          updates = updates.splice(index, 1);
        }
      }
    }
    this.snackBar.open(message, 'Ok', { duration: 2000 });
  }

}
