import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TOPUPANDWITHDRAW_CONFIG } from '../topup-and-withdraw.constants';

@Component({
  selector: 'app-confirm-withdrawal-modal',
  templateUrl: './confirm-withdrawal-modal.component.html',
  styleUrls: ['./confirm-withdrawal-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmWithdrawalModalComponent implements OnInit {
  minBalance;
  showWarningMessage = false;
  @Input() withdrawAmount: any;
  @Input() withdrawType: any;
  @Input() portfolio: any;
  @Input() bankAccountNo: any;
  @Output() confirmed: EventEmitter<any> = new EventEmitter();
  @Output() showLearnMore: EventEmitter<any> = new EventEmitter();
  WITHDRAW_CONSTANTS;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.WITHDRAW_CONSTANTS = TOPUPANDWITHDRAW_CONFIG.WITHDRAW;
  }

  confirmWithdrawal() {
    this.confirmed.emit();
  }
  learnMore() {
    this.showLearnMore.emit();
  }
}
