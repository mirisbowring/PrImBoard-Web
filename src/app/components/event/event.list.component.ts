import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-events',
  templateUrl: './event.list.component.html',
  styleUrls: ['./event.list.component.css']
})
export class ListComponent implements AfterViewInit {

  events = [];

  constructor(private eventService: EventService) { }

  ngAfterViewInit() {
    // this.eventService.getAllEvents().pipe(
    //   map((data: any[]) => data.map(item => this.adapter.adapt(item)))
    // ).subscribe((data: any[]) => this.events = data);
    // this.eventService.getAllEvents().pipe(
    //   map(data => data.map(Event.adapt))
    // ).subscribe((data: Event[]) => this.events = data);
    this.eventService.getAllEvents().subscribe((data: Event[]) => this.events = data);
  }

}
