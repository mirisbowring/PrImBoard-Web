import { Component, Inject, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tag } from 'src/app/models/tag';
import { Media } from 'src/app/models/media';
import { TagService } from 'src/app/services/tag.service';
import { Observable, of, Unsubscribable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { CombineSubscriptions } from 'ngx-destroy-subscribers';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MediaService } from 'src/app/services/media.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-modal-tag',
  templateUrl: './modal.tag.component.html',
  styleUrls: ['./modal.tag.component.css']
})
export class ModalTagComponent implements AfterViewInit, OnDestroy {

  @CombineSubscriptions()
  private subscribers: Unsubscribable;
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;

  tagAutoComplete$: Observable<Tag> = null;
  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];

  localTags: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalTagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Media[],
    private tagService: TagService,
    private mediaService: MediaService,
  ) { }

  ngAfterViewInit() {
    // pull tags
    this.receiveTags();
  }

  ngOnDestroy() {

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

  addTags(): void {
    if (this.localTags.length === 0) {
      return;
    }
    // append new tags (comma separated)
    this.localTags = this.tidyTags(this.localTags);
    const ids: string[] = []
    for (const m of this.data) {
      ids.push(m.id);
    }
    // post to database
    // add tags
    this.subscribers = this.mediaService.addTagMediaMap({ IDs: ids, Tags: this.localTags }).subscribe(res => {
      if (res.status === 200) {
        this.dialogRef.close(res.body as Media[]);
      }
    }, err => console.log('Error:' + err));
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

  removeTag(tag: string): void {
    this.localTags = this.removeItem<string>(tag, this.localTags);
  }

  removeItem<T>(item: T, list: T[]): T[] {
    const index = list.indexOf(item);
    if (index >= 0) {
      list.splice(index, 1);
    }
    return list;
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.localTags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue('');
  }

  /** Removes trailing and leading whitespaces and ignore duplicates, lowers case */
  tidyTags(myArr: string[]): string[] {
    for (let i = 0; i < this.localTags.length; i++) {
      this.localTags[i] = this.localTags[i].trim();
    }
    return myArr.filter((thing, index, self) => self.findIndex(t => t === thing) === index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
