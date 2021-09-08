import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';

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
import { MANAGE_INVESTMENTS_CONSTANTS } from '../../../investment/manage-investments/manage-investments.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from './../../../investment/investment-engagement-journey/investment-engagement-journey.constants';
import { ModelWithButtonComponent } from './../../modal/model-with-button/model-with-button.component';
import { IToastMessage } from '../../../investment/manage-investments/manage-investments-form-data';
import { ManageInvestmentsService } from '../../../investment/manage-investments/manage-investments.service';

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
  awaitingList: any;
  withdrawnList: any;
  declinedList: any;
  expiredList: any;
  progressList: any;
  verifyList: any;
  showAllForInvested: boolean;
  showAllForNotInvested: boolean;
  topClickedFlag: boolean;
  totalPortfoliosLength: number;
  newMessageForRebalance = false;
  showAllForAwaited: boolean;
  showAllForWithdrawn: boolean;
  showAllForDeclined: boolean;
  showAllForExpired: boolean;
  showAllForProgress: boolean;
  showAllForVerify: boolean;

  @Input('portfolioList') portfolioList;
  @Input('showTotalReturn') showTotalReturn;
  @Input('portfolioData') portfolioData;
  @Input('portfolioCategory') portfolioCategory;
  @Output() transferInstSelected = new EventEmitter<boolean>();
  @Output() detailSelected = new EventEmitter<boolean>();
  @Output() topUpSelected = new EventEmitter<boolean>();
  @Output() investAgainSelected = new EventEmitter<boolean>();
  @Output() emitToastMessage = new EventEmitter<boolean>();

  // Filtered Portfolio List
  filteredInvestedList: any;
  filteredNotInvestedList: any;
  filteredAwaitingList: any;
  filteredWithdrawnList: any;
  filteredDeclinedList: any;
  filteredExpiredList: any;
  filteredProgressList: any;
  filteredVerifyList: any;

  subscription: Subscription;  
 
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;
  timeDifference: any;

  constructor(
    public readonly translate: TranslateService,
    private modal: NgbModal,
    public signUpService: SignUpService,
    private currencyPipe: CurrencyPipe,
    public authService: AuthenticationService,
    private investmentAccountService: InvestmentAccountService,
    private investmentEngagementService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    private router: Router,
    private manageInvestmentsService: ManageInvestmentsService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }

  ngOnInit() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.subscription = interval(1000*60)
           .subscribe(x => { this.getTimeDifference(); });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.portfoioSpliter();
    this.filterPortfolios();
  }

  showHideToggle(elementName: string) {
    this[elementName] = !(this[elementName]);
  }
  portfoioSpliter() {
    this.notInvestedList = [];
    this.investedList = [];
    this.awaitingList = [];
    this.withdrawnList = [];
    this.declinedList = [];
    this.expiredList = [];
    this.progressList = [];
    this.verifyList = [];
    if (this.portfolioList) {
      for (const portfolio of this.portfolioList) {
        if (portfolio.portfolioStatus === 'PURCHASED' || portfolio.portfolioStatus === 'REDEEMING'
          || portfolio.portfolioStatus === 'REBALANCING') {
          this.investedList.push(portfolio);
          const awaitingTimeStamp = 1630669362000;
          console.log(Date.now());
          portfolio.awaitingPeriod = '18 hours 47 minutes';
          this.awaitingList.push(portfolio);
          this.withdrawnList.push(portfolio);
          this.declinedList.push(portfolio);
          this.expiredList.push(portfolio);
          this.progressList.push(portfolio);
          this.verifyList.push(portfolio);
        } else if(portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.AWAITING) {
          this.awaitingList.push(portfolio);
        } else if(portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.WITHDRAWN) {
          this.withdrawnList.push(portfolio);
        } else if(portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.DECLINED) {
          this.declinedList.push(portfolio);
        } else if(portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.EXPIRED) {
          this.expiredList.push(portfolio);
        } else if(portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.IN_PROGRESS) {
          this.progressList.push(portfolio);
        } else if(portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.VERIFY) {
          this.verifyList.push(portfolio);
        }  else {
          this.notInvestedList.push(portfolio);
        }
      }
      this.investmentEngagementService.sortByProperty(this.awaitingList, 'createdDate', 'desc');
      this.investmentEngagementService.sortByProperty(this.withdrawnList, 'createdDate', 'desc');
      this.investmentEngagementService.sortByProperty(this.declinedList, 'createdDate', 'desc');
      this.investmentEngagementService.sortByProperty(this.expiredList, 'createdDate', 'desc');
      this.investmentEngagementService.sortByProperty(this.progressList, 'createdDate', 'desc');
      this.investmentEngagementService.sortByProperty(this.verifyList, 'createdDate', 'desc');
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

  getImg(i: number, category?: string) {
    if (category && category.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISEINCOME.toUpperCase()) {
      return (ProfileIcons[7] && ProfileIcons[7]['icon']) ? ProfileIcons[7]['icon'] : '';
    } else {
      return (ProfileIcons[i - 1] && ProfileIcons[i - 1]['icon']) ? ProfileIcons[i - 1]['icon'] : '';
    }
  }

  showRebalanceMessage() {  
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_PORTFOLIO.MODAL.RBL_MODAL.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('YOUR_PORTFOLIO.MODAL.RBL_MODAL.MESSAGE_ONE');
    this.topClickedFlag = true;
  }

  addPortfolio() {
    this.authService.removeEnquiryId();
    this.investmentCommonService.clearFundingDetails();  // #MO2-2446
    this.investmentCommonService.clearJourneyData();
    const portfolioType = this.toDecidedPortfolioType(this.portfolioCategory);
    this.investmentEngagementService.setSelectPortfolioType({selectPortfolioType : portfolioType});
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO_TYPE]);
  }

  toDecidedPortfolioType(selectedPortfolioValue) {
    if (selectedPortfolioValue.toUpperCase() ===
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVESTMENT.toUpperCase()) {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO
    } else if (selectedPortfolioValue.toUpperCase() ===
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME.toUpperCase()) {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO
    } else if (selectedPortfolioValue.toUpperCase() === 
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER.toUpperCase()) {  
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO
    } else {
      return false;
    }
  }

  // Method to filter portfolios base on the category
  filterPortfolios() {
    if (this.portfolioCategory === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.INVESTMENT) {
      this.filterAndCalculate(INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.INVESTMENT);
    } else if (this.portfolioCategory === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISEINCOME) {
      this.filterAndCalculate(INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISEINCOME);
    } else if (this.portfolioCategory === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER) {
      this.filterAndCalculate(INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER);
    } else {
      this.filteredNotInvestedList = this.notInvestedList;
      this.filteredInvestedList = this.investedList;
      this.filteredAwaitingList = this.awaitingList;
      this.filteredWithdrawnList = this.withdrawnList; 
      this.filteredDeclinedList = this.declinedList;
      this.filteredExpiredList = this.expiredList;
      this.filteredProgressList = this.progressList;
      this.filteredVerifyList = this.verifyList;
      this.totalPortfoliosLength = this.portfolioList.length;
    }
    this.getTimeDifference();
  }

  // Filter by category and calculate the new values
  filterAndCalculate(category) {
    this.filteredNotInvestedList = this.notInvestedList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.filteredInvestedList = this.investedList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.filteredAwaitingList = this.awaitingList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.filteredWithdrawnList = this.withdrawnList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.filteredDeclinedList = this.declinedList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.filteredExpiredList = this.expiredList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.filteredProgressList = this.progressList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.filteredVerifyList = this.verifyList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.totalPortfoliosLength = this.filteredNotInvestedList.length + this.filteredInvestedList.length + this.filteredAwaitingList.length + this.filteredWithdrawnList.length + this.filteredDeclinedList.length + this.filteredExpiredList.length + this.filteredProgressList.length + this.filteredVerifyList.length;
  }

  setBorderClass(portfolio) {
    if (portfolio['portfolioCategory'].toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER.toUpperCase()) {
      return 'ws-border';
    } else if (portfolio['portfolioCategory'].toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISEINCOME.toUpperCase()) {
      return 'wi-border';
    } else {
      return '';
    }
  }

  withDrawModal(portfolioName) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_INVESTMENT.WITHDRAW_JOINT_ACCOUNT_APPLICATION');
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_INVESTMENT.WITHDRAW_JOINT_ACCOUNT_APPLICATION_DESC'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant('YOUR_INVESTMENT.CONFIRM_WITHDRAWAL');
    ref.componentInstance.primaryAction.subscribe(() => {
      //this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO])      
      const toastMessage: IToastMessage = {
        isShown: true,
        desc: this.translate.instant('TOAST_MESSAGES.WITHDRAW_PORTFOLIO_SUCCESS', {userGivenPortfolioName : portfolioName} ),       
      };
      this.manageInvestmentsService.setToastMessage(toastMessage);
      this.emitToastMessage.emit(portfolioName);
    });
  }

  deleteByHolder(portfolioName) {
    const toastMessage: IToastMessage = {
      isShown: true,
      desc: this.translate.instant('TOAST_MESSAGES.DELETE_PORTFOLIO_BY_HOLDER', {userGivenPortfolioName : portfolioName} ),       
    };
    this.manageInvestmentsService.setToastMessage(toastMessage);
    this.emitToastMessage.emit(portfolioName);
  }

  getTimeDifference () {
    this.filteredAwaitingList.forEach((awaitList: any, index) => {
      const tmp = (index > 0) ? 1630669362000 : 1630933928946;
      const awaitingTimeStamp = tmp  + (7 * 24 * 60 * 60 * 1000);
      this.timeDifference = awaitingTimeStamp - Date.now();
      this.filteredAwaitingList[index].awaitingPeriod = (this.timeDifference > 0) ? this.allocateTimeUnits(this.timeDifference) : '-';
    });
  }

  allocateTimeUnits (timeDifference) {
    const secondsToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    const minutesToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    const hoursToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    const daysToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    if(daysToDay > 0) {
      return daysToDay + ' days';
    } else {
      return hoursToDay + ' hours' + minutesToDay + ' minutes';
    }
  }
}
