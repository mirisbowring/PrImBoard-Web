import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private formSubmitAttempt: boolean;
  show = false;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  submitlForm() {
    this.userService.loginUser(this.loginForm.getRawValue()).subscribe(
      res => {
        if (res.status === 200) {
          localStorage.setItem('username', this.loginForm.controls.username.value);
          this.router.navigate(['/home']);
        }
      },
      err => {
        console.log('Error:' + err);
        localStorage.removeItem('username');
      }
    );
    this.formSubmitAttempt = true;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
      (this.loginForm.get(field).untouched && this.formSubmitAttempt)
    );
  }

}
