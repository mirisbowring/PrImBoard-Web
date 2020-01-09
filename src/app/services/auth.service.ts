import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService, private cookieService: CookieService) { }

  public isAuthenticated(): boolean {
    const username = localStorage.getItem('username');
    if (!this.cookieService.check('stoken')) {
      return false;
    }
    return true;
  }
}
