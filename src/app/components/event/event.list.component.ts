import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './event.list.component.html',
  styleUrls: ['./event.list.component.css']
})
export class ListComponent implements AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();

  events = [];

  constructor(private eventService: EventService) { }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.eventService.getAllEvents().subscribe((data: Event[]) => this.events = data)
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
