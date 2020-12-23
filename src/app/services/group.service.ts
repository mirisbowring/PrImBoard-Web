import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Group } from 'src/app/models/group';
// import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private httpClient: HttpClient) { }

  public getAllUserGroups() {
    return this.httpClient.get<Group[]>(environment.gateway + '/api/v1/usergroups', { withCredentials: true });
  }

  public addUsersToGroup(users: string[], group: string) {
    return this.httpClient.post<Group>(
      environment.gateway + '/api/v1/usergroup/' + group + '/users',
      users,
      { observe: 'response', withCredentials: true }
    );
  }

  public groupPreview(name: string): Observable<Group[]> {
    return this.httpClient.get<Group[]>(environment.gateway + '/api/v1/usergroups/' + name, {withCredentials: true});
  }

  public removeUserFromGroup(user: string, group: string) {
    return this.httpClient.delete<Group>(
      environment.gateway + '/api/v1/usergroup/' + group + '/user/' + user,
      { observe: 'response', withCredentials: true }
    );
  }
}
