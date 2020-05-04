import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { FormControl } from '@angular/forms';
import { Tag } from 'src/app/models/tag';
import { TagService } from 'src/app/services/tag.service';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { of, Observable, Unsubscribable } from 'rxjs';
import { User } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { DestroySubscribers, CombineSubscriptions } from 'ngx-destroy-subscribers';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
@DestroySubscribers()
export class MediaComponent implements OnInit, AfterViewInit, OnDestroy {

  @CombineSubscriptions()
  private subscribers: Unsubscribable;

  tagAutoComplete$: Observable<Tag> = null;

  commentInput = new FormControl('');
  descriptionInput = new FormControl('');
  tagInput = new FormControl('');
  titleInput = new FormControl('');

  addCommentShown = false;
  addDescriptionShown = false;
  addTagShown = false;
  addTitleShown = false;
  med: Media;
  users: User[] = [];

  constructor(private mediaService: MediaService, private tagService: TagService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscribers = this.route.params.subscribe(param => {
      // receive media object
      this.mediaService.getMediaByID(param.id).subscribe((data: Media) => {
        this.med = data;
        this.descriptionInput.setValue(this.med.description);
        this.titleInput.setValue(this.med.title);
      });
    });
    // pull tags
    this.receiveTags();
  }

  ngOnDestroy() { }

  getProfileImage(username: string): string {
    this.med.users.forEach(user => {
      if (user.username === username) {
        return user.urlImage;
      }
    });
    return 'assets/profile.svg';
  }

  receiveTags() {
    this.tagAutoComplete$ = this.tagInput.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(200),
      // use switch map to cancel previous subscribed events, before creating new
      switchMap(value => {
        if (value !== '') {
          return this.tagService.tagPreview(value.toLowerCase());
        } else {
          // no value present
          return of(null);
        }
      })
    );
  }

  submitTagForm() {
    const input = this.tagInput.value;
    if (input === '') {
      return;
    }
    let tags: Tag[] = [];
    // append new tags (comma separated)
    input.split(',').forEach(tag => tags.push({ name: tag }));
    tags = this.tidyTags(tags);
    // post to database
    // add tags
    this.subscribers = this.mediaService.addTags(this.med.id, tags).subscribe(res => {
      if (res.status === 200) {
        this.tagInput.setValue('');
        this.med = res.body as Media;
        this.addTagShown = false;
      }
    }, err => {
      console.log('Error:' + err);
    });
  }

  submitCommentForm() {
    const input = this.commentInput.value.trim();
    if (input === '') {
      return;
    }
    this.subscribers = this.mediaService.addComment(this.med.id, { comment: input }).subscribe(res => {
      if (res.status === 200) {
        this.commentInput.setValue('');
        this.med = res.body as Media;
        this.addCommentShown = false;
      }
    }, err => {
      console.log('Error:' + err);
    });
  }

  submitDescriptionForm() {
    this.med.description = this.descriptionInput.value.trim();
    this.mediaService.updateMediaByHash(this.med.id, this.med).subscribe(res => {
      if (res.status === 200) {
        this.med = res.body as Media;
        this.descriptionInput.setValue(this.med.description);
        this.addDescriptionShown = false;
      }
    }, err => {
      console.log('Error:' + err);
    });
  }

  submitTitleForm() {
    this.med.title = this.titleInput.value.trim();
    this.mediaService.updateMediaByHash(this.med.id, this.med).subscribe(res => {
      if (res.status === 200) {
        this.med = res.body as Media;
        this.titleInput.setValue(this.med.title);
        this.addTitleShown = false;
      }
    }, err => {
      console.log('Error:' + err);
    });
  }

  /** Removes trailing and leading whitespaces and ignore duplicates */
  tidyTags(myArr: Tag[]): Tag[] {
    for (const tag of myArr) {
      tag.name = tag.name.trim().toLowerCase();
    }
    return myArr.filter((thing, index, self) => self.findIndex(t => t.name === thing.name) === index);
  }
}
