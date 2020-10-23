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

  /* --- NODES --- */

  public createNode(node: Node) {
    return this.httpClient.post(environment.gateway + '/api/v1/user/node', node, { observe: 'response', withCredentials: true });
  }

  public deleteNode(id: string) {
    return this.httpClient.delete(
      environment.gateway + '/api/v1/user/node/' + id, { observe: 'response', withCredentials: true });
  }

  public getNode(id: string) {
    return this.httpClient.get<Node>(environment.gateway + '/api/v1/user/node/' + id, { withCredentials: true });
  }

  public getNodes() {
    return this.httpClient.get<Node[]>(environment.gateway + '/api/v1/user/nodes', { withCredentials: true });
  }

  public updateNode(id: string, node: Node) {
    return this.httpClient.put<Node>(environment.gateway + '/api/v1/user/node/' + id, node, { withCredentials: true });
  }

}
