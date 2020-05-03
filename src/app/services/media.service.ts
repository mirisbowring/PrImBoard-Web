
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Media } from 'src/app/models/media';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient: HttpClient) { }

  public addTags(id: string, tags: Tag[]) {
    return this.httpClient.post(environment.gateway + '/api/v1/media/' + id + '/tags', tags, { observe: 'response', withCredentials: true});
  }

  public createMedia(media: Media) {
    return this.httpClient.post(environment.gateway + '/api/v1/media', media, { observe: 'response', withCredentials: true });
  }

  public getMediaPage(id: string, size: number, filter: string, param: string): Observable<Media[]> {
    size = (size != null && size > 0) ? size : environment.defaultPageSize;
    let query = '';
    query += (id) ? param ? '?' + param + '=' + id : '?after=' + id : '';
    query += (query) ? '&size=' + size : '?size=' + size;
    query += (filter) ? '&filter=' + filter : '';
    return this.httpClient.get<Media[]>(environment.gateway + '/api/v1/media' + query, { withCredentials: true });
  }

  public getAllMedia() {
    return this.httpClient.get(environment.gateway + '/api/v1/media', { withCredentials: true });
  }

  public getMediaByHash(hash: string) {
    return this.httpClient.get(environment.gateway + '/api/v1/mediaByHash/' + hash, { withCredentials: true });
  }

  public getMediaByID(id: string) {
    return this.httpClient.get(environment.gateway + '/api/v1/media/' + id, { withCredentials: true });
  }

  public updateMediaByHash(hash: string, media: Media) {
    return this.httpClient.put(environment.gateway + '/api/v1/mediaByHash/' + hash, media, { observe: 'response', withCredentials: true });
  }

  public updateMediaByID(id: string, media: Media) {
    return this.httpClient.put(environment.gateway + '/api/v1/media/' + id, media, { observe: 'response', withCredentials: true });
  }
}
