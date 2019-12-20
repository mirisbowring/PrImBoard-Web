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

  public cuForm = new FormGroup({
    username: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    password: new FormControl(''),
    password_rep: new FormControl('')
  });

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  public submitcuForm() {
    if (this.cuForm.controls.password.value !== this.cuForm.controls.password_rep.value) {

    }
    // map the form to the user model and create a post
    this.userService.createUser(
      new User().All(
        this.cuForm.controls.username.value,
        this.cuForm.controls.firstname.value,
        this.cuForm.controls.lastname.value,
        this.cuForm.controls.password.value
      )
    ).subscribe();
  }

}
