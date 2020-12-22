import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media, MediaGroupMap } from 'src/app/models/media';
import { FormControl } from '@angular/forms';
import { TagService } from 'src/app/services/tag.service';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/services/group.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserGroupComponent } from './modal.usergroup.component';
import { HelperService } from 'src/app/services/helper.service';
import { KeycloakService } from 'keycloak-angular';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MediaMessage } from 'src/app/models/message';
import SwiperCore, { Navigation, Virtual } from 'swiper/core';

// install Swiper components
SwiperCore.use([Navigation, Virtual]);

@Component({
  selector: 'app-media',
  templateUrl: './modal.media.view.component.html',
  styleUrls: ['./modal.media.view.component.css']
})
export class ModalMediaViewComponent implements OnInit, AfterViewInit, OnDestroy {

  private swiper: SwiperCore;
  public initDone: boolean = false;
  onSwiper(swiper: SwiperCore) {
    if (!this.initDone){
      this.swiper = swiper;
    }
  }
  onSlideChange() {
    if (this.initDone && (this.swiper.activeIndex == this.dataIndex+1 || this.swiper.activeIndex == this.dataIndex-1)) {
      this.dataIndex = this.swiper.activeIndex;
      this.med = this.data[this.dataIndex];
    } else {
      this.swiper.slideTo(this.dataIndex);
    }
  }
  @Input() public data: Media[] = [];
  @Input() dataIndex: number;
  private subscriptions = new Subscription();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  tagAutoComplete$: Observable<string> = null;
  groupAutoComplete$: Observable<Group> = null;

  commentInput = new FormControl('');
  descriptionInput = new FormControl('');
  tagCtrl = new FormControl('');
  groupCtrl = new FormControl('');
  titleInput = new FormControl('');

  addAccessShown = false;
  addCommentShown = false;
  addDescriptionShown = false;
  addTagShown = false;
  public addTitleShown = false;
  setDateShown = false;
  med: Media;
  users: User[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  localTags: string[] = [];
  localGroups: Group[] = [];
  sourceURL: string = "";

  constructor(
    public activeModal: NgbActiveModal,
    private mediaService: MediaService,
    private tagService: TagService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private keycloakService: KeycloakService,
    private userService: UserService,
    private cookieService: CookieService,
  ) { }

  async ngOnInit() {
    this.med = this.data[this.dataIndex];
    this.descriptionInput.setValue(this.med.description);
    this.titleInput.setValue(this.med.title);
    const url = this.url(true);
    let path = url.substring(url.indexOf("://") + 3);
    let domain = path.split("/", 1)[0];
    path = path.replace(domain, "").split("?", 1)[0];
    this.cookieService.set(
      "keycloak-jwt",
      await this.keycloakService.getToken(),
      1,
      path,
      domain,
      true,
      'Lax',
      );
    this.sourceURL = url;
    this.swiper.slideTo(this.dataIndex);
    this.initDone = true;
  }

  async ngAfterViewInit() {
    // prepare view
    // this.descriptionInput.setValue(this.med.description);
    // this.titleInput.setValue(this.med.title);
    // const url = this.url(true);
    // let path = url.substring(url.indexOf("://") + 3);
    // let domain = path.split("/", 1)[0];
    // path = path.replace(domain, "").split("?", 1)[0];
    // this.cookieService.set(
    //   "keycloak-jwt",
    //   await this.keycloakService.getToken(),
    //   1,
    //   path,
    //   domain,
    //   true,
    //   'Lax',
    //   );
    //   this.sourceURL = url;
    // this.subscriptions.add(
    //   // this.route.params.subscribe(param => {
    //     // receive media object
    //     this.mediaService.getMediaByID(this.data[this.dataIndex].id).subscribe(async (data: Media) => {
    //       this.med = data;
    //       this.descriptionInput.setValue(this.med.description);
    //       this.titleInput.setValue(this.med.title);
    //       const url = this.url(true);
    //       let path = url.substring(url.indexOf("://") + 3);
    //       let domain = path.split("/", 1)[0];
    //       path = path.replace(domain, "").split("?", 1)[0];
    //       this.cookieService.set(
    //         "keycloak-jwt",
    //         await this.keycloakService.getToken(),
    //         1,
    //         path,
    //         domain,
    //         true,
    //         'Lax',
    //         );
    //         this.sourceURL = url;
    //       // this.subscriptions.add(this.userService.preauthNode(this.med.nodes[0]).subscribe(() => this.sourceURL = this.url(true)));
    //     })
    //   // })
    // );
    // pull tags
    this.receiveTags();
    // pull groups
    this.receiveGroups();

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getProfileImage(username: string): string {
    if (this.med.users != null) {
      this.med.users.forEach(user => {
        if (user.username === username) {
          return user.urlImage;
        }
      });
    }
    return 'assets/profile.svg';
  }

  receiveTags() {
    this.tagAutoComplete$ = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(200),
      // use switch map to cancel previous subscribed events, before creating new
      switchMap(value => {
        if (value !== '' && value != null) {
          return this.tagService.tagPreview(value);
        } else {
          // no value present
          return of(null);
        }
      })
    );
  }

  receiveGroups() {
    this.groupAutoComplete$ = this.groupCtrl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(200),
      switchMap(value => {
        if (value !== '' && value != null) {
          return this.groupService.groupPreview(value);
        } else {
          // no value present
          return of(null);
        }
      })
    );
  }

