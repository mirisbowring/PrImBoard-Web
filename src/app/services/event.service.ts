import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Event } from 'src/app/models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private httpClient: HttpClient) { }

  public createEvent(event: Event) {
    return this.httpClient.post(environment.gateway + '/api/v1/event', event, { observe: 'response', withCredentials: true });
  }

  public getAllEvents() {
    return this.httpClient.get<Event[]>(environment.gateway + '/api/v1/events', { withCredentials: true });
  }

  public eventPreview(event: string) {
    return this.httpClient.get<Event[]>(environment.gateway + '/api/v1/events/' + event, { withCredentials: true });
  }
}
