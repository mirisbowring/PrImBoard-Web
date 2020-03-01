import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-create',
  templateUrl: './event.create.component.html',
  styleUrls: ['./event.create.component.css']
})
export class CreateComponent implements OnInit {

  public nForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    creator: new FormControl(''),
    timestampStart: new FormControl(new Date()),
    timestampEnd: new FormControl(new Date()),
    url: new FormControl(''),
    urlThumb: new FormControl(''),
  });


  constructor(private eventService: EventService) { }

  ngOnInit() {
  }

  submitnForm() {
    let event: Event;
    event = this.nForm.getRawValue();
    // convert dates to unix timestamps
    event.timestampStart = Math.round((this.nForm.controls.timestampStart.value as Date).getTime() / 1000);
    event.timestampEnd = Math.round((this.nForm.controls.timestampEnd.value as Date).getTime() / 1000);
    this.eventService.createEvent(event).subscribe();
  }

}
