import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/services/group.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { InviteService } from 'src/app/services/invite.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();

  groups: Group[] = [];
  currentGroup = '';
  newUsers = new FormControl('');
  inviteToken = '';

  constructor(private groupService: GroupService, private inviteService: InviteService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.groupService.getAllUserGroups().subscribe((data: Group[]) => {
        if (data != null) {
          this.groups = data;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  submitAddUserForm() {
    const users: User[] = [];
    // parse input
    this.newUsers.value
      .replace(/\s/g, '')
      .split(',')
      .forEach(user => users.push({ username: user }));
    // post to api
    console.log(users);
    this.groupService.addUsersToGroup(users, this.currentGroup).subscribe(res => {
      if (res.status === 200) {
        this.snackBar.open('Added User/s successfully!', 'Ok', { duration: 2000 });
        this.newUsers.setValue('');
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].id === this.currentGroup) {
            this.groups[i] = res.body as Group;
          }
        }
        this.currentGroup = '';
      }
    }, err => {
      if (err.status === 400) {
        this.snackBar.open(err.error.error, 'Ok', { duration: 2000 });
      } else {
        console.log('Error:' + err);
      }
    });
  }

  isOwner(owner: string): boolean {
    if (owner === localStorage.getItem('username')) {
      return true;
    }
    return false;
  }

  getInviteToken(): void {
    this.inviteService.getInviteToken().subscribe(invite => {
      this.inviteToken = invite.token;
    });
  }

  removeUserFromGroup(user: string, id: string) {
    this.groupService.removeUserFromGroup(user, id).subscribe(res => {
      if (res.status === 200) {
        this.snackBar.open('Removed User successfully!', 'Ok', { duration: 2000 });
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].id === id) {
            this.groups[i] = res.body as Group;
          }
        }
      }
    }, err => {
      console.log('Error:' + err);
    });
  }

}
