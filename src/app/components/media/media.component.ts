import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { FormControl } from '@angular/forms';
import { Tag } from 'src/app/models/tag';
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
import { ModalUserGroupComponent } from '../modals/modal.usergroup.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  tagAutoComplete$: Observable<Tag> = null;
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
  addTitleShown = false;
  setDateShown = false;
  med: Media;
  users: User[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  localTags: Tag[] = [];
  localGroups: Group[] = [];

  constructor(
    private mediaService: MediaService,
    private tagService: TagService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.route.params.subscribe(param => {
        // receive media object
        this.mediaService.getMediaByID(param.id).subscribe((data: Media) => {
          this.med = data;
          this.descriptionInput.setValue(this.med.description);
          this.titleInput.setValue(this.med.title);
        });
      })
    );
    // pull tags
    this.receiveTags();
    // pull groups
    this.receiveGroups();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getProfileImage(username: string): string {
    this.med.users.forEach(user => {
      if (user.username === username) {
        return user.urlImage;
      }
    });
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
    this.localTags = this.tidyTags(this.localTags);
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
        console.log('Error:' + err);
      })
    );
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = input.value;

    // Add tag
    if ((value || '').trim()) {
      this.localTags.push({ name: value.trim() });
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

  removeTag(tag: Tag): void {
    this.localTags = this.removeItem<Tag>(tag, this.localTags);
  }

  removeGroup(group: Group) {
    this.localGroups = this.removeItem<Group>(group, this.localGroups);
  }

  removeItem<T>(item: T, list: T[]): T[] {
    const index = list.indexOf(item);
    if (index >= 0) {
      list.splice(index, 1);
    }
    return list;
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.localTags.push({ name: event.option.viewValue });
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
    this.localGroups = this.tidyGroups(this.localGroups);
    // post to database
    // add tags
    this.subscriptions.add(
      this.mediaService.addGroups(this.med.id, this.localGroups).subscribe(res => {
        if (res.status === 200) {
          this.groupCtrl.setValue('');
          this.localGroups = [];
          this.med = res.body as Media;
          this.addAccessShown = false;
        }
      }, err => {
        console.log('Error:' + err);
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
        console.log('Error:' + err);
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
      console.log('Error' + err);
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
      console.log('Error:' + err);
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
      console.log('Error:' + err);
    });
  }

  showGroup(group: Group): void {
    const dialogRef = this.dialog.open(ModalUserGroupComponent, {
      width: '250px',
      data: group,
    });
  }

  /** Removes trailing and leading whitespaces and ignore duplicates, lowers case */
  tidyTags(myArr: Tag[]): Tag[] {
    for (const tag of myArr) {
      tag.name = tag.name.trim();
      // tag.name = tag.name.trim().toLowerCase();
    }
    return myArr.filter((thing, index, self) => self.findIndex(t => t.name === thing.name) === index);
  }

  /** Removes trailing and leading whitespaces and ignores duplicates */
  tidyGroups(groups: Group[]): Group[] {
    for (const group of groups) {
      group.title = group.title.trim();
    }
    return groups.filter((thing, index, self) => self.findIndex(g => g.title === thing.title) === index);
  }
}
