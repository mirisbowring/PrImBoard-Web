import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MediaService } from 'src/app/services/media.service';
import { Media } from 'src/app/models/media';
import { FormGroup, FormControl } from '@angular/forms';
import { Tag } from 'src/app/models/tag';
import { TagService } from 'src/app/services/tag.service';
import { startWith, debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit, AfterViewInit {

  tagAutoComplete$: Observable<Tag> = null;

  tagForm = new FormGroup({
    name: new FormControl('')
  });

  med: Media;

  private hash;

  constructor(private mediaService: MediaService, private tagService: TagService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // receive hash from current url
    const tmp = location.href;
    const parts = tmp.split('/');
    this.hash = parts[parts.length - 1];
    // receive media object
    this.mediaService.getMediaByHash(this.hash).subscribe((data: Media) => {
      this.med = data;
    });
    // pull tags
    this.receiveTags();
  }

  receiveTags() {
    this.tagAutoComplete$ = this.tagForm.controls.name.valueChanges.pipe(
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
    const input = this.tagForm.controls.name.value;
    if (input === '') {
      return;
    }
    let tags: Tag[] = [];
    // add existing tags to tmp tag list
    if (this.med.tags) {
      this.med.tags.forEach(t => tags.push(t));
    }
    // clear and reinit models tags (if not you will get concurrency problems)
    this.med.tags = [];
    // append new tags (comma separated)
    input.split(',').forEach(tag => tags.push({ name: tag }));
    tags = this.tidyTags(tags);
    // post to database
    // add tags
    this.med.tags = tags;
    this.mediaService.updateMediaByHash(this.hash, this.med).subscribe(res => {
      if (res.status === 200) {
        this.tagForm.controls.name.setValue('');
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
