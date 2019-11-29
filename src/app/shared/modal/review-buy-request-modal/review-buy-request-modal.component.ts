import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import {
    InvestmentAccountService
} from '../../../investment/investment-account/investment-account-service';
import {
    ProfileIcons
} from '../../../investment/investment-engagement-journey/recommendation/profileIcons';
import {
    MANAGE_INVESTMENTS_CONSTANTS
} from '../../../investment/manage-investments/manage-investments.constants';
import {
    ManageInvestmentsService
} from '../../../investment/manage-investments/manage-investments.service';

@Component({
  selector: 'app-review-buy-request-modal',
  templateUrl: './review-buy-request-modal.component.html',
  styleUrls: ['./review-buy-request-modal.component.scss']
})
export class ReviewBuyRequestModalComponent implements OnInit {
  @Input() fundDetails;
  cashBalance: number;
  requestAmount: number;
  requestType: string;
  portfolioType: string;
  riskProfileImg: string;
  noteArray;
  oneTimeMonthlyLbl: string;
  isAmtExceeded = false;
  srsAccount;
  formatedAccountNumber;
  oneTimeMonthlyInfo: string;
  @Output() submitRequest: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal,
              public readonly translate: TranslateService,
              public manageInvestmentsService: ManageInvestmentsService,
              public investmentAccountService: InvestmentAccountService) {
  }

  ngOnInit() {
    this.cashBalance = this.fundDetails['portfolio']['cashAccountBalance'] || 0;
    if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME) {
      this.oneTimeBuyRequestInfo();
    } else if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY) {
     this.monthlyBuyRequestInfo();
    }
    this.portfolioType = this.fundDetails['portfolio']['riskProfileType'];
    if (this.fundDetails['portfolio']['riskProfileId']) {
      this.riskProfileImg =
        ProfileIcons[this.fundDetails.portfolio.riskProfileId - 1]['icon'];
    }
  }

  oneTimeBuyRequestInfo() {
    this.requestAmount = Number(this.fundDetails['oneTimeInvestment']) || 0;
    this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.ONETINE_INVESTMENT;
    this.oneTimeMonthlyLbl = this.translate.instant('REVIEW_BUY_REQUEST.ONE_TIME_LBL');
    if (this.fundDetails.portfolio.fundingTypeValue.toUpperCase() === MANAGE_INVESTMENTS_CONSTANTS.TOPUP.FUNDING_METHODS.CASH) {
      if (this.fundDetails['isAmountExceedBalance'] === true) {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.INSUFFICIENT_ONETIME_CASH_NOTE');
      } else {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.SUFFICIENT_ONETIME_CASH_NOTE');
      }
    } else {
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.ONETIME_SRS_NOTE');
      this.oneTimeMonthlyInfo = this.translate.instant('REVIEW_BUY_REQUEST.INFO_SRS_ONETIME');
     }
  }
  monthlyBuyRequestInfo() {
    this.requestAmount = Number(this.fundDetails['monthlyInvestment']) || 0;
    this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.MONTHLY_INVESTMENT;
    this.oneTimeMonthlyLbl = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_LBL');
    if (this.fundDetails.portfolio.fundingTypeValue.toUpperCase() === MANAGE_INVESTMENTS_CONSTANTS.TOPUP.FUNDING_METHODS.CASH) {
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_CASH_NOTE');
    } else {
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_SRS_NOTE');
      this.oneTimeMonthlyInfo = this.translate.instant('REVIEW_BUY_REQUEST.INFO_SRS_MONTHLY');
    }
  }

  onSubmit() {
    this.submitRequest.emit();
    this.activeModal.close();
  }
}
