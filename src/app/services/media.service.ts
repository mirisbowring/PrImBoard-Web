import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Media, MediaEventMap, MediaGroupMap } from 'src/app/models/media';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { Group } from 'src/app/models/group';
import { TagMediaMap } from '../models/tagmediamap';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient: HttpClient) { }

  public addComment(id: string, comment: Comment) {
    return this.httpClient.post(
      environment.gateway + '/api/v1/media/' + id + '/comment',
      comment,
      { observe: 'response', withCredentials: true }
    );
  }

  public addGroups(id: string, groups: Group[]) {
    return this.httpClient.post(
      environment.gateway + '/api/v1/media/' + id + '/usergroups',
      groups,
      { observe: 'response', withCredentials: true}
    );
  }

  public addTags(id: string, tags: string[]) {
    return this.httpClient.post(
      environment.gateway + '/api/v1/media/' + id + '/tags',
      tags,
      { observe: 'response', withCredentials: true }
    );
  }

  public addMediaEventMap(mem: MediaEventMap) {
    return this.httpClient.post(
      environment.gateway + '/api/v1/media/mapevents',
      mem,
      { observe: 'response', withCredentials: true }
    );
  }

  public addMediaGroupMap(mgm: MediaGroupMap) {
    return this.httpClient.post(environment.gateway + '/api/v1/media/addgroups', mgm, { observe: 'response', withCredentials: true });
  }

  public addTagMediaMap(tmm: TagMediaMap) {
    return this.httpClient.post(environment.gateway + '/api/v1/media/maptags', tmm, { observe: 'response', withCredentials: true });
  }

  public createMedia(media: Media) {
    return this.httpClient.post(environment.gateway + '/api/v1/media', media, { observe: 'response', withCredentials: true });
  }

  public deleteMediaByID(id: string) {
    return this.httpClient.delete(environment.gateway + '/api/v1/media/' + id, { observe: 'response', withCredentials: true });
  }

  public deleteMediaByIDs(ids: string[]) {
    return this.httpClient.post(environment.gateway + '/api/v1/media/remove', ids, { observe: 'response', withCredentials: true });
  }

  public getMediaPage(id: string, size: number, filter: string, param: string, event: string, asc: boolean): Observable<Media[]> {
    size = (size != null && size > 0) ? size : environment.defaultPageSize;
    let query = '';
    query += (id) ? param ? '?' + param + '=' + id : '?after=' + id : '';
    query += (query) ? '&size=' + size : '?size=' + size;
    query += (event) ? '&event=' + event : '';
    query += (filter) ? '&filter=' + filter : '';
    query += (asc) ? '&asc=' + asc : '';
    return this.httpClient.get<Media[]>(environment.gateway + '/api/v1/media' + query, { withCredentials: true });
  }

  public getAllMedia() {
    return this.httpClient.get(environment.gateway + '/api/v1/media', { withCredentials: true });
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

  public uploadMedia(formData) {
    return this.httpClient.post(environment.gateway + '/api/v1/media/upload', formData,
      { reportProgress: true, observe: 'events', withCredentials: true }
    )
  }

  /**
   *
   * @param id id of the media
   * @param media an Media Object with description field set
   */
  public setDescription(id: string, media: Media) {
    return this.httpClient.put(
      environment.gateway + '/api/v1/media/' + id + '/description',
      media,
      { observe: 'response', withCredentials: true }
    );
  }

  /**
   *
   * @param id id of the media
   * @param media an Media Object with timestamp field set
   */
  public setTimestamp(id: string, media: Media) {
    return this.httpClient.put(
      environment.gateway + '/api/v1/media/' + id + '/timestamp',
      media,
      { observe: 'response', withCredentials: true }
    );
  }

  /**
   *
   * @param id id of the media
   * @param media an Media Object with title field set
   */
  public setTitle(id: string, media: Media) {
    return this.httpClient.put(
      environment.gateway + '/api/v1/media/' + id + '/title',
      media,
      { observe: 'response', withCredentials: true }
    );
  }
}
