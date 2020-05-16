import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter as fil, withLatestFrom } from 'rxjs/operators';
import { DestroySubscribers, CombineSubscriptions } from 'ngx-destroy-subscribers';
import { Unsubscribable } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { SafeHtml } from '@angular/platform-browser';
import { ModalTagComponent } from '../modals/modal.tag.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Message } from 'src/app/models/message';
import { ModalEventComponent } from '../modals/modal.event.component';

@Component({
  selector: 'app-media-list',
  templateUrl: './media.list.component.html',
  styleUrls: ['./media.list.component.css']
})
@DestroySubscribers()
export class MediaListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mediastream', { read: ElementRef }) public mediastream: ElementRef;

  @CombineSubscriptions()
  private subscribers: Unsubscribable;

  isFullListDisplayed = false;
  media: Media[] = [];
  filter: string;
  prevID: string;
  private curID: string;
  // multiselect params
  multiselect = false;
  selected = new Set(); // stores the IDs of the selected images
  rangeStart: Media;

  constructor(
    private mediaService: MediaService,
    route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.subscribers = this.router.events.pipe(
      fil(e => e instanceof NavigationEnd),
      withLatestFrom(route.params, route.fragment)
    ).subscribe(([e, params, fragment]) => {
      let operate = false;
      if (this.curID !== fragment) {
        this.curID = fragment;
        this.prevID = fragment;
        operate = true;
      }
      if (this.filter !== params.filter) {
        this.filter = params.filter;
        if (!operate || !this.curID) {
          this.prevID = null;
          operate = true;
        }
      }
      if (operate) {
        this.media = [];
        this.requestMedia(this.prevID ? 'from' : '');
      } else if ((e as NavigationEnd).urlAfterRedirects === '/home') {
        this.media = [];
        this.prevID = null;
        this.requestMedia('');
      }
    });
    this.subscribers = this.messageService.getMessage().subscribe((message: Message) => {
      if (message.multiselect !== undefined) {
        this.multiselect = message.multiselect;
        if (!this.multiselect) {
          this.selected = new Set();
          this.rangeStart = null;
        }
      }
      if (message.openTagDialog !== undefined) {
        const dialogRef = this.dialog.open(ModalTagComponent, {
          width: '400px',
          data: Array.from(this.selected.values()),
        });
        dialogRef.afterClosed().subscribe((res: Media[]) => {
          this.updateMediaCache(res, 'Mapped tags successfully!');
        });
      }
      if (message.openEventDialog !== undefined) {
        const dialogRef = this.dialog.open(ModalEventComponent, {
          width: '400px',
          data: Array.from(this.selected.values()),
        });
        dialogRef.afterClosed().subscribe((res: Media[]) => {
          this.updateMediaCache(res, 'Mapped event successfully!');
        });
      }
    });
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  requestMedia(param: string) {
    this.mediaService.getMediaPage(this.prevID, 0, this.filter, param).subscribe((data: Media[]) => {
      if (data == null || data.length === 0) {
        this.isFullListDisplayed = true;
      } else {
        this.media = this.media.concat(data);
        this.prevID = this.media[this.media.length - 1].id;
        this.callbackUntilScrollable();
      }
    });
  }

  onScrollDown() {
    this.requestMedia('after');
  }

  onScrollUp() {
    this.requestMedia('before');
  }

  private callbackUntilScrollable() {
    window.setTimeout(() => {
      if (this.mediastream.nativeElement.clientHeight <= window.innerHeight + 500) {
        this.onScrollDown();
      }
    }, 0);
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
        if ( updates.length === 1) {
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
