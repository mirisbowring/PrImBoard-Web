import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-modal-usergroup',
  templateUrl: './modal.usergroup.component.html',
  styleUrls: ['./modal.usergroup.component.css']
})
export class ModalUserGroupComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalUserGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
