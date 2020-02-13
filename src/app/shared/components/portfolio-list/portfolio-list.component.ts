import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import {
    InvestmentAccountService
} from '../../../investment/investment-account/investment-account-service';
import {
    InvestmentEngagementJourneyService
} from '../../../investment/investment-engagement-journey/investment-engagement-journey.service';
import {
    ProfileIcons
} from '../../../investment/investment-engagement-journey/recommendation/profileIcons';
import {
    ManageInvestmentsService
} from '../../../investment/manage-investments/manage-investments.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { ErrorModalComponent } from '../../modal/error-modal/error-modal.component';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {

  selected;
  userProfileInfo;
  showAlretPopUp: boolean;
  monthlyInvestment: any;
  investedList: any;
  notInvestedList: any;
  showAllForInvested: boolean;
  showAllForNotInvested: boolean;
  topClickedFlag: boolean;
  @Input('portfolioList') portfolioList;
  @Input('showTotalReturn') showTotalReturn;
  @Input('portfolioData') portfolioData;
  @Output() transferInstSelected = new EventEmitter<boolean>();
  @Output() detailSelected = new EventEmitter<boolean>();
  @Output() topUpSelected = new EventEmitter<boolean>();
  @Output() investAgainSelected = new EventEmitter<boolean>();

  constructor(public readonly translate: TranslateService,
              private modal: NgbModal,
              private manageInvestmentsService: ManageInvestmentsService,
              public signUpService: SignUpService,
              private currencyPipe: CurrencyPipe,
              private investmentAccountService: InvestmentAccountService,
              private investmentEngagementService: InvestmentEngagementJourneyService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }

  ngOnInit() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.portfoioSpliter();
  }

  showHideToggle(elementName: string) {
    this[elementName] = !(this[elementName]);
  }
  portfoioSpliter() {
    this.notInvestedList = [];
    this.investedList = [];
    if (this.portfolioList) {
      for (const portfolio of this.portfolioList) {
        if (portfolio.portfolioStatus === 'PURCHASED' || portfolio.portfolioStatus === 'REDEEMING'
          || portfolio.portfolioStatus === 'REBALANCING') {
          this.investedList.push(portfolio);
        } else {
          this.notInvestedList.push(portfolio);
        }
      }
      this.investmentEngagementService.sortByProperty(this.investedList, 'createdDate', 'desc');
      this.investmentEngagementService.sortByProperty(this.notInvestedList, 'createdDate', 'desc');
    }
  }

  formatReturns(value) {
    return this.investmentAccountService.formatReturns(value);
  }

  detail(portfolio) {
    const selectedFlag = window.getSelection().toString();
    if (!this.topClickedFlag && !selectedFlag) {
      this.detailSelected.emit(portfolio);
    }
    this.topClickedFlag = false;
  }
  gotoTopUp(portfolio) {
    this.topClickedFlag = true;
    this.topUpSelected.emit(portfolio);
  }

  gotoBuyRequest() {
    this.signUpService.setByRequestFlag(true);
  }

  transferInst($event) {
    this.transferInstSelected.emit($event);
  }

  investAgain(portfolio) {
    this.investAgainSelected.emit(portfolio);
  }

  getImg(i: number) {
    return (ProfileIcons[i - 1] && ProfileIcons[i - 1]['icon']) ? ProfileIcons[i - 1]['icon'] : '';
  }

  showRebalanceMessage() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_PORTFOLIO.MODAL.RBL_MODAL.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('YOUR_PORTFOLIO.MODAL.RBL_MODAL.Message');
    this.topClickedFlag = true;
  }
}
