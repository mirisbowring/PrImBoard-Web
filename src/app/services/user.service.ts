import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Node } from 'src/app/models/node';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public createUser(user: User) {
    return this.httpClient.post(environment.gateway + '/api/v1/user', user, { observe: 'response', withCredentials: true });
  }

  public getUser(username: string) {
    return this.httpClient.get(environment.gateway + '/api/v1/user/' + username, { withCredentials: true });
  }

  public loginUser(user: User) {
    return this.httpClient.post(environment.gateway + '/api/v1/login', user, { observe: 'response', withCredentials: true });
  }

  public loggedIn(user: User) {
    return this.httpClient.post(environment.gateway + '/api/v1/loggedin', user, { observe: 'response', withCredentials: true });
  }

  public logoutUser() {
    return this.httpClient.post(environment.gateway + '/api/v1/logout', null, { observe: 'response', withCredentials: true });
  }

  public preauthNode(node: Node) {
    return this.httpClient.get(node.APIEndpoint + '/api/v1/session', {withCredentials: true} );
  }

}
