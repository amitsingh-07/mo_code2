import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorModalComponent implements OnInit {
  @Input() errorTitle: any;
  @Input() errorMessage: any;
  @Input() showErrorButton: boolean;
  @Input() errorDescription: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
