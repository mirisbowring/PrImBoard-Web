import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/services/group.service';
import { CombineSubscriptions } from 'ngx-destroy-subscribers';
import { Unsubscribable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, AfterViewInit {

  @CombineSubscriptions()
  private subscribers: Unsubscribable;

  groups: Group[] = [];
  currentGroup = '';
  newUsers = new FormControl('');

  constructor(private groupService: GroupService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscribers = this.groupService.getAllUserGroups().subscribe((data: Group[]) => {
      if (data != null) {
        this.groups = data;
      }
    });
  }

  submitAddUserForm() {
    const users: User[] = [];
    // parse input
    this.newUsers.value
      .replace(/\s/g, '')
      .split(',')
      .forEach(user => users.push({ username: user }));
    // post to api
    this.groupService.addUsersToGroup(users, this.currentGroup).subscribe(res => {
      if (res.status === 200) {
        this.newUsers.setValue('');
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].id === this.currentGroup) {
            this.groups[i] = res.body as Group;
          }
        }
        this.currentGroup = '';
      }
    }, err => {
      console.log('Error:' + err);
    });
  }

  isOwner(owner: string): boolean {
    if (owner === localStorage.getItem('username')) {
      return true;
    }
    return false;
  }

  removeUserFromGroup(user: string, id: string) {
    this.groupService.removeUserFromGroup(user, id).subscribe(res => {
      if (res.status === 200) {
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
