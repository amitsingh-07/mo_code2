import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SignUpService } from 'src/app/sign-up/sign-up.service';

import { LoaderService } from 'src/app/shared/components/loader/loader.service';
import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';
import { PortfolioService } from '../../portfolio/portfolio.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { EditInvestmentModalComponent } from '../../shared/modal/edit-investment-modal/edit-investment-modal.component';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
import { AccountCreationErrorModalComponent } from '../account-creation-error-modal/account-creation-error-modal.component';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';
import { SIGN_UP_CONFIG } from './../../sign-up/sign-up.constant';

import { ProfileIcons } from '../../portfolio/risk-profile/profileIcons';

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
  isUserNationalitySingapore;
  defaultThumb;
  formData: FormData = new FormData();
  portfolio;
  colors: string[] = ['#ec681c', '#76328e', '#76328e'];
  userInputSubtext;
  iconImage;
  breakdownSelectionindex: number = null;
  isAllocationOpen = false;
  legendColors: string[] = ['#3cdacb', '#ec681c', '#76328e'];

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public portfolioService: PortfolioService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    private loaderService: LoaderService
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
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.getPortfolioDetails();
    }

  getPortfolioDetails() {
    const params = this.constructgetPortfolioParams();
    this.investmentAccountService
      .getPortfolioAllocationDetails(params)
      .subscribe((data) => {
        this.portfolio = data.objectList;
        this.iconImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
        const fundingParams = this.constructFundingParams(data.objectList);
        this.topupAndWithDrawService.setFundingDetails(fundingParams);
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
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
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
      exceededAmount: 0
    };
  }

  constructgetPortfolioParams() {
    return {};
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
      'CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.TITLE'
    );
    const errorMessage = this.translate.instant(
      'CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.MESSAGE'
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
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.WHATS_THE_RISK]);
  }

  showInvestmentAccountErrorModal(errorList) {
    const errorTitle = this.translate.instant(
      'INVESTMENT_ACCOUNT_COMMON.ACCOUNT_CREATION_ERROR_MODAL.TITLE'
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

  verifyCustomer() {
    const investStatus = this.signUpService.getInvestmentStatus();
    if (investStatus && investStatus === SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATION_FAILED) {
      const pepData = this.investmentAccountService.getPepData();
      const OldPepData = this.investmentAccountService.getOldPepData();
      if (pepData && !OldPepData) {
        this.goToAdditionalDeclaration();
      } else {
        this.createInvestmentAccount();
      }
    } else {
      this.verifyAML();
    }
  }

  verifyAML() {
    this.loaderService.showLoader({
      title: this.translate.instant(
        'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.TITLE'
      ),
      desc: this.translate.instant(
        'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.DESCRIPTION'
      )
    });
    const pepData = this.investmentAccountService.getPepData();
    this.investmentAccountService.verifyAML().subscribe(
      (response) => {
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
          response.objectList.status.toUpperCase() === INVESTMENT_ACCOUNT_CONFIG.status.aml_cleared.toUpperCase() &&
          !pepData
        ) {
          this.createInvestmentAccount();
        } else {
          this.goToAdditionalDeclaration();
        }
      },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      }
    );
  }

  goToAdditionalDeclaration() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION]);
  }

  // tslint:disable-next-line:cognitive-complexity
  createInvestmentAccount() {
    this.loaderService.showLoader({
      title: this.translate.instant(
        'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.TITLE'
      ),
      desc: this.translate.instant(
        'INVESTMENT_ACCOUNT_COMMON.CREATING_ACCOUNT_LOADER.DESCRIPTION'
      )
    });
    this.investmentAccountService.createInvestmentAccount().subscribe(
      (response) => {
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
              INVESTMENT_ACCOUNT_CONFIG.status.account_creation_confirmed.toUpperCase()
            ) {
              this.investmentAccountService.setAccountSuccussModalCounter(0);
              this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FUND_INTRO]);
            } else {
              this.investmentAccountService.setAccountCreationStatus(
                INVESTMENT_ACCOUNT_CONFIG.status.account_creation_pending
              );
              this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SETUP_PENDING]);
            }
          }
        }
      },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      }
    );
  }
}
