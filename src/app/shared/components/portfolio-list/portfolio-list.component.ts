import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
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
import { SignUpService } from '../../../sign-up/sign-up.service';
import { AuthenticationService } from '../../http/auth/authentication.service';
import { ErrorModalComponent } from '../../modal/error-modal/error-modal.component';
import { INVESTMENT_COMMON_CONSTANTS } from './../../../investment/investment-common/investment-common.constants';
import { InvestmentCommonService } from './../../../investment/investment-common/investment-common.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
 } from './../../../investment/investment-engagement-journey/investment-engagement-journey-routes.constants';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit, OnChanges {

  selected;
  userProfileInfo;
  showAlretPopUp: boolean;
  monthlyInvestment: any;
  investedList: any;
  notInvestedList: any;
  showAllForInvested: boolean;
  showAllForNotInvested: boolean;
  topClickedFlag: boolean;
  totalPortfoliosLength: number;

  @Input('portfolioList') portfolioList;
  @Input('showTotalReturn') showTotalReturn;
  @Input('portfolioData') portfolioData;
  @Input('portfolioCategory') portfolioCategory;
  @Output() transferInstSelected = new EventEmitter<boolean>();
  @Output() detailSelected = new EventEmitter<boolean>();
  @Output() topUpSelected = new EventEmitter<boolean>();
  @Output() investAgainSelected = new EventEmitter<boolean>();

  // Filtered Portfolio List
  filteredInvestedList: any;
  filteredNotInvestedList: any;

  constructor(
    public readonly translate: TranslateService,
    private modal: NgbModal,
    public signUpService: SignUpService,
    private currencyPipe: CurrencyPipe,
    public authService: AuthenticationService,
    private investmentAccountService: InvestmentAccountService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }

  ngOnInit() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.portfoioSpliter();
    this.filterPortfolios();
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

  addPortfolio() {
    this.authService.saveEnquiryId(null);
    this.investmentCommonService.clearFundingDetails();  // #MO2-2446
    this.investmentCommonService.clearJourneyData();
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
  }

  // Method to filter portfolios base on the category
  filterPortfolios() {
    if (this.portfolioCategory === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.INVESTMENT) {
      this.filterAndCalculate(INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.INVESTMENT);
    } else if (this.portfolioCategory === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER) {
      this.filterAndCalculate(INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER);
    } else {
      this.filteredNotInvestedList = this.notInvestedList;
      this.filteredInvestedList = this.investedList;
      this.totalPortfoliosLength = this.portfolioList.length;
    }
  }

  // Filter by category and calculate the new values
  filterAndCalculate(category) {
    this.filteredNotInvestedList = this.notInvestedList.filter((portfolio) => {
      return portfolio['portfolioCategory'] === category;
    });
    this.filteredInvestedList = this.investedList.filter((portfolio) => {
      return portfolio['portfolioCategory'] === category;
    });
    this.totalPortfoliosLength = this.filteredNotInvestedList.length + this.filteredInvestedList.length;
  }

}
