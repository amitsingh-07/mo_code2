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
  @Input() portfolioValue: any;
  @Output() confirmed: EventEmitter<any> = new EventEmitter();
  WITHDRAW_CONSTANTS;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.WITHDRAW_CONSTANTS = TOPUPANDWITHDRAW_CONFIG.WITHDRAW;
    this.portfolioMinBalance();
  }

  confirmWithdrawal() {
    this.confirmed.emit();
  }
  portfolioMinBalance() {
    this.minBalance = this.portfolioValue - this.withdrawAmount;
    if (this.minBalance <= 50) {
      this.showWarningMessage = true;
    } else {
      this.showWarningMessage = false;
    }

  }
}
