import { Component, Inject, OnDestroy, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Media } from 'src/app/models/media';
import { Subscription } from 'rxjs';
import { MediaService } from 'src/app/services/media.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal.delete.component.html',
  styleUrls: ['./modal.delete.component.css']
})
export class ModalDeleteComponent implements OnDestroy {

  @Input() data: Media[];
  private deleted: Media[] = [];
  deleteInput = '';

  private subscriptions = new Subscription();
  // @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor(
    // public dialogRef: MatDialogRef<ModalDeleteComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: Media[],
    public activeModal: NgbActiveModal,
    private mediaService: MediaService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  deleteMedia(): void {
    for (const m of this.data) {
      this.mediaService.deleteMediaByID(m.id).subscribe(res => {
        if (res.status === 200) {
          this.deleted.push(m);
        }
      });
    }
    this.activeModal.close(this.deleted);
  }

  onNoClick(): void {
    this.activeModal.close();
  }

}
