
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient: HttpClient) { }

  public getAllMedia() {
    return this.httpClient.get(environment.gateway + '/api/v1/media');
  }
}
