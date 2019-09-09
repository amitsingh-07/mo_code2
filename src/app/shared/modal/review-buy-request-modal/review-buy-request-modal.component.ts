import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MANAGE_INVESTMENTS_CONSTANTS } from './../../../investment/manage-investments/manage-investments.constants';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-review-buy-request-modal',
  templateUrl: './review-buy-request-modal.component.html',
  styleUrls: ['./review-buy-request-modal.component.scss']
})
export class ReviewBuyRequestModalComponent implements OnInit {
  @Input() fundDetails;
  @Input() cashBalance: number;
  requestAmount: string;
  requestType: string;
  portfolioType: string;
  noteArray;

  @Output() submitRequest: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
              public readonly translate: TranslateService) {
  }

  ngOnInit() {
    if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME) {
      this.requestAmount = this.fundDetails['oneTimeInvestment'];
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.ONETINE_INVESTMENT;
      if (this.fundDetails['isAmountExceedBalance'] === true) {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.INSUFFICIENT_ONETIME_NOTE');
      } else {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.SUFFICIENT_ONETIME_NOTE');
      }
    } else if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY) {
      this.requestAmount = this.fundDetails['monthlyInvestment'];
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.MONTHLY_INVESTMENT;
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_NOTE');
    }
    this.portfolioType = this.fundDetails['portfolio']['riskProfileType'];
  }

  onSubmitPressed() {
    this.submitRequest.emit();
  }
}
