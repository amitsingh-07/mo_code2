import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorModalComponent implements OnInit {
  isSelected = false;
  @Input() errorTitle: any;
  @Input() errorMessage: any;
  @Input() errorMessageList: string[];
  @Input() showErrorButton: boolean;
  @Input() errorDescription: any;
  @Input() isButtonEnabled: boolean;
  @Input() isError: boolean;
  @Output() selected: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  goBack() {
    this.isSelected = true;
    this.selected.emit(this.isSelected);
    this.activeModal.close();
  }
}
