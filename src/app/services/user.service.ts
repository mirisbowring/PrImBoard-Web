import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public createUser(user: User) {
    console.log('Creating user' + user);
    return this.httpClient.post(environment.gateway + '/api/v1/user', user);
  }
}
