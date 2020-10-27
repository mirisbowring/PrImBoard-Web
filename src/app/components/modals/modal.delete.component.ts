import { Component, OnDestroy, Input } from '@angular/core';
import { Media } from 'src/app/models/media';
import { Subscription } from 'rxjs';
import { MediaService } from 'src/app/services/media.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MediaMessage } from 'src/app/models/message';


@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal.delete.component.html',
})
export class ModalDeleteComponent implements OnDestroy {

  @Input() data: Media[];
  private deleted: Media[] = [];
  deleteInput = '';

  private subscriptions = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private mediaService: MediaService,
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  deleteMedia(): void {
    for (const m of this.data) {
      this.subscriptions.add(
        this.mediaService.deleteMediaByID(m.id).subscribe(res => {
          if (res.status === 200) {
            this.deleted.push(m);
          }
        })
      );
    }
    this.activeModal.close({ deleted: true, media: this.deleted } as MediaMessage);
  }

  onNoClick(): void {
    this.activeModal.close({ canceled: true, media: this.deleted } as MediaMessage);
  }

}
