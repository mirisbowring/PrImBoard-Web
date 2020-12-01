import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/services/group.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { InviteService } from 'src/app/services/invite.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Node } from 'src/app/models/node';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDeleteComponent } from '../modals/modal.delete.component';
import { ModalMessage } from 'src/app/models/message';
import { ModalUserGroupComponent } from '../modals/modal.usergroup.component';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();

  groups: Group[] = [];
  nodes: Node[] = [];
  currentGroup = '';
  newUsers = new FormControl('');
  inviteToken = '';

  // tslint:disable-next-line: max-line-length
  constructor(private groupService: GroupService,
    private inviteService: InviteService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private modalService: NgbModal,
    private nodeService: NodeService,
    ) { }

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
    this.subscriptions.add(
      this.nodeService.getNodes().subscribe((data: Node[]) => {
        if (data != null) {
          this.nodes = data;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  parseNumber(num: string, system: number): number {
    return parseInt(num, system);
  }

  deleteNode(index: number): void {
    const id = this.nodes[index].id;
    this.nodeService.deleteNode(id).subscribe(res => {
      if (res.status === 200) {
        this.nodes.splice(index, 1);
      }
    })
  }

  openGroupNodeModal(node: Node): void {
    const modalRef = this.modalService.open(ModalUserGroupComponent);
    modalRef.componentInstance.data = [node];
    modalRef.componentInstance.typ = 'node';
    modalRef.result.then((res: ModalMessage<Node>) => {
      if (res.deleted) {
        this.updateNode(res.data, 'Deleted node successfully!');
      } else if (res.updated) {
        this.updateNode(res.data, 'Updated node successfully!');
      } else if (res.canceled) {
        this.updateNode(null, 'Canceled');
      }
    })
  }

  saveNode(index: number): void {
    const node = this.nodes[index];
    if (node.id == null) {
      this.nodeService.createNode(node).subscribe(res => {
        if (res.status === 201) {
          this.nodes[index] = res.body as Node;
        }
      }, err => {
        console.log(err);
      })
    } else {
      this.nodeService.updateNode(node.id, node).subscribe((data: Node) => {
        if (data != null) {
          this.nodes[index] = data;
        }
      })
    }
  }

  updateNode(node: Node, message: string): void {
    if (node != null) {
      for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        if (n.id === node.id) {
          this.nodes[i] = node;
          break;
        }
      }
    }
    this.snackBar.open(message, 'Ok', {duration: 2000 });
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
