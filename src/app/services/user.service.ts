import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public createUser(user: User) {
    return this.httpClient.post(environment.gateway + '/api/v1/user', user);
  }

  public loginUser(user: User) {
    return this.httpClient.post(environment.gateway + '/api/v1/login', user, {observe: 'response', withCredentials: true});
  }

  public loggedIn(user: User) {
    return this.httpClient.post(environment.gateway + '/api/v1/loggedin', user, {observe: 'response', withCredentials: true});
  }
}
