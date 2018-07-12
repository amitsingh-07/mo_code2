import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  @Input() errorTitle: any;
  @Input() errorMessage: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
