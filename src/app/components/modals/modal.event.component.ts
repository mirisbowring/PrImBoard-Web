import { Component, OnDestroy, ViewChild, Input } from '@angular/core';
import { Event } from 'src/app/models/event';
import { Media, MediaEventMap } from 'src/app/models/media';
import { Observable, Subscription } from 'rxjs';
import { startWith, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { MediaService } from 'src/app/services/media.service';
import { EventService } from 'src/app/services/event.service';
import { NgbActiveModal, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { MediaMessage } from 'src/app/models/message';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-modal-event',
  templateUrl: './modal.event.component.html',
})
export class ModalEventComponent implements OnDestroy {

  @Input() data: Media[] = [];
  private subscriptions = new Subscription();
  @ViewChild(NgbTypeahead) ngbTypeahead: NgbTypeahead;

  chipCancelHover = false;

  localEvents: Event[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private eventService: EventService,
    private mediaService: MediaService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  events = (text$: Observable<string>) =>
    text$.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term === '' || term == null) {
          return [];
        } else if (term.endsWith(',')) {
          this.addEvent(term);
          return [];
        } else {
          return this.eventService.eventPreview(term);
        }
      })
    );

  formatter = (event: Event) => event.title;

  addEvents(): void {
    if (this.localEvents.length === 0) {
      return;
    }
    // append events
    this.localEvents = HelperService.tidyEvents(this.localEvents);
    const ids: string[] = [];
    for (const m of this.data) {
      ids.push(m.id);
    }
    // post to database
    this.subscriptions.add(
      this.mediaService.addMediaEventMap({ MediaIDs: ids, Events: this.localEvents } as MediaEventMap).subscribe(res => {
        if (res.status === 200) {
          this.activeModal.close({updated: true, media: res.body as Media[]} as MediaMessage);
        }
      }, err => console.log('Error:' + err.error.error))
    );
  }

  addEvent(input: string): void {
    const tmp = input.trim().split(',').join('');
    if (tmp.length >= 1) {
      this.localEvents.push({title: tmp});
    }

    // Reset the input value
    this.ngbTypeahead.writeValue('');
    this.ngbTypeahead.dismissPopup();
  }

  removeEvent(event: Event): void {
    this.localEvents = HelperService.removeItem<Event>(event, this.localEvents);
  }

  selectedEvent(event: NgbTypeaheadSelectItemEvent): void {
    this.localEvents.push(event.item);
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
