import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  public onClose: Subject<boolean>;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  public onConfirm(): void {
    this.onClose.next(true);
    this.activeModal.close();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.activeModal.close();
  }
}
