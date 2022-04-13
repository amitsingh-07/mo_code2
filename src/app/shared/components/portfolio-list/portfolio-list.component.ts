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
import { MANAGE_INVESTMENTS_CONSTANTS } from '../../../investment/manage-investments/manage-investments.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from './../../../investment/investment-engagement-journey/investment-engagement-journey.constants';
import { ModelWithButtonComponent } from './../../modal/model-with-button/model-with-button.component';
import { IToastMessage } from '../../../investment/manage-investments/manage-investments-form-data';
import { ManageInvestmentsService } from '../../../investment/manage-investments/manage-investments.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../../investment/investment-common/investment-common-routes.constants';

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
  progressCpfList: any;
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
  portfolioTypes: any;
  showAllForCpfProgress: boolean;

  @Input('portfolioList') portfolioList;
  @Input('showTotalReturn') showTotalReturn;
  @Input('portfolioData') portfolioData;
  @Input('portfolioCategory') portfolioCategory;
  @Output() transferInstSelected = new EventEmitter<boolean>();
  @Output() detailSelected = new EventEmitter<boolean>();
  @Output() topUpSelected = new EventEmitter<boolean>();
  @Output() investAgainSelected = new EventEmitter<boolean>();
  @Output() emitToastMessage = new EventEmitter<boolean>();
  @Output() emitMessage = new EventEmitter<any>();


  // Filtered Portfolio List
  filteredInvestedList: any;
  filteredNotInvestedList: any;
  filteredAwaitingList: any;
  filteredWithdrawnList: any;
  filteredDeclinedList: any;
  filteredExpiredList: any;
  filteredProgressList: any;
  filteredVerifyList: any;
  filteredCpfProgressList: any;

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  timeDifference: any;
  awaitingMsg: any;
  days: any;
  hours: any;
  minutes: any;
  day: any;
  fundingMethods = INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS;

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
    this.translate.get('COMMON').subscribe((result: string) => {
      this.awaitingMsg = this.translate.instant('YOUR_INVESTMENT.PRIMARY_AWAITING_TIME');
      this.days = this.translate.instant('YOUR_INVESTMENT.DAYS');
      this.hours = this.translate.instant('YOUR_INVESTMENT.HOURS');
      this.minutes = this.translate.instant('YOUR_INVESTMENT.MINUTES');
      this.day = this.translate.instant('YOUR_INVESTMENT.DAY');
    });
  }

  ngOnInit() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.portfolioTypes = INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY_TYPE;
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
    this.progressCpfList = [];
    if (this.portfolioList) {
      for (const portfolio of this.portfolioList) {
        if (portfolio.portfolioStatus === 'PURCHASED' || portfolio.portfolioStatus === 'REDEEMING'
          || portfolio.portfolioStatus === 'REBALANCING') {
          this.investedList.push(portfolio);
        } else if (portfolio.jointAccount && portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.AWAITING) {
          portfolio.awaitingPeriod = '';
          this.awaitingList.push(portfolio);
        } else if (portfolio.jointAccount && !portfolio.primaryHolder && portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.WITHDRAWN) {
          this.withdrawnList.push(portfolio);
        } else if (portfolio.jointAccount && portfolio.primaryHolder && portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.DECLINED) {
          this.declinedList.push(portfolio);
        } else if (portfolio.jointAccount && portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.EXPIRED) {
          this.expiredList.push(portfolio);
        } else if (portfolio.jointAccount && portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.IN_PROGRESS) {
          this.progressList.push(portfolio);
        } else if (portfolio.jointAccount && portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.JA_PORTFOLIO_STATUS.VERIFY) {
          this.verifyList.push(portfolio);
        } else if (this.portfolioData.cpfProgressPortfolio && portfolio.portfolioStatus === INVESTMENT_COMMON_CONSTANTS.CPF_PENDING_STATUS) {
          this.progressCpfList.push(portfolio);
        } else {
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
      this.investmentEngagementService.sortByProperty(this.progressCpfList, 'createdDate', 'desc');
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

  getImg(i: number, category: string, riskProfileType: any, isBalancedEnabled: boolean) {
    if (category && category.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISEINCOME.toUpperCase()) {
      return (ProfileIcons[7] && ProfileIcons[7]['icon']) ? ProfileIcons[7]['icon'] : '';
    } else  if (category && category.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER.toUpperCase()) {
      return (ProfileIcons[6] && ProfileIcons[6]['icon']) ? ProfileIcons[6]['icon'] : '';
    } else {
      return this.investmentEngagementService.getRiskProfileIcon(riskProfileType, isBalancedEnabled);
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
    if (this.authService.accessCorporateUserFeature('CREATE_JOINT_ACCOUNT')) {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO_TYPE]);
    } else {
      this.investmentEngagementService.setUserPortfolioType(INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.PERSONAL_ACCOUNT_ID);
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
    }
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
    }  else if (this.portfolioCategory === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.CPF) {
      this.filterAndCalculate(INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.CPF);
    } else {
      this.filteredNotInvestedList = this.notInvestedList;
      this.filteredInvestedList = this.investedList;
      this.filteredAwaitingList = this.awaitingList;
      this.filteredWithdrawnList = this.withdrawnList;
      this.filteredDeclinedList = this.declinedList;
      this.filteredExpiredList = this.expiredList;
      this.filteredProgressList = this.progressList;
      this.filteredVerifyList = this.verifyList;
      this.filteredCpfProgressList = this.progressCpfList;
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
    this.filteredCpfProgressList = this.progressCpfList.filter((portfolio) => {
      return portfolio['portfolioCategory'].toUpperCase() === category.toUpperCase();
    });
    this.totalPortfoliosLength = this.filteredNotInvestedList.length + this.filteredInvestedList.length + this.filteredAwaitingList.length + this.filteredWithdrawnList.length + this.filteredDeclinedList.length + this.filteredExpiredList.length + this.filteredProgressList.length + this.filteredVerifyList.length + this.filteredCpfProgressList.length;
  }

  setBorderClass(portfolio) {
    if (portfolio['portfolioCategory'].toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER.toUpperCase()) {
      return 'ws-border';
    } else if (portfolio['portfolioCategory'].toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISEINCOME.toUpperCase()) {
      return 'wi-border';
    } else if (portfolio['portfolioCategory'].toUpperCase() === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.CPF.toUpperCase()) {
      return 'cpf-border';
    } else {
      return '';
    }
  }

  withDrawModal(portfolioName, customerPortfolioId) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true, windowClass: 'limited-width' });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_INVESTMENT.WITHDRAW_JOINT_ACCOUNT_APPLICATION');
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_INVESTMENT.WITHDRAW_JOINT_ACCOUNT_APPLICATION_DESC'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant('YOUR_INVESTMENT.CONFIRM_WITHDRAWAL');
    ref.componentInstance.primaryAction.subscribe(() => {
      this.manageInvestmentsService.setActionByHolder(customerPortfolioId, INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.WITHDRAW).subscribe(response => {
        if (response && response.responseMessage && response.responseMessage.responseCode == 6000) {
          const toastMessage: IToastMessage = {
            isShown: true,
            desc: this.translate.instant('TOAST_MESSAGES.WITHDRAW_PORTFOLIO_SUCCESS', { userGivenPortfolioName: portfolioName }),
          };
          this.manageInvestmentsService.setToastMessage(toastMessage);
          this.emitToastMessage.emit(true);
        } else {
          this.showErrorModal();
        }
      });
    });
  }

  deleteByHolder(portfolioName, customerPortfolioId) {
    this.manageInvestmentsService.setActionByHolder(customerPortfolioId, INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.DELETE).subscribe(response => {
      if (response && response.responseMessage && response.responseMessage.responseCode == 6000) {
        const toastMessage: IToastMessage = {
          isShown: true,
          desc: this.translate.instant('TOAST_MESSAGES.DELETE_PORTFOLIO_BY_HOLDER', { userGivenPortfolioName: portfolioName }),
        };
        this.manageInvestmentsService.setToastMessage(toastMessage);
        this.emitToastMessage.emit(true);
      } else {
        this.showErrorModal();
      }
    });
  }

  getTimeDifference() {
    this.filteredAwaitingList.forEach((awaitList: any, index) => {
      this.timeDifference = awaitList.applicationExpiryDate - awaitList.currentSgtDate;
      this.filteredAwaitingList[index].awaitingPeriod = (this.timeDifference > 0) ? this.allocateTimeUnits(this.timeDifference, true) : this.awaitingMsg;
    });
  }

  allocateTimeUnits(timeDifference, isStaticTextEnabled) {
    const secondsToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    const minutesToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    const hoursToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    const daysToDay = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    if(daysToDay >= 2 && hoursToDay == 0 && minutesToDay == 0) {
      return (daysToDay-1) + ' ' + ((daysToDay == 2) ? this.day : this.days);
    } else if (daysToDay > 0) {
      return daysToDay + ' ' + ((daysToDay == 1) ? this.day : this.days);
    } else {
      return (isStaticTextEnabled) ? this.awaitingMsg : hoursToDay + ' ' + this.hours + ' ' + minutesToDay + ' ' + this.minutes;
    }
  }
  acceptJAPortfolio(customerPortfolioId) {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ACCEPT_JA_HOLDER + '/' + customerPortfolioId]);
  }
  sendReminderModal(customerPortfolioId, secondaryHolderName) {
    this.manageInvestmentsService.setActionByHolder(customerPortfolioId, MANAGE_INVESTMENTS_CONSTANTS.JOINT_ACCOUNT.ACTIONS.SEND_REMINDER).subscribe((response) => {
      if (response && response.responseMessage && response.responseMessage.responseCode == 6000) {
        const toastMessage: IToastMessage = {
          isShown: true,
          desc: this.translate.instant('TOAST_MESSAGES.REMINDER_TEXT', { secondaryHolderName: secondaryHolderName })
        };
        this.setToasterAndEmit(toastMessage);
      } else if (response && response.responseMessage && response.responseMessage.responseCode == MANAGE_INVESTMENTS_CONSTANTS.JOINT_ACCOUNT.ERROR_CODES.ONE_REMINDER_PER_DAY) {
        const toastMessage: IToastMessage = {
          isShown: true,
          desc: this.translate.instant('TOAST_MESSAGES.ONE_REMINDER_PER_DAY')
        };
        this.setToasterAndEmit(toastMessage);
      } else {
        this.showErrorModal();
      }
    });
  }

  private setToasterAndEmit(toastMessage: IToastMessage) {
    this.manageInvestmentsService.setToastMessage(toastMessage);
    this.emitToastMessage.emit(false);
  }

  showErrorModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'YOUR_PORTFOLIO.JOINT_ACCOUNT.API_FAILED.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_PORTFOLIO.JOINT_ACCOUNT.API_FAILED.DESC'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'YOUR_PORTFOLIO.JOINT_ACCOUNT.API_FAILED.BUTTON_TEXT'
    );
    ref.componentInstance.primaryAction.subscribe(() => {
      const emitOptions = {
        action: MANAGE_INVESTMENTS_CONSTANTS.JOINT_ACCOUNT.REFRESH
      }
      this.emitMessage.emit(emitOptions);
    });
  }
  verify(customerPortfolioId) {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.ADD_SECONDARY_HOLDER_DETAILS + "/" + customerPortfolioId]);
  }

  getPortFolioBadgeData(portfolio: any): string {
    let textKey = portfolio?.fundingTypeValue == INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.SRS ? 'YOUR_INVESTMENT.SRS'  : 'YOUR_INVESTMENT.CPF_OA';
    return this.translate.instant(textKey);
  }
}
