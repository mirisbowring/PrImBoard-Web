import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-invite',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public cuForm = new FormGroup({
    username: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    password: new FormControl(''),
    password_rep: new FormControl(''),
    token: new FormControl('')
  });

  public hide = true;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  public submitcuForm() {
    if (this.cuForm.controls.password.value !== this.cuForm.controls.password_rep.value) {
      return;
    }
    this.cuForm.removeControl('password_rep');
    // pass uform and check against contract
    this.userService.createUser(this.cuForm.getRawValue()).subscribe();
  }

}
