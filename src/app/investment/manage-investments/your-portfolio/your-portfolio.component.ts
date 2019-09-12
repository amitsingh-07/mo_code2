import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
import { MANAGE_INVESTMENTS_CONSTANTS } from '../manage-investments.constants';
import { ManageInvestmentsService } from '../manage-investments.service';
import { RenameInvestmentModalComponent } from './rename-investment-modal/rename-investment-modal.component';

@Component({
  selector: 'app-your-portfolio',
  templateUrl: './your-portfolio.component.html',
  styleUrls: ['./your-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourPortfolioComponent implements OnInit {
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
  isWhatsNextSectionShown = false;
  riskProfileImage;
  isToastMessageShown: boolean;
  showErrorMessage: boolean;
  toastMsg: any;

  constructor (
    public readonly translate: TranslateService,
    private router: Router,
    public navbarService: NavbarService,
    public authService: AuthenticationService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService,
    private modal: NgbModal,
    public footerService: FooterService,
    public manageInvestmentsService: ManageInvestmentsService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('YOUR_PORTFOLIO.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(103);
    this.footerService.setFooterVisibility(false);
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.moreList = MANAGE_INVESTMENTS_CONSTANTS.INVESTMENT_OVERVIEW.MORE_LIST;
    this.getCustomerPortfolioDetailsById(this.formValues.selectedCustomerPortfolioId);
  }

  getCustomerPortfolioDetailsById(customerPortfolioId) {
    this.manageInvestmentsService.getCustomerPortfolioDetailsById(customerPortfolioId).subscribe((data) => {
      this.portfolio = data.objectList;
      this.manageInvestmentsService.setSelectedCustomerPortfolio(this.portfolio);
      this.holdingValues = this.portfolio.dPMSPortfolio.dpmsDetailsDisplay;
      this.constructFundingParams(this.portfolio);
      this.totalReturnsPercentage = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio.totalReturns
                                    ? this.portfolio.dPMSPortfolio.totalReturns
                                    : 0;
      this.yearlyReturns = this.portfolio.dPMSPortfolio && this.portfolio.dPMSPortfolio.yearlyReturns
                           ? this.portfolio.dPMSPortfolio.yearlyReturns
                           : null;
      this.getTransferDetails(this.portfolio.customerPortfolioId);
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
      }
      this.riskProfileImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
      this.showOrHideWhatsNextSection();
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  groupBuyRequests(buyRequests, transactionFrequency) {
    const onetimeMonthlyRequestGroups = new GroupByPipe().transform(
      buyRequests.value,
      'transactionFrequency'
    );
    const targetedBuyRequests = this.investmentEngagementJourneyService.findGroupByGroupName(onetimeMonthlyRequestGroups, transactionFrequency);
    const transactionStatusGroups = new GroupByPipe().transform(
      targetedBuyRequests.value,
      'transactionStatus'
    );
    const awaitingFundRequests = this.investmentEngagementJourneyService.findGroupByGroupName(transactionStatusGroups, 'AWAITING_FUND');
    const processingRequests = this.investmentEngagementJourneyService.findGroupByGroupName(transactionStatusGroups, 'PROCESSING');
    const recievedRequests = this.investmentEngagementJourneyService.findGroupByGroupName(transactionStatusGroups, 'RECIEVED');
    return {
      awaitingFundRequests : awaitingFundRequests ? awaitingFundRequests.value : [],
      processingRequests: processingRequests ? processingRequests.value : [],
      recievedRequests: recievedRequests ? recievedRequests.value : []
    };
  }

  showOrHideWhatsNextSection() {
    if (this.portfolio.portfolioStatus === 'PURCHASED'
    && !this.portfolio.investmentAccountDTO.accountBalance
    && !(this.pendingBuyRequests && this.pendingBuyRequests.value)) {
          this.isWhatsNextSectionShown = true;
    }
  }

  getWithdrawType(mode) {
    let withdrawType;
    switch(mode.toUpperCase()) {
      case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_CASH_ACCOUNT:
        withdrawType = this.translate.instant('YOUR_PORTFOLIO.PORTFOLIO_TO_CASH_ACCOUNT');
        break;
      case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_BANK_ACCOUNT:
        withdrawType = this.translate.instant('YOUR_PORTFOLIO.PORTFOLIO_TO_BANK_ACCOUNT');
        break;
      case MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.CASH_TO_BANK_ACCOUNT: /* TODO: the value will be given by backend team */
        withdrawType = this.translate.instant('YOUR_PORTFOLIO.CASH_ACCOUNT_TO_BANK_ACCOUNT');
        break;
      default:
        withdrawType = "";
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

  gotoTopUp() {
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
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
      break;
    }
    case 2: {
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TRANSACTION]);
      break;
    }
    case 3: {
      this.showRenamePortfolioModal();
      break;
    }
    case 4: {
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.WITHDRAWAL]);
      break;
    }
    case 5: {
      this.showDeletePortfolioModal(this.portfolio);
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

  showRenamePortfolioModal() {
    const ref = this.modal.open(RenameInvestmentModalComponent, { centered: true });
    ref.componentInstance.userPortfolioName = this.portfolio.portfolioName;
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
        this.portfolio.portfolioName = portfolioName;
        this.showErrorMessage = false;
      } else if (response.responseMessage.responseCode === 5120) {
        this.showErrorMessage = true;
        this.portfolio.portfolioName = portfolioName;
        this.showRenamePortfolioModal();
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
       {oldPortfolioName : oldName, newPortfolioName: newName} )
    };
    this.isToastMessageShown = true;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
    setTimeout(() => {
      this.isToastMessageShown = false;
      this.toastMsg = null;
    }, 3000);
  }

  showDeletePortfolioModal(portfolio) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_INVESTMENT.DELETE');
    ref.componentInstance.errorMessage = this.translate.instant(
      'YOUR_INVESTMENT.DELETE_TXT'
    );
    ref.componentInstance.yesOrNoButton = 'Yes';
    ref.componentInstance.yesClickAction.subscribe(() => {
      this.manageInvestmentsService.deletePortfolio(portfolio).subscribe((data) => {
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
      desc: this.translate.instant('TOAST_MESSAGES.DELTE_PORTFOLIO_SUCCESS', {userGivenPortfolioName : this.portfolio['portfolioName']} ),
      link_label: '',
      link_url: ''
    };
    this.manageInvestmentsService.setToastMessage(toastMessage);
    this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.ROOT]);
  }
}
