import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  submitcuForm() {
    if (this.cuForm.controls.password.value !== this.cuForm.controls.password_rep.value) {
      return;
    }
    this.cuForm.removeControl('password_rep');
    // pass uform and check against contract
    this.userService.createUser(this.cuForm.getRawValue()).subscribe(res => {
      if (res.status === 201) {
        this.snackBar.open(
          'User created!',
          'Ok',
          { duration: 2000 }
        );
      }
    });
  }

}
