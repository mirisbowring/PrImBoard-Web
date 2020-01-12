import { Injectable } from '@angular/core';

import { Adapter } from './adapter';
import { Event, EventJson } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventAdapter implements Adapter<Event> {
  adapt(item: any): Event {
    return new Event(
      item._id,
      item.title,
      item.description,
      item.comments,
      item.creator,
      item.groups,
      item.timestamp_creation,
      item.timestamp_start,
      item.timestamp_end,
      item.url,
      item.url_thumb
    );
  }
}
