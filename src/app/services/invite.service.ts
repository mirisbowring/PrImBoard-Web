import { Invite } from '../models/invite';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  constructor(private httpClient: HttpClient) { }

  public getInviteToken() {
    return this.httpClient.get<Invite>(environment.gateway + '/api/v1/user/invite', { withCredentials: true });
  }
}
