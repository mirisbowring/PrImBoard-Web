import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService, private cookieService: CookieService) { }

  public isAuthenticated(): boolean {
    if (!this.cookieService.check('stoken')) {
      return false;
    }
    return true;
  }


}
