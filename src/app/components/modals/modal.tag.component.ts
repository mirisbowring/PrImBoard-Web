import { Component, OnDestroy, ViewChild, Input } from '@angular/core';
import { Media } from 'src/app/models/media';
import { TagService } from 'src/app/services/tag.service';
import { Observable, Subscription } from 'rxjs';
import { startWith, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { MediaService } from 'src/app/services/media.service';
import { NgbActiveModal, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { MediaMessage } from 'src/app/models/message';
import { HelperService } from 'src/app/services/helper.service';


@Component({
  selector: 'app-modal-tag',
  templateUrl: './modal.tag.component.html',
})
export class ModalTagComponent implements OnDestroy {

  @Input() data: Media[] = [];
  private subscriptions = new Subscription();
  @ViewChild(NgbTypeahead) ngbTypeahead: NgbTypeahead;

  localTags: string[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private tagService: TagService,
    private mediaService: MediaService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  tags = (text$: Observable<string>) =>
    text$.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term === '' || term == null) {
          return [];
        } else if (term.endsWith(',')) {
          this.addTag(term);
          return [];
        } else {
          return this.tagService.tagPreview(term);
        }
      })
    )

  addTags(): void {
    if (this.localTags.length === 0) {
      return;
    }
    // append new tags (comma separated)
    this.localTags = HelperService.tidyTags(this.localTags);
    const ids: string[] = []
    for (const m of this.data) {
      ids.push(m.id);
    }
    // post to database
    // add tags
    this.subscriptions.add(
      this.mediaService.addTagMediaMap({ IDs: ids, Tags: this.localTags }).subscribe(res => {
        if (res.status === 200) {
          this.activeModal.close({updated: true, media: res.body as Media[]} as MediaMessage);
        }
      }, err => console.error('Error:' + err))
    );
  }

  addTag(input: string): void {

    // Add tag
    const tmp = input.trim().split(',').join('');
    if (tmp.length >= 1) {
      this.localTags.push(tmp);
    }

    // Reset the input value
    this.ngbTypeahead.writeValue('');
    this.ngbTypeahead.dismissPopup();
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

  selectedTag(event: NgbTypeaheadSelectItemEvent): void {
    this.localTags.push(event.item);
    this.ngbTypeahead.writeValue('');
    // prevent from appending after this method
    event.preventDefault();
  }

  toggleChipCancel(chip: string): void {
    HelperService.toggleChipCancel(chip);
  }

  onNoClick(): void {
    this.activeModal.close({canceled: true, media: this.data} as MediaMessage);
  }

}
