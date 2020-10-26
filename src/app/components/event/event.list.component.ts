import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event, EventMessage } from 'src/app/models/event';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'src/app/models/message';
import { ModalEventEditComponent } from 'src/app/components/modals/modal.event.edit.component';

@Component({
  selector: 'app-events',
  templateUrl: './event.list.component.html',
  styleUrls: ['./event.list.component.css']
})
export class ListComponent implements AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();

  events = [];
  selectedEvent: Event;

  constructor(private eventService: EventService, private messageService: MessageService, private modalService: NgbModal) {
    // message listener
    this.subscriptions.add(
      this.messageService.getMessage().subscribe((message: Message) => {
        if (message.openEventEditDialog !== undefined) {
          const modalRef = this.modalService.open(ModalEventEditComponent)
          modalRef.componentInstance.data = this.selectedEvent;
          modalRef.result.then((res: EventMessage) => {
            const index = this.events.findIndex(med => med.id === res.event.id);
            if (res.deleted) {
              this.events.splice(index, 1);
            } else if (res.updated) {
              this.events[index] = res.event;
            }
          });
        }
      })
    );
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      this.eventService.getAllEvents().subscribe((data: Event[]) => this.events = data)
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openEventEditDialog(event: Event): void {
    this.selectedEvent = event;
    this.messageService.sendMessage({ openEventEditDialog: true });
  }

}
