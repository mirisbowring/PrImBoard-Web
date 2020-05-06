import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/services/group.service';
import { CombineSubscriptions } from 'ngx-destroy-subscribers';
import { Unsubscribable } from 'rxjs';
import { FormControl } from '@angular/forms';

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
    console.log("clicked");
  }

}
