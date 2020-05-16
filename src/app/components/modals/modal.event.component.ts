import { Component, Inject, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from 'src/app/models/event';
import { Media } from 'src/app/models/media';
import { Observable, of, Unsubscribable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap } from 'rxjs/operators';
import { CombineSubscriptions } from 'ngx-destroy-subscribers';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MediaService } from 'src/app/services/media.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-modal-event',
  templateUrl: './modal.event.component.html',
  styleUrls: ['./modal.event.component.css']
})
export class ModalEventComponent implements AfterViewInit, OnDestroy {

  @CombineSubscriptions()
  private subscribers: Unsubscribable;
  @ViewChild('eventInput') eventInput: ElementRef<HTMLInputElement>;

  eventAutoComplete$: Observable<Event> = null;
  eventCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];

  localEvents: Event[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Media[],
    private eventService: EventService,
    private mediaService: MediaService,
  ) { }

  ngAfterViewInit() {
    this.receiveEvents();
  }

  ngOnDestroy() {

  }

  receiveEvents() {
    this.eventAutoComplete$ = this.eventCtrl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(200),
      // use switch map to cancel previous subscribed events, before creating new
      switchMap(value => {
        if (value !== '' && value != null) {
          return this.eventService.eventPreview(value);
        } else {
          // no value present
          return of(null);
        }
      })
    );
  }

  addEvents(): void {
    if (this.localEvents.length === 0) {
      return;
    }
    // append events
    this.localEvents = this.tidyEvents(this.localEvents);
    const ids: string[] = [];
    for (const m of this.data) {
      ids.push(m.id);
    }
    // post to database
    this.subscribers = this.mediaService.addMediaEventMap({ MediaIDs: ids, Events: this.localEvents }).subscribe(res => {
      if (res.status === 200) {
        this.dialogRef.close(res.body as Media[]);
      }
    }, err => console.log('Error:' + err.error.error));
  }

  addEvent(event: MatChipInputEvent): void {
    const input = event.input;
    const value = input.value;

    if ((value || '').trim()) {
      this.localEvents.push({title: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.eventCtrl.setValue('');
  }

  removeEvent(event: Event): void {
    this.localEvents = this.removeItem<Event>(event, this.localEvents);
  }

  removeItem<T>(item: T, list: T[]): T[] {
    const index = list.indexOf(item);
    if (index >= 0) {
      list.splice(index, 1);
    }
    return list;
  }

  selectedEvent(event: MatAutocompleteSelectedEvent): void {
    this.localEvents.push(event.option.value);
    this.eventInput.nativeElement.value = '';
    this.eventCtrl.setValue('');
  }

  /** Removes trailing and leading whitespaces and ignore duplicates, lowers case */
  tidyEvents(myArr: Event[]): Event[] {
    return myArr.filter((thing, index, self) => self.findIndex(t => t.id === thing.id) === index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
