import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ConfigService, IConfig } from '../../../config/config.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { GroupByPipe } from '../../../shared/Pipes/group-by.pipe';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import {
  InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import { IToastMessage } from '../manage-investments-form-data';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../manage-investments-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS, PORTFOLIO_WITHDRAWAL_KEYS } from '../manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';
import { environment } from './../../../../environments/environment';
import { SignUpService } from './../../../sign-up/sign-up.service';
import { RenameInvestmentModalComponent } from './rename-investment-modal/rename-investment-modal.component';
import { INVESTMENT_COMMON_CONSTANTS } from './../../investment-common/investment-common.constants';

@Component({
  selector: 'app-your-portfolio',
  templateUrl: './your-portfolio.component.html',
  styleUrls: ['./your-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourPortfolioComponent implements OnInit, OnDestroy {
  pageTitle: string;
  moreList: any;
  portfolio;
  holdingValues;
  yearlyReturns: any;
  totalReturnsPercentage: any;
  formValues: any;
  pendingBuyRequests;
  pendingSellRequests;
  pendingOnetimeBuyRequests;
  pendingMonthlyBuyRequests;
  riskProfileImage;
  isToastMessageShown: boolean;
  showErrorMessage: boolean;
  toastMsg: any;
  activeTab: string;
  srsAccDetail;
  portfolioWithdrawRequests = false;
  showAnnualizedReturns = false;
  addTopMargin: boolean;

  showPortfolioInfo = false; // Display the below 3 information
  totalInvested: any; // Cost of investment
  unrealisedGainOrLoss: any; // Unrealised gain/loss
  simpleReturnsValue: any; // Simple returns
  showTimeWeightedReturns = false;
  investmentAmount: any; // Net Deposits
  isExpand:boolean= false;
  private subscription: Subscription;

  showFixedToastMessage: boolean;
  portfolioType: any;
  isWiseIncomePortfolio: boolean = false;
  showDividend: boolean = false;
  wiseIncomePayoutType: any;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public navbarService: NavbarService,
    public signUpService: SignUpService,
    public authService: AuthenticationService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService,
    private modal: NgbModal,
    public footerService: FooterService,
    public manageInvestmentsService: ManageInvestmentsService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
    private configService: ConfigService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('YOUR_PORTFOLIO.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.translate.use(config.language);
      this.showAnnualizedReturns = config.showAnnualizedReturns;
      this.showPortfolioInfo = config['showPortfolioInfo'];
    });
    this.portfolioType = INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY_TYPE;
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(105);
    } else {
      this.navbarService.setNavbarMode(103);
    }
    this.footerService.setFooterVisibility(false);
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.moreList = MANAGE_INVESTMENTS_CONSTANTS.INVESTMENT_OVERVIEW.MORE_LIST;
    this.getCustomerPortfolioDetailsById(this.formValues.selectedCustomerPortfolioId);
    this.showBuyRequest();
    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.ROOT]);
      }
    });

    this.manageInvestmentsService.copyToastSubject.subscribe((data) => {
      if (data) {
        this.addTopMargin = false;
        this.showCopyToast(data);
      }
    });
    this.wiseIncomePayoutType=MANAGE_INVESTMENTS_CONSTANTS.WISEINCOME_PAYOUT_TYPE;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getCustomerPortfolioDetailsById(customerPortfolioId) {
    this.manageInvestmentsService.getCustomerPortfolioDetailsById(customerPortfolioId).subscribe((data) => {
      this.portfolio = data.objectList;
     this.manageInvestmentsService.setSelectedCustomerPortfolio(this.portfolio);
      this.holdingValues = this.portfolio.dPMSPortfolio ? this.portfolio.dPMSPortfolio.dpmsDetailsDisplay : null;
      this.constructFundingParams(this.portfolio);
      this.totalReturnsPercentage = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio.totalReturns
        ? this.portfolio.dPMSPortfolio.totalReturns
        : 0;
      this.yearlyReturns = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio.yearlyReturns
        ? this.portfolio.dPMSPortfolio.yearlyReturns
        : null;
      this.totalInvested = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio['totalInvested']
        ? this.portfolio.dPMSPortfolio['totalInvested']
        : 0;
      this.unrealisedGainOrLoss = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio['unrealisedGainOrLoss']
        ? this.portfolio.dPMSPortfolio['unrealisedGainOrLoss']
        : 0;
      this.simpleReturnsValue = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio['simpleReturns']
        ? this.portfolio.dPMSPortfolio['simpleReturns']
        : 0;
      this.investmentAmount = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio['investmentAmount']
        ? this.portfolio.dPMSPortfolio['investmentAmount']
        : 0;
      this.getTransferDetails(this.portfolio.customerPortfolioId);
      if (this.portfolio['portfolioType'].toUpperCase() === this.portfolioType.WISESAVER) {
        this.riskProfileImage = ProfileIcons[6]['icon'];
      } else if (this.portfolio['portfolioType'].toUpperCase() === this.portfolioType.WISEINCOME) {
        this.riskProfileImage = ProfileIcons[7]['icon'];
        this.isWiseIncomePortfolio = true;
      } else {
        this.riskProfileImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
      }
      if (this.portfolio.pendingRequestDTO && this.portfolio.pendingRequestDTO.transactionDetailsDTO) { /* Pending Transactions ? */
        this.investmentEngagementJourneyService.sortByProperty(
          this.portfolio.pendingRequestDTO.transactionDetailsDTO,
          'createdDate',
          'asc'
        );
        const buySellRequestGroups = new GroupByPipe().transform(
          this.portfolio.pendingRequestDTO.transactionDetailsDTO,
          'transactionType'
        );
        this.pendingBuyRequests = this.investmentEngagementJourneyService.findGroupByGroupName(buySellRequestGroups, 'BUY');
        this.pendingSellRequests = this.investmentEngagementJourneyService.findGroupByGroupName(buySellRequestGroups, 'SELL');
        if (this.pendingBuyRequests && this.pendingBuyRequests.value) {
          this.pendingOnetimeBuyRequests = this.groupBuyRequests(this.pendingBuyRequests, 'ONE_TIME');
          this.pendingMonthlyBuyRequests = this.groupBuyRequests(this.pendingBuyRequests, 'MONTHLY');
        }
        if (this.pendingSellRequests && this.pendingSellRequests.value) {
          this.portfolioWithdrawRequests = this.getPortfolioWithdrawalRequests(this.pendingSellRequests.value);
        }
      }
      this.getSrsAccDetails();
      this.showOrHideWhatsNextSection();
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }
  
  showNewMessageForRebalance(riskType) {
    if (MANAGE_INVESTMENTS_CONSTANTS.REBALANCE_ADDITIONAL_MESSAGE.includes(riskType.toUpperCase())) {
      return true;
    } else {
      return false;
    }
  }
   getPortfolioWithdrawalRequests(sellRequests) {
    return sellRequests.filter(
      (req) => PORTFOLIO_WITHDRAWAL_KEYS.indexOf(req.paymentMode) >= 0
    );
  }

  groupBuyRequests(buyRequests, transactionFrequency) {
    let awaitingFundRequests;
    let processingRequests;
    let recievedRequests;
    const onetimeMonthlyRequestGroups = new GroupByPipe().transform(
      buyRequests.value,
      'transactionFrequency'
    );
    const targetedBuyRequests =
      this.investmentEngagementJourneyService.findGroupByGroupName(onetimeMonthlyRequestGroups, transactionFrequency);
    if (targetedBuyRequests) {
      const transactionStatusGroups = new GroupByPipe().transform(
        targetedBuyRequests.value,
        'transactionStatus'
      );
      awaitingFundRequests = this.investmentEngagementJourneyService.findGroupByGroupName(transactionStatusGroups, 'AWAITING_FUND');
      processingRequests = this.investmentEngagementJourneyService.findGroupByGroupName(transactionStatusGroups, 'PROCESSING');
      recievedRequests = this.investmentEngagementJourneyService.findGroupByGroupName(transactionStatusGroups, 'RECEIVED');
    }
    if ((awaitingFundRequests && awaitingFundRequests.value && awaitingFundRequests.value.length)
      || (processingRequests && processingRequests.value && processingRequests.value.length)
      || (recievedRequests && recievedRequests.value && recievedRequests.value.length)) {
      return {
        awaitingFundRequests: awaitingFundRequests ? awaitingFundRequests.value : [],
        processingRequests: processingRequests ? processingRequests.value : [],
        recievedRequests: recievedRequests ? recievedRequests.value : []
      };
    } else {
      return null;
    }
  }

  showOrHideWhatsNextSection() {
    return !(this.pendingBuyRequests && this.pendingBuyRequests.value);
  }

  getWithdrawType(mode) {
    let withdrawType;
    switch (mode.toUpperCase()) {
      case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_CASH_ACCOUNT:
        withdrawType = this.translate.instant('YOUR_PORTFOLIO.PORTFOLIO_TO_CASH_ACCOUNT');
        break;
      case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_BANK_ACCOUNT:
        withdrawType = this.translate.instant('YOUR_PORTFOLIO.PORTFOLIO_TO_BANK_ACCOUNT');
        break;
      case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.CASH_TO_BANK_ACCOUNT:
        withdrawType = this.translate.instant('YOUR_PORTFOLIO.CASH_ACCOUNT_TO_BANK_ACCOUNT');
        break;
      case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_SRS_ACCOUNT:
        withdrawType = this.translate.instant('YOUR_PORTFOLIO.PORTFOLIO_TO_SRS_ACCOUNT');
        break;
      default:
        withdrawType = '';
    }
    return withdrawType;
  }

  constructFundingParams(data) {
    const FundValues = {
      source: 'FUNDING',
      redirectTo: 'PORTFOLIO',
      portfolio: {
        productName: data.portfolioName,
        riskProfile: data.riskProfile
      },
      oneTimeInvestment: data.initialInvestment,
      monthlyInvestment: data.monthlyInvestment,
      fundingType: '',
      isAmountExceedBalance: 0,
      exceededAmount: 0
    };
    this.manageInvestmentsService.setFundingDetails(FundValues);
  }

  gotoTopUp(monthly?: boolean) {
    const data = this.manageInvestmentsService.getTopUp();
    data['Investment'] = monthly ?
      MANAGE_INVESTMENTS_CONSTANTS.TOPUP.TOPUP_TYPES.MONTHLY.VALUE : MANAGE_INVESTMENTS_CONSTANTS.TOPUP.TOPUP_TYPES.ONE_TIME.VALUE;
    this.manageInvestmentsService.setTopUp(data);
    this.manageInvestmentsService.setSelectedCustomerPortfolioId(this.portfolio.customerPortfolioId);
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
  }

  showTotalReturnPopUp() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.TOTAL_RETURNS.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.TOTAL_RETURNS.MESSAGE'
    );
  }

  goToHoldings() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.HOLDINGS]);
  }

  goToAssetAllocation() {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.ASSET_ALLOCATION]);
  }

  selectMoreOption(option) {
    this.manageInvestmentsService.setSelectedCustomerPortfolioId(this.portfolio.customerPortfolioId);
    this.showMenu(option);
  }

  /*
  * Method to navigate to topup, transactions and withdraw based on menu selection
  */
  showMenu(option) {
    switch (option.id) {
      case 1: {
        if (this.portfolio.entitlements.showTopup) {
          this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
        }
        break;
      }
      case 2: {
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TRANSFER]);
        break;
      }
      case 3: {
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TRANSACTION]);
        break;
      }
      case 4: {
        this.showErrorMessage = false;
        this.showRenamePortfolioModal();
        break;
      }
      case 5: {
        if (this.portfolio.entitlements.showWithdrawPvToBa || this.portfolio.entitlements.showWithdrawPvToCa ||
          this.portfolio.entitlements.showWithdrawCaToBa || this.portfolio.entitlements.showWithdrawPvToSRS) {
          this.manageInvestmentsService.clearWithdrawalTypeFormData();
          this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.WITHDRAWAL]);
        }
        break;
      }
      case 6: {
        window.open(MANAGE_INVESTMENTS_CONSTANTS.TOPUP_INSTRUCTION_URL, '_blank');
        break;
      }
      case 7: {
        if (this.portfolio.entitlements.showDelete) {
          this.showDeletePortfolioModal();
        }
        break;
      }
     
    }
  }

  formatReturns(value) {
    return this.investmentAccountService.formatReturns(value);
  }

  /*
  * Method to get transfer details
  */
  getTransferDetails(customerPortfolioId) {
    this.manageInvestmentsService.getTransferDetails(customerPortfolioId).subscribe((data) => {
      this.manageInvestmentsService.setBankPayNowDetails(data.objectList);
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  goToTopupInstructionLink() {
    window.open(MANAGE_INVESTMENTS_CONSTANTS.TOPUP_INSTRUCTION_URL, '_blank');
  }
  showTransferInstructionModal() {
    let pendingBuyRequestCount = 0;
    if (this.pendingBuyRequests && this.pendingBuyRequests.value) {
      pendingBuyRequestCount = this.pendingBuyRequests.value.length;
    }
    this.manageInvestmentsService.showTransferInstructionModal(pendingBuyRequestCount);
  }

  showRenamePortfolioModal(errorValue?: string) {
    const ref = this.modal.open(RenameInvestmentModalComponent, { centered: true });
    ref.componentInstance.userPortfolioName = errorValue ? errorValue : this.portfolio.portfolioName;
    ref.componentInstance.showErrorMessage = this.showErrorMessage;
    ref.componentInstance.renamePortfolioBtn.subscribe((renamedPortfolioName) => {
      this.savePortfolioName(renamedPortfolioName);
    });
  }

  constructSavePortfolioName(data) {
    return {
      customerPortfolioId: this.portfolio.customerPortfolioId,
      portfolioName: data
    };
  }

  savePortfolioName(portfolioName) {
    this.loaderService.showLoader({
      title: this.translate.instant('YOUR_PORTFOLIO.MODAL.RENAME_PORTFOLIO.LOADING_TITLE'),
      desc: this.translate.instant('YOUR_PORTFOLIO.MODAL.RENAME_PORTFOLIO.LOADING_DESC')
    });
    const param = this.constructSavePortfolioName(portfolioName);
    this.investmentCommonService.savePortfolioName(param).subscribe((response) => {
      this.loaderService.hideLoader();
      if (response.responseMessage.responseCode >= 6000) {
        this.showToastMessage(this.portfolio.portfolioName, portfolioName);
        this.getCustomerPortfolioDetailsById(this.portfolio.customerPortfolioId);
        this.manageInvestmentsService.updateNewPortfolioName(this.portfolio.customerPortfolioId, portfolioName);
        this.showErrorMessage = false;
      } else if (response.responseMessage.responseCode === 5120) {
        this.showErrorMessage = true;
        this.showRenamePortfolioModal(portfolioName);
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  showToastMessage(oldName, newName) {
    this.toastMsg = {
      isShown: true,
      desc: this.translate.instant('TOAST_MESSAGES.RENAME_PORTFOLIO_SUCCESS',
        { oldPortfolioName: oldName, newPortfolioName: newName })
    };
    this.isToastMessageShown = true;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);

    this.hideToastMessage();
  }

  hideToastMessage() {
    setTimeout(() => {
      this.isToastMessageShown = false;
      this.showFixedToastMessage = false;
      this.toastMsg = null;
      this.addTopMargin = true;
    }, 3000);
  }

  showDeletePortfolioModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_INVESTMENT.DELETE');
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_INVESTMENT.DELETE_TXT'
    );
    ref.componentInstance.yesOrNoButton = 'Yes';
    ref.componentInstance.yesClickAction.subscribe(() => {
      this.manageInvestmentsService.deletePortfolio(this.portfolio).subscribe((data) => {
        if (data.responseMessage.responseCode < 6000) {
          if (
            data.objectList &&
            data.objectList.length &&
            data.objectList[data.objectList.length - 1].serverStatus &&
            data.objectList[data.objectList.length - 1].serverStatus.errors &&
            data.objectList[data.objectList.length - 1].serverStatus.errors.length
          ) {
            this.showCustomErrorModal(
              'Error!',
              data.objectList[data.objectList.length - 1].serverStatus.errors[0].msg
            );
          } else if (data.responseMessage && data.responseMessage.responseDescription) {
            const errorResponse = data.responseMessage.responseDescription;
            this.showCustomErrorModal('Error!', errorResponse);
          } else {
            this.investmentAccountService.showGenericErrorModal();
          }
        } else {
          this.authService.saveEnquiryId(null);
          this.goToInvOverview();
        }
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
    });
    ref.componentInstance.noClickAction.subscribe(() => { });
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }
  goToInvOverview() {
    this.manageInvestmentsService.clearToastMessage();
    const toastMessage: IToastMessage = {
      isShown: true,
      desc: this.translate.instant('TOAST_MESSAGES.DELTE_PORTFOLIO_SUCCESS', { userGivenPortfolioName: this.portfolio['portfolioName'] }),
      link_label: '',
      link_url: '',
      id: this.portfolio.customerPortfolioId
    };
    this.manageInvestmentsService.setToastMessage(toastMessage);
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.ROOT]);
  }

  showBuyRequest() {
    if (this.signUpService.getByRequestFlag()) {
      this.signUpService.clearByRequestFlag();
      this.activeTab = 'tab-2';
    } else {
      this.activeTab = 'tab-1';
    }
  }
  getSrsAccDetails() {
    if (this.portfolio.fundingTypeValue === 'SRS') {
      this.subscription = this.authService.get2faUpdateEvent.subscribe((token) => {
        this.manageInvestmentsService.getProfileSrsAccountDetails().subscribe((data) => {
          if (data) {
            this.srsAccDetail = data;
          } else {
            this.srsAccDetail = null;
          }
        },
          (err) => {
            this.investmentAccountService.showGenericErrorModal();
          });
      });
    }
  }

  toggleReturns() {
    if (!this.isWiseIncomePortfolio) {
      this.showTimeWeightedReturns = !this.showTimeWeightedReturns;
    }
  }

  showCalculationTooltip() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'modal-body-message' });
    ref.componentInstance.errorTitle = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.CALCULATE.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_PORTFOLIO.MODAL.CALCULATE.MESSAGE'
    );
  }

  showCopyToast(data) {
    this.toastMsg = data;
    this.showFixedToastMessage = true;
    this.hideToastMessage();
  }

  notify(event) {
    this.addTopMargin = true;
    const toasterMsg = {
      desc: this.translate.instant('TRANSFER_INSTRUCTION.COPIED')
    };
    this.showCopyToast(toasterMsg);
  }
  fullName() {
    this.isExpand = true;
  }

  goDividendPayout(event) {
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.DIVIDEND]);
    event.stopPropagation();
    event.preventDefault();
  }
}
