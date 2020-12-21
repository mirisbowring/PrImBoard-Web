import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Event } from 'src/app/models/event';
import { Group } from 'src/app/models/group';
import { Node } from 'src/app/models/node';
import { Media, MediaGroupMap } from 'src/app/models/media';
import { MediaMessage, ModalMessage } from 'src/app/models/message';
import { GroupService } from 'src/app/services/group.service';
import { HelperService } from 'src/app/services/helper.service';
import { MediaService } from 'src/app/services/media.service';
import { UserService } from 'src/app/services/user.service';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-modal-usergroup',
  templateUrl: './modal.usergroup.component.html',
})
export class ModalUserGroupComponent {

  @Input() data: Media[]|Group[]|Event[]|Node[] = [];
  @Input() typ: string;
  @ViewChild(NgbTypeahead) ngbTypeahead: NgbTypeahead;
  private subscriptions = new Subscription();

  localGroups: Group[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private groupService: GroupService,
    private mediaService: MediaService,
    private nodeService: NodeService,
  ) {}

  formatter = (group: Group) => group.title;

  groups = (text$: Observable<string>) =>
    text$.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => {
        if (term === '' || term == null) {
          return [];
        } else {
          return this.groupService.groupPreview(term);
        }
      })
    )

  addGroups(): void {
    if (this.localGroups.length === 0) {
      return;
    }

    // append Groups
    this.localGroups = HelperService.tidyGroups(this.localGroups);
    switch(this.typ) {
      case 'media':
        if (this.data.length !== 1) {
          this.activeModal.close({canceled: true, data: null} as ModalMessage<Node>)
        }
        // collect media ids
        const mIDs: string[] = [];
        for (const m of this.data) {
          mIDs.push(m.id);
        }
        this.subscriptions.add(
          this.mediaService.addMediaGroupMap({ MediaIDs: mIDs, Groups: this.localGroups} as MediaGroupMap).subscribe(res => {
            if (res.status === 200) {
              this.activeModal.close({updatedGroups: true, media: res.body as Media[]} as MediaMessage);
            }
          }, err => console.error('Error: ' + err))
        );
        break;
      case 'event':
        break;
      case 'node':
        if (this.data.length !== 1) {
          this.activeModal.close({canceled: true, data: null} as ModalMessage<Node>)
        }
        const gIDs: string[] = [];
        for (const g of this.localGroups) {
          gIDs.push(g.id)
        }
        this.subscriptions.add(
          this.nodeService.addGroups(this.data[0].id, gIDs).subscribe(res => {
            if (res.status === 200) {
              this.activeModal.close({updated: true, data: res.body} as ModalMessage<Node>);
            }
          }, err => console.error('Error: '+ err.error.error))
        );
        break;
      default:
        console.error('unknown type %s specified for modal', this.typ)
    }

  }

  removeGroup(group: Group): void {
    this.localGroups = HelperService.removeItem<Group>(group, this.localGroups);
  }

  selectedGroup(event: NgbTypeaheadSelectItemEvent): void {
    this.localGroups.push(event.item);
    this.ngbTypeahead.writeValue('');
    // prevent from appending after this method
    event.preventDefault();
  }

  toggleChipCancel(chip: string): void {
    HelperService.toggleChipCancel(chip);
  }

  onNoClick(): void {
    this.activeModal.close({canceled: true, media: this.data} as MediaMessage);
  }

}