  submitTagForm() {
    if (this.localTags.length === 0) {
      return;
    }
    // append new tags (comma separated)
    this.localTags = HelperService.tidyTags(this.localTags);
    // post to database
    // add tags
    this.subscriptions.add(
      this.mediaService.addTags(this.med.id, this.localTags).subscribe(res => {
        if (res.status === 200) {
          this.tagCtrl.setValue('');
          this.localTags = [];
          this.med = res.body as Media;
          this.addTagShown = false;
        }
      }, err => {
        console.error('Error:' + err);
      })
    );
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = input.value;

    // Add tag
    if ((value || '').trim()) {
      this.localTags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue('');
  }

  addGroup(event: MatChipInputEvent): void {
    const input = event.input;
    const value = input.value as Group;

    // Add Group
    if ((value.title || '').trim()) {
      value.title = value.title.trim();
      this.localGroups.push(value);
    }

    //  Reset the input value
    if (input) {
      input.value = null;
    }

    this.groupCtrl.setValue('');
  }

  isVideo(): boolean {
    if (this.med.contentType.startsWith('video')) {
      return true;
    }
    return false
  }

  onNoClick(): void {
    this.activeModal.close({canceled: true, media: this.data} as MediaMessage);
  }

  openSource(): void {
    window.open(this.url(true));
  }

  removeTag(tag: string): void {
    this.localTags = HelperService.removeItem<string>(tag, this.localTags);
  }

  removeGroup(group: Group) {
    this.localGroups = HelperService.removeItem<Group>(group, this.localGroups);
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.localTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue('');
  }

  selectedGroup(event: MatAutocompleteSelectedEvent): void {
    this.localGroups.push(event.option.value);
    this.groupInput.nativeElement.value = '';
    this.groupCtrl.setValue('');
  }

  submitAccessForm(): void {
    if (this.localGroups.length === 0) {
      return;
    }
    // append new tags (comma separated)
    this.localGroups = HelperService.tidyGroups(this.localGroups);
    // post to database
    // add tags
    this.subscriptions.add(
      this.mediaService.addMediaGroupMap({MediaIDs: [this.med.id], Groups: this.localGroups} as MediaGroupMap).subscribe(res => {
        if (res.status === 200) {
          this.groupCtrl.setValue('');
          this.localGroups = [];
          this.med = (res.body as Media[])[0];
          this.addAccessShown = false;
        }
      }, err => {
        console.error('Error:' + err);
      })
    );
  }

  submitCommentForm() {
    const input = this.commentInput.value.trim();
    if (input === '') {
      return;
    }
    this.subscriptions.add(
      this.mediaService.addComment(this.med.id, { comment: input }).subscribe(res => {
        if (res.status === 200) {
          this.commentInput.setValue('');
          this.med = res.body as Media;
          this.addCommentShown = false;
        }
      }, err => {
        console.error('Error:' + err);
      })
    );
  }

  submitDateForm(event: MatDatepickerInputEvent<Date>) {
    this.med.timestamp = event.value.getTime() / 1000;
    this.mediaService.setTimestamp(this.med.id, this.med).subscribe(res => {
      if (res.status === 200) {
        this.med = res.body as Media;
        this.setDateShown = false;
      }
    }, err => {
      console.error('Error' + err);
    });
  }

  submitDescriptionForm() {
    this.med.description = this.descriptionInput.value.trim();
    this.mediaService.setDescription(this.med.id, this.med).subscribe(res => {
      if (res.status === 200) {
        this.med = res.body as Media;
        this.descriptionInput.setValue(this.med.description);
        this.addDescriptionShown = false;
      }
    }, err => {
      console.error('Error:' + err);
    });
  }

  submitTimestampForm() {
  }

  submitTitleForm() {
    this.med.title = this.titleInput.value.trim();
    this.mediaService.setTitle(this.med.id, this.med).subscribe(res => {
      if (res.status === 200) {
        this.med = res.body as Media;
        this.titleInput.setValue(this.med.title);
        this.addTitleShown = false;
      }
    }, err => {
      console.error('Error:' + err);
    });
  }

  showGroup(group: Group): void {
    const dialogRef = this.dialog.open(ModalUserGroupComponent, {
      width: '250px',
      data: group,
    });
  }

  url(cookieAuth: boolean): string {
    return HelperService.resourceURL(this.med, this.keycloakService.getUsername(), cookieAuth);
  }

  // async aurl(): Promise<string> {
  //   await this.userService.preauthNode(this.med.nodes[0]).toPromise();
  //   return HelperService.resourceURL(this.med, this.keycloakService.getUsername(), true);
  // }

  next(): void {
    this.med = this.data[++this.dataIndex];
  }

  previous(): void {
    this.med = this.data[--this.dataIndex];
  }

}
