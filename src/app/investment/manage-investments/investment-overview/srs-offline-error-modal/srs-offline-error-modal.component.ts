import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-srs-offline-error-modal',
  templateUrl: './srs-offline-error-modal.component.html',
  styleUrls: ['./srs-offline-error-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SRSOfflineErrorModalComponent implements OnInit {

  @Input() errorTitle;
  @Input() errorMessage;
  constructor(
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
