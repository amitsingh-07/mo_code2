import { PortfolioService } from 'src/app/portfolio/portfolio.service';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PORTFOLIO_ROUTE_PATHS } from '../../portfolio/portfolio-routes.constants';
import { ProfileIcons } from '../../portfolio/risk-profile/profileIcons';
import {
    BreakdownAccordionComponent
} from '../../shared/components/breakdown-accordion/breakdown-accordion.component';
import {
    BreakdownBarComponent
} from '../../shared/components/breakdown-bar/breakdown-bar.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { FundDetails } from '../../topup-and-withdraw/fund-your-account/fund-details';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
import {
    AccountCreationErrorModalComponent
} from '../account-creation-error-modal/account-creation-error-modal.component';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';
import {
    EditInvestmentModalComponent
} from './edit-investment-modal/edit-investment-modal.component';
import { FeesModalComponent } from './fees-modal/fees-modal.component';

@Component({
  selector: 'app-confirm-portfolio',
  templateUrl: './confirm-portfolio.component.html',
  styleUrls: ['./confirm-portfolio.component.scss']
})
export class ConfirmPortfolioComponent implements OnInit {

  uploadForm: FormGroup;
  pageTitle: string;
  formValues;
  countries;
  isUserNationalitySingapore;
  defaultThumb;
  showLoader;
  loaderTitle;
  loaderDesc;
  formData: FormData = new FormData();
  portfolio;
  riskProfileImage: any;

  breakdownSelectionindex: number = null;
  isAllocationOpen = false;

  legendColors: string[] = ['#3cdacb', '#ec681c', '#76328e'];

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public portfolioService: PortfolioService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CONFIRM_PORTFOLIO.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.getPortfolioDetails();
  }

  getPortfolioDetails() {
    const params = this.constructgetPortfolioParams();
    this.investmentAccountService.getPortfolioAllocationDetails(params).subscribe((data) => {
      this.portfolio = data.objectList;
      this.riskProfileImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];
      const fundingParams = this.constructFundingParams(data.objectList);
      this.topupAndWithDrawService.setFundingDetails(fundingParams);
    });
  }

  constructFundingParams(data) {
    const topupValues = {
      source: 'FUNDING',
      portfolio: {
        productName: data.portfolioName,
        riskProfile: data.riskProfile
      },
      oneTimeInvestment: data.initialInvestment,
      monthlyInvestment: data.monthlyInvestment,
      fundingType: '', // todo
      isAmountExceedBalance: 0,
      exceededAmount: 0
    };
    return topupValues;
  }

  constructgetPortfolioParams() {
    return {
    };
  }

  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
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
    if ((!this.isAllocationOpen)) {
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
    const errorTitle = this.translate.instant('CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.TITLE');
    const errorMessage = this.translate.instant('CONFIRM_PORTFOLIO.MODAL.PROJECTED_RETURNS.MESSAGE');
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.imgType = 1;
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessageHTML = errorMessage;
  }

  showFeesModal() {
    const ref = this.modal.open(FeesModalComponent, { centered: true });
  }

  openEditInvestmentModal() {
    const ref = this.modal.open(EditInvestmentModalComponent, {
      centered: true
    });
    ref.componentInstance.investmentData = {
      investmentPeriod: this.portfolio.tenure,
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
    const errorTitle = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.ACCOUNT_CREATION_ERROR_MODAL.TITLE');
    const errorMessage = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.ACCOUNT_CREATION_ERROR_MODAL.DESCRIPTION');
    const ref = this.modal.open(AccountCreationErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessage = errorMessage;
    ref.componentInstance.errorList = errorList;
  }

  showCustomErrorModal(title, desc) {
    const errorTitle = title;
    const errorMessage = desc;
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorMessage = errorMessage;
  }

  viewFundDetails(fund) {
    this.portfolioService.setFund(fund);
    this.router.navigate([PORTFOLIO_ROUTE_PATHS.FUND_DETAILS]);
  }

  goToNext() {
    const pepData = this.investmentAccountService.getPepData();
    // tslint:disable-next-line:triple-equals
    if (pepData == true) {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION]);
    } else {
      // CREATE INVESTMENT ACCOUNT
      console.log('Attempting to create ifast account');
      this.investmentAccountService.createInvestmentAccount().subscribe((response) => {
        if (response.responseMessage.responseCode < 6000) { // ERROR SCENARIO
          if (response.responseMessage.responseCode === 5018
            || response.responseMessage.responseCode === 5019) {
            const errorResponse = response.responseMessage.responseDescription;
            this.showCustomErrorModal('Error!', errorResponse);
          } else {
            const errorResponse = response.objectList[response.objectList.length - 1];
            const errorList = errorResponse.serverStatus.errors;
            this.showInvestmentAccountErrorModal(errorList);
          }
        } else { // SUCCESS SCENARIO
          if (response.objectList[response.objectList.length - 1]) {
            if (response.objectList[response.objectList.length - 1].data.status === 'confirmed') {
              this.investmentAccountService.setAccountSuccussModalCounter(0);
              this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.FUND_INTRO]);
            } else {
              this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS_LATER]);
            }
          }
        }
      },
        (err) => {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.TITLE');
          ref.componentInstance.errorMessage = this.translate.instant('INVESTMENT_ACCOUNT_COMMON.GENERAL_ERROR.DESCRIPTION');
        });
    }
  }
}
