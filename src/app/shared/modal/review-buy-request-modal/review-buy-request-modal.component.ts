import { readFileSync } from 'fs';

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
import { RegexConstants } from '../../utils/api.regex.constants';

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
    if (this.fundDetails.portfolio.fundingTypeValue === MANAGE_INVESTMENTS_CONSTANTS.TOPUP.FUNDING_METHODS.SRS) {
     this.srsFundingType();
    } else {
      this.cashFundingType();
    }
    this.portfolioType = this.fundDetails['portfolio']['riskProfileType'];
    if (this.fundDetails['portfolio']['riskProfileId']) {
      this.riskProfileImg =
        ProfileIcons[this.fundDetails.portfolio.riskProfileId - 1]['icon'];
    }
  }
  cashFundingType() {
    if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME) {
      this.requestAmount = Number(this.fundDetails['oneTimeInvestment']) || 0;
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.ONETINE_INVESTMENT;
      this.oneTimeMonthlyLbl = this.translate.instant('REVIEW_BUY_REQUEST.ONE_TIME_LBL');
      if (this.fundDetails['isAmountExceedBalance'] === true) {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.INSUFFICIENT_ONETIME_CASH_NOTE');
      } else {
        this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.SUFFICIENT_ONETIME_CASH_NOTE');
      }
    } else if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY) {
      this.requestAmount = Number(this.fundDetails['monthlyInvestment']) || 0;
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.MONTHLY_INVESTMENT;
      this.oneTimeMonthlyLbl = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_LBL');
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_CASH_NOTE');
    }
  }
  srsFundingType() {
    this.srsAccountFormat();
    if (this.fundDetails['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.ONETIME) {
      this.requestAmount = Number(this.fundDetails['oneTimeInvestment']) || 0;
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.ONETINE_INVESTMENT;
      this.oneTimeMonthlyLbl = this.translate.instant('REVIEW_BUY_REQUEST.ONE_TIME_LBL');
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.ONETIME_SRS_NOTE');
      this.oneTimeMonthlyInfo = this.translate.instant('REVIEW_BUY_REQUEST.INFO_SRS_ONETIME');
    } else {
      this.requestAmount = Number(this.fundDetails['monthlyInvestment']) || 0;
      this.requestType = MANAGE_INVESTMENTS_CONSTANTS.TOPUP.MONTHLY_INVESTMENT;
      this.oneTimeMonthlyInfo = this.translate.instant('REVIEW_BUY_REQUEST.INFO_SRS_MONTHLY');
      this.oneTimeMonthlyLbl = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_LBL');
      this.noteArray = this.translate.instant('REVIEW_BUY_REQUEST.MONTHLY_SRS_NOTE');
    }
  }

  onSubmit() {
    this.submitRequest.emit();
    this.activeModal.close();
  }

  srsAccountFormat() {
    const accNub = this.fundDetails.srsDetails.accountNumber;
    this.formatedAccountNumber = '';
    switch (this.fundDetails.srsDetails.srsBankOperator.name) {
      case MANAGE_INVESTMENTS_CONSTANTS.TOPUP.SRS_OPERATOR.DBS:
      this.formatedAccountNumber = [accNub.slice(0, 4), '-', accNub.slice(4, 8), '-', accNub.slice(8, 9), '-', accNub.slice(9)].join('');
      break;
      case MANAGE_INVESTMENTS_CONSTANTS.TOPUP.SRS_OPERATOR.OCBC:
      this.formatedAccountNumber = [accNub.slice(0, 3), '-', accNub.slice(3, 8), '-', accNub.slice(8)].join('');
      break;
      case MANAGE_INVESTMENTS_CONSTANTS.TOPUP.SRS_OPERATOR.UOB:
      this.formatedAccountNumber = [accNub.slice(0, 2), '-', accNub.slice(2, 7), '-', accNub.slice(7)].join('');
      break;
    }
    return  this.formatedAccountNumber;
  }
}
