import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import {
  EditInvestmentModalComponent
} from '../../../shared/modal/edit-investment-modal/edit-investment-modal.component';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../investment-account/investment-account.constant';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import {
  InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import { IToastMessage } from '../../manage-investments/manage-investments-form-data';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../manage-investments/manage-investments-routes.constants';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { AddPortfolioNameComponent } from '../add-portfolio-name/add-portfolio-name.component';
import {
  AddPortfolioStatusComponent
} from '../add-portfolio-status/add-portfolio-status.component';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';
import {
  AccountCreationErrorModalComponent
} from './account-creation-error-modal/account-creation-error-modal.component';
import { IAccountCreationActions } from '../investment-common-form-data';

@Component({
  selector: 'app-confirm-portfolio',
  templateUrl: './confirm-portfolio.component.html',
  styleUrls: ['./confirm-portfolio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmPortfolioComponent implements OnInit {
  uploadForm: FormGroup;
  pageTitle: string;
  formValues;
  countries;
  defaultThumb;
  formData: FormData = new FormData();
  portfolio;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  userInputSubtext;
  iconImage;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;
  legendColors: string[] = ['#3cdacb', '#ec681c', '#76328e'];
  isRequestSubmitted = false;
  isSubsequentPortfolio = false;

  defaultPortfolioName;
  confirmPortfolioValue;
  portfolioName;
  showErrorMessage = false;
  userGivenPortfolioName;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public manageInvestmentsService: ManageInvestmentsService,
    public investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PORTFOLIO_RECOMMENDATION.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const params = this.constructgetPortfolioParams();
    this.investmentAccountService
      .getPortfolioAllocationDetailsWithAuth(params)
      .subscribe((data) => {
        this.portfolio = data.objectList;
        this.iconImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
        const fundingParams = this.constructFundingParams(data.objectList);
        this.manageInvestmentsService.setFundingDetails(fundingParams);
        this.userInputSubtext = {
          onetime: this.currencyPipe.transform(
            this.portfolio.initialInvestment,
            'USD',
            'symbol-narrow',
            '1.0-2'
          ),
          monthly: this.currencyPipe.transform(
            this.portfolio.monthlyInvestment,
            'USD',
            'symbol-narrow',
            '1.0-2'
          ),
          period: this.portfolio.investmentPeriod
        };
      });
  }

  constructFundingParams(data) {
    return {
      source: 'FUNDING',
      redirectTo: 'DASHBOARD',
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

  constructgetPortfolioParams() {
    return {

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
    this.investmentAccountService.updateInvestment(params).subscribe((data) => {
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

  showInvestmentAccountErrorModal(errorList) {
    const errorTitle = this.translate.instant(
      'PORTFOLIO_RECOMMENDATION.ACCOUNT_CREATION_ERROR_MODAL.TITLE'
    );
    const ref = this.modal.open(AccountCreationErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorList = errorList;
  }

  showCustomErrorModal(title, desc) {
    const errorTitle = title;
    const errorMessage = desc;
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessage = errorMessage;
  }

  confirmPortfolio() {
    this.investmentCommonService.confirmPortfolio(this.portfolio.customerPortfolioId).subscribe((data) => {
      if (data.responseMessage.responseCode === 6000) {
        this.showAddPortfolioNameModal(data.objectList[this.portfolio.customerPortfolioId]);
      } else if (data.responseMessage.responseCode === 5119) {
        const confirmationPortfolio = this.investmentAccountService.getConfirmPortfolioName();
        this.showAddPortfolioNameModal(confirmationPortfolio);
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  showAddPortfolioNameModal(defaultPortfolioName) {
    const ref = this.modal.open(AddPortfolioNameComponent, {
      centered: true,
      backdropClass: 'portfolio-naming-backdrop',
      windowClass: 'portfolio-naming',
    });
    ref.componentInstance.riskProfileId = this.portfolio.riskProfile.id;
    ref.componentInstance.defaultPortfolioName = defaultPortfolioName;
    ref.componentInstance.showErrorMessage = this.showErrorMessage;
    ref.componentInstance.userPortfolioName = this.investmentCommonService.getConfirmPortfolioName();
    ref.componentInstance.addPortfolioBtn.subscribe((portfolioName) => {
      this.investmentCommonService.setConfirmPortfolioName(portfolioName);
      this.savePortfolioName(portfolioName);
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
      title: 'Loading...',
      desc: 'Please wait.'
    });
    const param = this.constructSavePortfolioName(portfolioName);
    this.investmentCommonService.savePortfolioName(param).subscribe((response) => {
      this.loaderService.hideLoader();
      if (response.responseMessage.responseCode >= 6000) {
        this.userGivenPortfolioName = portfolioName;
        this.showAddPortfolioStatusModal(portfolioName);
        this.showErrorMessage = false;
      } else if (response.responseMessage.responseCode === 5120) {
        this.showAddPortfolioNameModal(portfolioName);
        this.showErrorMessage = true;
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  showAddPortfolioStatusModal(portfolioName) {
    const reference = this.modal.open(AddPortfolioStatusComponent, {
      centered: true,
      backdropClass: 'portfolio-naming-backdrop',
      windowClass: 'portfolio-naming',
    });
    reference.componentInstance.riskProfileId = this.portfolio.riskProfile.id;
    reference.componentInstance.portfolioName = portfolioName;
    reference.componentInstance.createdNameSuccessfully.subscribe(() => {
      this.reDirectToNextScreen();
    });
  }

  reDirectToNextScreen() {
    this.investmentCommonService.getAccountCreationActions().subscribe((data: IAccountCreationActions) => {
      if (this.investmentCommonService.isUsersFirstPortfolio(data)) { /* FIRST TIME PORTFOLIO */
        this.verifyAML();
      } else { /* SUBSEQUENT PORTFOLIO */
        this.isSubsequentPortfolio = true;
        this.createInvestmentAccount();
      }
    });
  }

  verifyAML() {
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant(
          'PORTFOLIO_RECOMMENDATION.CREATING_ACCOUNT_LOADER.TITLE'
        ),
        desc: this.translate.instant(
          'PORTFOLIO_RECOMMENDATION.CREATING_ACCOUNT_LOADER.DESCRIPTION'
        )
      });
      const pepData = this.investmentAccountService.getPepData();
      this.investmentAccountService.verifyAML().subscribe(
        (response) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          if (response.objectList && response.objectList.status) {
            this.investmentAccountService.setAccountCreationStatus(
              response.objectList.status
            );
          }
          if (response.responseMessage.responseCode < 6000) {
            // ERROR SCENARIO
            if (
              response.objectList &&
              response.objectList.length &&
              response.objectList[response.objectList.length - 1].serverStatus &&
              response.objectList[response.objectList.length - 1].serverStatus.errors &&
              response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              const errorResponse = response.objectList[response.objectList.length - 1];
              const errorList = errorResponse.serverStatus.errors;
              this.showInvestmentAccountErrorModal(errorList);
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal('Error!', errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else if (
            response.objectList.status.toUpperCase() === INVESTMENT_ACCOUNT_CONSTANTS.status.aml_cleared.toUpperCase() &&
            !pepData
          ) {
            this.createInvestmentAccount();
          } else {
            this.goToAdditionalDeclaration();
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }

  goToAdditionalDeclaration() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION]);
  }

  // tslint:disable-next-line:cognitive-complexity
  createInvestmentAccount() {
    const params = this.constructCreateInvAccountParams();
    if (!this.isRequestSubmitted) {
      this.isRequestSubmitted = true;
      this.loaderService.showLoader({
        title: this.translate.instant(
          'PORTFOLIO_RECOMMENDATION.CREATING_ACCOUNT_LOADER.TITLE'
        ),
        desc: this.translate.instant(
          'PORTFOLIO_RECOMMENDATION.CREATING_ACCOUNT_LOADER.DESCRIPTION'
        )
      });
      this.investmentAccountService.createInvestmentAccount(params).subscribe(
        (response) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          if (response.responseMessage.responseCode < 6000) {
            // ERROR SCENARIO
            if (
              response.objectList &&
              response.objectList.length &&
              response.objectList[response.objectList.length - 1].serverStatus &&
              response.objectList[response.objectList.length - 1].serverStatus.errors &&
              response.objectList[response.objectList.length - 1].serverStatus.errors.length
            ) {
              const errorResponse = response.objectList[response.objectList.length - 1];
              const errorList = errorResponse.serverStatus.errors;
              this.showInvestmentAccountErrorModal(errorList);
            } else if (response.responseMessage && response.responseMessage.responseDescription) {
              const errorResponse = response.responseMessage.responseDescription;
              this.showCustomErrorModal('Error!', errorResponse);
            } else {
              this.investmentAccountService.showGenericErrorModal();
            }
          } else {
            // SUCCESS SCENARIO
            if (response.objectList[response.objectList.length - 1]) {
              if (
                response.objectList[response.objectList.length - 1].data.status.toUpperCase() ===
                INVESTMENT_ACCOUNT_CONSTANTS.status.account_creation_confirmed.toUpperCase()
              ) {
                this.handleAccountCreationSuccess();
              } else {
                this.investmentAccountService.setAccountCreationStatus(
                  INVESTMENT_ACCOUNT_CONSTANTS.status.account_creation_pending
                );
                this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SETUP_PENDING]);
              }
            }
          }
        },
        (err) => {
          this.isRequestSubmitted = false;
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        }
      );
    }
  }

  handleAccountCreationSuccess() {
    if (this.isSubsequentPortfolio) {
      this.investmentAccountService.setAccountSuccussModalCounter(0);
    }
    const toastMessage: IToastMessage = {
      isShown: false,
      desc: this.translate.instant('TOAST_MESSAGES.ADD_PORTFOLIO_SUCCESS', {userGivenPortfolioName : this.userGivenPortfolioName} ),
      link_label: '', /* TODO: 'View' should be passed once portfolio screen is ready */
      link_url: MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_PORTFOLIO
    };
    this.manageInvestmentsService.setToastMessage(toastMessage);
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUND_INTRO]);
  }

  constructCreateInvAccountParams() {
    return {
      customerPortfolioId: this.portfolio.customerPortfolioId
    };
  }
}
