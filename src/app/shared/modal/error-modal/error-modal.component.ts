import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
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
  @Input() errorMessageList: string[];
  @Input() multipleFormErrors: string[];
  @Input() showErrorButton: boolean;
  @Input() errorDescription: any;
  @Input() isButtonEnabled: boolean;
  @Input() isError: boolean;
  @Input() navToHome: boolean;
  @Input() unSaved: boolean;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() retry: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  goBack() {
    this.selected.emit();
    this.activeModal.close();
  }
  tryAgain() {
    this.retry.emit();
    this.activeModal.close();
  }
  goToHome() {
    this.activeModal.close();
  }
}
