import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import {
  EditInvestmentModalComponent
} from '../../../shared/modal/edit-investment-modal/edit-investment-modal.component';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { FormatCurrencyPipe } from '../../../shared/Pipes/format-currency.pipe';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import {
  InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { IInvestmentCriteria } from '../investment-common-form-data';
import { INVESTMENT_COMMON_ROUTES, INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment-engagement-journey/investment-engagement-journey.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { AcknowledgementComponent } from '../acknowledgement/acknowledgement.component';
import { IToastMessage } from '../../../investment/manage-investments/manage-investments-form-data';
import {
  MANAGE_INVESTMENTS_ROUTE_PATHS
} from '../../../investment/manage-investments/manage-investments-routes.constants';
@Component({
  selector: 'app-confirm-portfolio',
  templateUrl: './confirm-portfolio.component.html',
  styleUrls: ['./confirm-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmPortfolioComponent implements OnInit {
  uploadForm: FormGroup;
  pageTitle: string;
  countries;
  portfolio;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  userInputSubtext;
  iconImage;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;
  confirmPortfolioValue;
  investmentCriteria: IInvestmentCriteria;
  wiseSaverDetails: any;
  wiseIncomeEnabled: any;
  investmentEnabled: any;
  wiseSaverEnabled: any;
  userPortfolioType: any;
  isJAEnabled: boolean;
  tncCheckboxForm: FormGroup;
  acceptJAHolderDetails: any;
  isAcceptPortfolio = false;
  customerPortfolioId: any;
  primaryHolderName;
  jaAcceptanceTitle: any;
  bankDetails: any;

  @Output() emitToastMessage = new EventEmitter<boolean>();
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public manageInvestmentsService: ManageInvestmentsService,
    public investmentAccountService: InvestmentAccountService,
    private investmentCommonService: InvestmentCommonService,
    private authService: AuthenticationService,
    private formatCurrencyPipe: FormatCurrencyPipe,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.TITLE');
      this.jaAcceptanceTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.JA_ACCEPTANCE_TITLE');
      if (this.router.url.indexOf(INVESTMENT_COMMON_ROUTES.ACCEPT_JA_HOLDER) >= 0) {
        this.setPageTitle(this.jaAcceptanceTitle);
      } else {
        this.setPageTitle(this.pageTitle);
      }
    });
    this.userPortfolioType = investmentEngagementJourneyService.getUserPortfolioType();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.tncCheckboxForm = this.formBuilder.group({
      tncCheckboxFlag: ['']
    });
    if (this.router.url.indexOf(INVESTMENT_COMMON_ROUTES.ACCEPT_JA_HOLDER) >= 0) {
      this.isAcceptPortfolio = true;
      this.route.paramMap
        .subscribe(
          params => {
            this.customerPortfolioId = params.get('customerPortfolioId');
            this.acceptAndGetPortfolioDetails(this.customerPortfolioId);
          }
        );
    } else {
      this.getPortfolioDetails();
    }
  }

  checkIfJointAccount() {
    return this.userPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT_ID;
  }

  getPortfolioDetails() {
    let apiCall = this.investmentAccountService.getPortfolioAllocationDetailsWithAuth();
    let majorHolderData = this.investmentEngagementJourneyService.getMajorSecondaryHolderData();
    let minorHolderData = this.investmentEngagementJourneyService.getMinorSecondaryHolderData();
    if (this.checkIfJointAccount()) {
      let jaAccountId;
      if (majorHolderData && majorHolderData.jaAccountId) {
        jaAccountId = majorHolderData.jaAccountId;
      } else if (minorHolderData && minorHolderData.jaAccountId) {
        jaAccountId = minorHolderData.jaAccountId;
      }
      apiCall = this.investmentAccountService.getPortfolioAllocationDetailsWithAuthAndJA(jaAccountId);
    }
    apiCall.subscribe((data) => {
      if (data.objectList && data.objectList.enquiryId) { /* Overwriting enquiry id */
        this.authService.saveEnquiryId(data.objectList.enquiryId);
      }
      if (majorHolderData) {
        majorHolderData.customerPortfolioId = data.objectList.customerPortfolioId;
        majorHolderData.jaAccountId = null;
        this.investmentEngagementJourneyService.setMajorSecondaryHolderData(majorHolderData);
      }
      if (minorHolderData) {
        minorHolderData.customerPortfolioId = data.objectList.customerPortfolioId;
        minorHolderData.jaAccountId = null;
        this.investmentEngagementJourneyService.setMinorSecondaryHolderData(minorHolderData);
      }
      this.portfolio = data.objectList;
      this.investmentCommonService.setPortfolioType(this.portfolio.portfolioType)
      this.investmentCommonService.setPortfolioDetails(this.portfolio);
      this.isJAEnabled = this.checkIfJointAccount();
      this.investmentEnabled = (this.portfolio.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVESTMENT.toLowerCase());
      this.wiseSaverEnabled = (this.portfolio.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER.toLowerCase());
      this.wiseIncomeEnabled = (this.portfolio.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME.toLowerCase());
      this.getInvestmentCriteria(this.portfolio);
      if (this.portfolio.portfolioType === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.INVESTMENT) {
        this.investmentEngagementJourneyService.setSelectPortfolioType({ selectPortfolioType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO });
        this.iconImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
      } else if (this.portfolio.portfolioType === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER) {
        this.getWiseSaverDetails();
        this.investmentEngagementJourneyService.setSelectPortfolioType({ selectPortfolioType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO });
      } else {
        this.investmentEngagementJourneyService.setSelectPortfolioType({ selectPortfolioType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO });
      }
      const fundingParams = this.constructFundingParams(data.objectList);
      this.manageInvestmentsService.setFundingDetails(fundingParams);
      if (this.portfolio.fundingTypeId) {
        this.investmentCommonService.setInitialFundingMethod({ initialFundingMethodId: this.portfolio.fundingTypeId });
      }
      this.userInputSubtext = {
        onetime: this.formatCurrencyPipe.transform(
          this.portfolio.initialInvestment
        ),
        monthly: this.formatCurrencyPipe.transform(
          this.portfolio.monthlyInvestment
        ),
        period: this.portfolio.investmentPeriod
      };
    });
  }
  getWiseSaverDetails() {
    this.investmentCommonService.getWiseSaverDetails().subscribe((data) => {
      this.wiseSaverDetails = data.objectList;
    });
  }
  constructFundingParams(data) {
    return {
      source: 'FUNDING',
      redirectTo: 'YOUR_INVESTMENT',
      portfolio: {
        productName: data.portfolioName,
        riskProfile: data.riskProfile
      },
      oneTimeInvestment: data.initialInvestment,
      monthlyInvestment: data.monthlyInvestment,
      fundingType: '',
      isAmountExceedBalance: 0,
      exceededAmount: 0,
      customerPortfolioId: data.customerPortfolioId
    };
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  setNestedDropDownValue(key, value, nestedKey) {
    this.uploadForm.controls[nestedKey]['controls'][key].setValue(value);
  }

  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }

  selectAllocation(event) {
    if (!this.isAllocationOpen) {
      this.breakdownSelectionindex = event;
      this.isAllocationOpen = true;
    } else {
      if (event !== this.breakdownSelectionindex) {
        // different tab
        this.breakdownSelectionindex = event;
        this.isAllocationOpen = true;
      } else {
        // same tab click
        this.breakdownSelectionindex = null;
        this.isAllocationOpen = false;
      }
    }
  }

  showPortfolioAssetModal() {
    const errorTitle = this.translate.instant(
      'PORTFOLIO_RECOMMENDATION.MODAL.PROJECTED_RETURNS.TITLE'
    );
    const errorMessage = this.translate.instant(
      'PORTFOLIO_RECOMMENDATION.MODAL.PROJECTED_RETURNS.MESSAGE'
    );
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessageHTML = errorMessage;
  }

  openEditInvestmentModal() {
    const ref = this.modal.open(EditInvestmentModalComponent, {
      centered: true
    });
    ref.componentInstance.investmentData = {
      oneTimeInvestment: this.portfolio.initialInvestment,
      monthlyInvestment: this.portfolio.monthlyInvestment
    };
    ref.componentInstance.investmentCriteria = this.investmentCriteria;
    ref.componentInstance.modifiedInvestmentData.subscribe((emittedValue) => {
      // update form data
      ref.close();
      this.saveUpdatedInvestmentData(emittedValue);
    });
    this.dismissPopup(ref);
  }

  dismissPopup(ref: NgbModalRef) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ref.close();
      }
    });
  }

  saveUpdatedInvestmentData(updatedData) {
    const params = this.constructUpdateInvestmentParams(updatedData);
    const customerPortfolioId = this.portfolio.customerPortfolioId;
    this.investmentAccountService.updateInvestment(customerPortfolioId, params).subscribe((data) => {
      this.getPortfolioDetails();
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  constructUpdateInvestmentParams(data) {
    return {
      initialInvestment: data.oneTimeInvestment,
      monthlyInvestment: data.monthlyInvestment
    };
  }

  goToWhatsTheRisk() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  confirmPortfolio() {
    this.investmentCommonService.confirmPortfolio(this.portfolio.customerPortfolioId).subscribe((data) => {
      if (data.responseMessage.responseCode === 6000 || data.responseMessage.responseCode === 5119) {
        this.investmentCommonService.clearAccountCreationActions();
        const namingFormData = {
          defaultPortfolioName: data.objectList.portfolioName,
          recommendedCustomerPortfolioId: this.portfolio.customerPortfolioId,
          recommendedRiskProfileId: this.portfolio.portfolioType === 'Investment' ? this.portfolio.riskProfile.id : this.portfolio.portfolioType === 'WiseSaver' ? 7 : 9
        };
        this.investmentAccountService.setPortfolioNamingFormData(namingFormData);
        if (this.checkIfJointAccount()) {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CONFIRM_WITHDRAWAL]);
        } else {
          this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUNDING_ACCOUNT_DETAILS]);
        }
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  getInvestmentCriteria(portfolioValues) {
    if (portfolioValues.portfolioType) {
      this.investmentCommonService.getInvestmentCriteria(portfolioValues.portfolioType).subscribe((data) => {
        this.investmentCriteria = data;
      });
    }
  }

  showPayoutModal() {
    if (this.wiseIncomeEnabled) {
      const ref = this.modal.open(ModelWithButtonComponent, {
        centered: true,
        windowClass: 'custom-payout-modal'
      });
      ref.componentInstance.imgType = 1;
      ref.componentInstance.closeBtn = false;
      if (INVESTMENT_COMMON_CONSTANTS.WISE_INCOME_PAYOUT.GROW === this.portfolio.payoutType || INVESTMENT_COMMON_CONSTANTS.WISE_INCOME_PAYOUT.FOUR_PERCENT === this.portfolio.payoutType) {
        ref.componentInstance.errorTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.WISE_INCOME_PORTFOLIO.POPUP.PAYOUT_TITLE');;
        ref.componentInstance.errorMessageHTML = this.translate.instant('PORTFOLIO_RECOMMENDATION.WISE_INCOME_PORTFOLIO.POPUP.PAYOUT_DESC');
      } else {
        ref.componentInstance.disablePrimaryBtn = true;
        ref.componentInstance.errorTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.WISE_INCOME_PORTFOLIO.POPUP.PAYOUT_TITLE');
        ref.componentInstance.checkBoxMessage = this.translate.instant('PORTFOLIO_RECOMMENDATION.WISE_INCOME_PORTFOLIO.POPUP.8PERCENT_DESC2');
        ref.componentInstance.errorMessageHTML = this.translate.instant('PORTFOLIO_RECOMMENDATION.WISE_INCOME_PORTFOLIO.POPUP.PAYOUT_DESC');
      }

      ref.componentInstance.primaryActionLabel = this.translate.instant(
        'PORTFOLIO_RECOMMENDATION.WISE_INCOME_PORTFOLIO.POPUP.UNDERSTAND_PROCEED'
      );
      ref.componentInstance.secondaryActionLabel = this.translate.instant(
        'PORTFOLIO_RECOMMENDATION.WISE_INCOME_PORTFOLIO.POPUP.CANCEL'
      );
      ref.componentInstance.secondaryActionDim = true;
      ref.componentInstance.primaryAction.subscribe(() => {
        this.confirmPortfolio();
      });
      ref.componentInstance.secondaryAction.subscribe(() => {
      });
    } else {
      this.confirmPortfolio();
    }
  }
  showTncModal() {
    const ref = this.modal.open(AcknowledgementComponent, {
      centered: true,
      windowClass: 'custom-full-height'
    });
    return false;
  }
  // accept or decline from dashboard
  acceptAndGetPortfolioDetails(customerPortfolioId) {
    this.investmentCommonService.acceptAndGetPortfolioDetails(customerPortfolioId).subscribe((data) => {
      if (data.responseMessage.responseCode < 6000) {
        this.showErrorModal();
      } else {
        if (data.objectList && data.objectList.enquiryId) { /* Overwriting enquiry id */
          this.authService.saveEnquiryId(data.objectList.enquiryId);
        }
        this.portfolio = data.objectList;
        this.primaryHolderName = {
          primaryName: this.portfolio?.primaryHolderName
        };
        this.investmentCommonService.setPortfolioType(this.portfolio.portfolioType)
        this.investmentCommonService.setPortfolioDetails(this.portfolio);
        this.isJAEnabled = this.checkIfJointAccount();
        this.investmentEnabled = (this.portfolio.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVESTMENT.toLowerCase());
        this.wiseSaverEnabled = (this.portfolio.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER.toLowerCase());
        this.wiseIncomeEnabled = (this.portfolio.portfolioType.toLowerCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME.toLowerCase());
        this.getInvestmentCriteria(this.portfolio);
        if (this.portfolio.portfolioType === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.INVESTMENT) {
          this.investmentEngagementJourneyService.setSelectPortfolioType({ selectPortfolioType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO });
          this.iconImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
        } else if (this.portfolio.portfolioType === INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISESAVER) {
          this.getWiseSaverDetails();
          this.investmentEngagementJourneyService.setSelectPortfolioType({ selectPortfolioType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO });
        } else {
          this.investmentEngagementJourneyService.setSelectPortfolioType({ selectPortfolioType: INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME_PORTFOLIO });
        }
        const fundingParams = this.constructFundingParams(data.objectList);
        this.manageInvestmentsService.setFundingDetails(fundingParams);
        if (this.portfolio.fundingTypeId) {
          this.investmentCommonService.setInitialFundingMethod({ initialFundingMethodId: this.portfolio.fundingTypeId });
        }
        this.userInputSubtext = {
          onetime: this.formatCurrencyPipe.transform(
            this.portfolio.initialInvestment
          ),
          monthly: this.formatCurrencyPipe.transform(
            this.portfolio.monthlyInvestment
          ),
          period: this.portfolio.investmentPeriod
        };
        this.bankDetails = {
          bank: this.portfolio?.bankName,
          accountNo: this.portfolio?.accountNo,
          nameOnAccount: this.portfolio?.accountName
        }
      }
    });
  }

  // decline
  decline(portfolioName, customerPortfolioId) {
    this.manageInvestmentsService.setActionByHolder(customerPortfolioId, INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.DECLINE).subscribe(resp => {
      if (resp && resp.responseMessage && resp.responseMessage.responseCode == 6000) {
        const toastMessage: IToastMessage = {
          isShown: true,
          desc: this.translate.instant('TOAST_MESSAGES.PORTFOLIO_DECLINED', { userGivenPortfolioName: portfolioName }),
        };
        this.manageInvestmentsService.setToastMessage(toastMessage);
        this.emitToastMessage.emit(portfolioName);
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
      } else {
        this.showErrorModal();
      }
    });
  }

  // accept to join
  acceptToJoin(portfolioName, customerPortfolioId) {
    this.manageInvestmentsService.setActionByHolder(customerPortfolioId, INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.ACCEPT).subscribe(resp => {
      if (resp && resp.responseMessage && resp.responseMessage.responseCode == 6000) {
        const toastMessage: IToastMessage = {
          isShown: true,
          desc: this.translate.instant('TOAST_MESSAGES.PORTFOLIO_ACCEPTED', { userGivenPortfolioName: portfolioName }),
        };
        this.manageInvestmentsService.setToastMessage(toastMessage);
        this.emitToastMessage.emit(portfolioName);
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
      } else {
        this.showErrorModal();
      }
    });
  }
  showErrorModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'PORTFOLIO_RECOMMENDATION.JOINT_ACCOUNT.API_FAILED.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'PORTFOLIO_RECOMMENDATION.JOINT_ACCOUNT.API_FAILED.DESC'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'PORTFOLIO_RECOMMENDATION.JOINT_ACCOUNT.API_FAILED.BUTTON_TEXT'
    );
    ref.componentInstance.primaryAction.subscribe(() => {
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
    });
    ref.componentInstance.closeAction.subscribe(() => {
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
    });
  }
}