import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService) { }

  public isAuthenticated(): boolean {
    const username = localStorage.getItem('username');
    if (username === null) {
      console.log('no token');
      return false;
    }
    // this.userService.loggedIn(new User().User(username)).subscribe(
    //   res => {
    //     console.log('success');
    //     this.ret = true;
    //   },
    //   err => {
    //     console.log('fail');
    //     this.ret = false;
    //   });
    // check if expired
    return true;
  }
}
