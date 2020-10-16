import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MANAGE_INVESTMENTS_CONSTANTS } from '../../manage-investments.constants';

@Component({
  selector: 'app-confirm-withdrawal-modal',
  templateUrl: './confirm-withdrawal-modal.component.html',
  styleUrls: ['./confirm-withdrawal-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmWithdrawalModalComponent implements OnInit {
  minBalance;
  showWarningMessage = false;
  newMessageRebalance = false;
  @Input() withdrawAmount: any;
  @Input() withdrawType: any;
  @Input() portfolio: any;
  @Input() bankAccountNo: any;
  @Input() userInfo: any;
  @Input() srsAccountInfo: any;
  @Output() confirmed: EventEmitter<any> = new EventEmitter();
  @Output() showLearnMore: EventEmitter<any> = new EventEmitter();
  WITHDRAW_CONSTANTS;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.WITHDRAW_CONSTANTS = MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW;
    if (this.portfolio.portfolioStatus === 'REBALANCING') {
      this.showNewMessageForRebalance(this.portfolio.riskProfileType)
    }
  }

  confirmWithdrawal(event) {
    this.confirmed.emit();
    event.stopPropagation();
  }
  learnMore() {
    this.showLearnMore.emit();
  }
  showNewMessageForRebalance(riskType) {
    if (MANAGE_INVESTMENTS_CONSTANTS.REBALANCE_ADDITIONAL_MESSAGE.includes(riskType.toUpperCase())) {
      this.newMessageRebalance = true;
    } else {
      this.newMessageRebalance = false;
    }
  }
}
