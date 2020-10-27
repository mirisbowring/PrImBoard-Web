import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Group } from 'src/app/models/group';
import { Media, MediaGroupMap } from 'src/app/models/media';
import { MediaMessage } from 'src/app/models/message';
import { GroupService } from 'src/app/services/group.service';
import { HelperService } from 'src/app/services/helper.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-modal-usergroup',
  templateUrl: './modal.usergroup.component.html',
})
export class ModalUserGroupComponent {

  @Input() data: Media[] = [];
  @ViewChild(NgbTypeahead) ngbTypeahead: NgbTypeahead;
  private subscriptions = new Subscription();

  localGroups: Group[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private groupService: GroupService,
    private mediaService: MediaService,
  ) { }

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

    // collect media ids
    const ids: string[] = [];
    for (const m of this.data) {
      ids.push(m.id);
    }
    // append Groups
    this.localGroups = HelperService.tidyGroups(this.localGroups);
    this.subscriptions.add(
      this.mediaService.addMediaGroupMap({ MediaIDs: ids, Groups: this.localGroups} as MediaGroupMap).subscribe(res => {
        if (res.status === 200) {
          this.activeModal.close({updatedGroups: true, media: res.body} as MediaMessage)
        }
      }, err => console.log('Error: ' + err.error.error))
    );
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
