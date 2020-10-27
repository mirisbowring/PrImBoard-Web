import { Component, AfterViewInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Event } from 'src/app/models/event';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EventMessage } from 'src/app/models/message';

@Component({
  selector: 'app-modal-event-edit',
  templateUrl: './modal.event.edit.component.html',
  styleUrls: ['./modal.event.edit.component.css']
})
export class ModalEventEditComponent implements AfterViewInit, OnDestroy {

  @Input() data: Event = {};
  model: NgbDateStruct;
  @ViewChild('NgbdDatepicker') d: NgbDateStruct;
  @ViewChild('NgbdDatepicker') d2: NgbDateStruct;
  private subscriptions = new Subscription();

  public eventForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    timestampStart: new FormControl({}),
    timestampEnd: new FormControl({}),
    urlThumb: new FormControl(''),
  });

  constructor(public activeModal: NgbActiveModal, private eventService: EventService) { }

  ngAfterViewInit() {
    this.eventForm.controls.title.setValue(this.data.title);
    this.eventForm.controls.description.setValue(this.data.description);
    this.eventForm.controls.timestampStart.setValue({
      day: new Date(this.data.timestampStart * 1000).getUTCDate(),
      month: new Date(this.data.timestampStart * 1000).getUTCMonth() + 1,
      year: new Date(this.data.timestampStart * 1000).getUTCFullYear()
    });
    this.eventForm.controls.timestampEnd.setValue({
      day: new Date(this.data.timestampEnd * 1000).getUTCDate(),
      month: new Date(this.data.timestampEnd * 1000).getUTCMonth() + 1,
      year: new Date(this.data.timestampEnd * 1000).getUTCFullYear()
    });
    this.eventForm.controls.urlThumb.setValue(this.data.urlThumb);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  deleteEvent() {
    this.subscriptions.add(
      this.eventService.deleteEvent(this.data.id).subscribe(res => {
        if (res.status === 200) {
          this.activeModal.close({deleted: true, event: this.data} as EventMessage);
        }
      })
    );
  }

  saveEvent() {
    this.data.title = this.eventForm.controls.title.value;
    this.data.description = this.eventForm.controls.description.value;
    let tmp = this.eventForm.controls.timestampStart.value;
    this.data.timestampStart = Math.round(new Date(tmp.year, tmp.month - 1, tmp.day).getTime() / 1000);
    tmp = this.eventForm.controls.timestampEnd.value
    this.data.timestampEnd = Math.round(new Date(tmp.year, tmp.month - 1, tmp.day).getTime() / 1000);
    this.data.urlThumb = this.eventForm.controls.urlThumb.value;
    this.eventService.updateEvent(this.data.id, this.data).subscribe((event: Event) => {
      if (event != null) {
        this.data = event;
      }
      this.activeModal.close({updated: true, event: this.data} as EventMessage);
    })
  }

  onNoClick(): void {
    this.activeModal.close({canceled: true, event: this.data} as EventMessage);
  }

}
