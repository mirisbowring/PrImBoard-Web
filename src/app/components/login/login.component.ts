import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  private formSubmitAttempt: boolean;
  show = false;

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private userService: UserService, private router: Router, private readonly keycloak: KeycloakService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  submitlForm() {
    this.subscriptions.add(
      // this.userService.loginUser(this.loginForm.getRawValue()).subscribe(
      //   res => {
      //     if (res.status === 200) {
      //       localStorage.setItem('username', this.loginForm.controls.username.value);
      //       this.router.navigate(['/home']);
      //     }
      //   },
      //   err => {
      //     console.error('Error:' + err);
      //     localStorage.removeItem('username');
      //   }
      // )
    );
    this.formSubmitAttempt = true;
  }

  public login() {
    this.keycloak.login();
  }

  isFieldInvalid(field: string) {
    return (
      (!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
      (this.loginForm.get(field).untouched && this.formSubmitAttempt)
    );
  }

}
