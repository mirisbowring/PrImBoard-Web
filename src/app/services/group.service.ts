import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private httpClient: HttpClient) { }

  public getAllUserGroups() {
    return this.httpClient.get<Group[]>(environment.gateway + '/api/v1/usergroups', { withCredentials: true });
  }
}
