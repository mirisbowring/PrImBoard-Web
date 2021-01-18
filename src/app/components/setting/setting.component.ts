import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/services/group.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
// import { User } from 'src/app/models/user';
import { InviteService } from 'src/app/services/invite.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Node } from 'src/app/models/node';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMessage } from 'src/app/models/message';
import { ModalUserGroupComponent } from '../modals/modal.usergroup.component';
import { NodeService } from 'src/app/services/node.service';
import { KeycloakService } from 'keycloak-angular';

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
    public keycloakService: KeycloakService,
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

  createNode(): void {
    this.nodeService.registerNode().subscribe(res => {
      if (res.status === 201) {
        this.nodes.unshift(res.body as Node);
        this.nodes[0].new = true;
      }
    }, err => {
      this.snackBar.open("register node failed", 'Ok', {duration: 2000 });
    })
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

  retrieveSecret(node: Node): void {
    if (node.shown) {
      // remove secret if visibility is going to be disabled
      this.nodes.forEach(n => {
        if (n.id === node.id) {
          n.secret = undefined;
          n.shown = false;
          return
        }
      });
    } else {
      this.subscriptions.add(this.nodeService.retrieveSecret(node.id).subscribe(res => {
        if (res.status === 200) {
          this.nodes.forEach(n => {
            if (n.id == node.id) {
              n.secret = (res.body as Node).secret;
              n.shown = true;
              return
            }
          })
        }
      }, err => {
        this.snackBar.open('could not get secret', 'Ok', {duration: 2000 });
      }));
    }
  }

  refreshSecret(node: Node): void {
    const ret = node.shown == undefined || node.shown == null ? false : node.shown;
    this.subscriptions.add(this.nodeService.refreshSecret(node.id, ret).subscribe(res => {
      if (res.status == 200) {
        // set refreshed token if visible at moment
        if (ret) {
          this.nodes.forEach(n => {
            if (n.id == node.id) {
              n.secret = res.body as string;
              return;
            }
          })
        }
        this.snackBar.open('refreshed secret', 'Ok', { duration: 2000 });
      }
    }, err => {
      this.snackBar.open('could not refresh secret', 'Ok', { duration: 2000 });
    }));
  }

  saveNode(index: number): void {
    const node = this.nodes[index];
    node.secret = null;
    if (node.id == null) {
      this.subscriptions.add(this.nodeService.createNode(node).subscribe(res => {
        if (res.status === 201) {
          this.nodes[index] = res.body as Node;
        }
        this.snackBar.open('node created', 'Ok', {duration: 2000 });
      }, err => {
        console.error(err);
        this.snackBar.open('failed to create node', 'Ok', {duration: 2000 });
      }));
    } else {
      node.type = node.type == null || node.type === '' ? 'web' : node.type;
      this.subscriptions.add(this.nodeService.updateNode(node.id, node).subscribe(res => {
        if (res.status == 200) {
          if (res.body != null) {
            this.nodes[index] = res.body as Node;
          }
          this.snackBar.open('updated node', 'Ok', {duration: 2000 });
        }
      }, err => {
        this.snackBar.open('failed to update node', 'Ok', {duration: 2000 });
      }));
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
    const users: string[] = [];
    // parse input
    this.newUsers.value
      .replace(/\s/g, '')
      .split(',')
      .forEach(user => users.push(user));
    // post to api
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
        console.error('Error:' + err);
      }
    });
  }

  isOwner(owner: string): boolean {
    if (owner === this.keycloakService.getUsername()) {
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
      console.error('Error:' + err);
    });
  }

}
