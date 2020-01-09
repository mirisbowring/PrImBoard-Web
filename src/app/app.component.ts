import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'PrImBoard-Web';

  constructor(private userService: UserService, private router: Router) { }

  doLogout() {
    this.userService.logoutUser().subscribe(
      res => {
        if (res.status === 204) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
