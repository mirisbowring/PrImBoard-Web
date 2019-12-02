import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  public createUserForm = new FormGroup({
    username: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    password: new FormControl(''),
    password_rep: new FormControl('')
  });

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  public submitCreateUserForm() {
    if (this.createUserForm.controls.password.value !== this.createUserForm.controls.password_rep.value) {

    } else if (this.createUserForm.controls.password.value !== '') {

    }
    // map the form to the user model and create a post
    this.userService.createUser(
      new User(
        this.createUserForm.controls.username.value,
        this.createUserForm.controls.firstname.value,
        this.createUserForm.controls.lastname.value,
        this.createUserForm.controls.password.value
      )
    ).subscribe();
  }

}
