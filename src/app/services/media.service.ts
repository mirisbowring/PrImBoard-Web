
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Media } from 'src/app/models/media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient: HttpClient) { }

  public createMedia(media: Media) {
    return this.httpClient.post(environment.gateway + '/api/v1/media', media, {observe: 'response', withCredentials: true});
  }

  public getAllMedia() {
    return this.httpClient.get(environment.gateway + '/api/v1/media');
  }
}
