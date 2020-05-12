import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private httpClient: HttpClient) { }

  public tagPreview(name: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(environment.gateway + '/api/v1/tags/' + name, { withCredentials: true });
  }
}
