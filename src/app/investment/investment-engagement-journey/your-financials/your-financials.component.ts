import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import {
    INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import {
    INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS
} from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';

@Component({
  selector: 'app-your-financials',
  templateUrl: './your-financials.component.html',
  styleUrls: ['./your-financials.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourFinancialsComponent implements IPageComponent, OnInit {
  myFinancialForm: FormGroup;
  financialFormValue;
  modalData: any;
  helpData: any;
  pageTitle: string;
  form: any;
  translator: any;
  loaderTitle: string;
  loaderDesc: string;
  constructor(
    private router: Router,
    private modal: NgbModal,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    public readonly translate: TranslateService,
    private investmentAccountService: InvestmentAccountService,
    private investmentCommonService: InvestmentCommonService,
    private cd: ChangeDetectorRef,
    private signUpService: SignUpService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('MY_FINANCIALS.TITLE');
      self.modalData = this.translate.instant('MY_FINANCIALS.modalData');
      self.helpData = this.translate.instant('MY_FINANCIALS.helpData');
      self.translator = this.translate.instant('MY_FINANCIALS');
      self.loaderTitle = this.translate.instant('MY_FINANCIALS.RESPONSE_LOADER.TITLE');
      self.loaderDesc = this.translate.instant('MY_FINANCIALS.RESPONSE_LOADER.DESC');
      this.setPageTitle(self.pageTitle);
    });
  }

  setPageTitle(title: string) {
    const stepLabel = this.translate.instant('MY_FINANCIALS.STEP_1_LABEL');
    this.navbarService.setPageTitle(
      title,
      undefined,
      undefined,
      undefined,
      undefined,
      stepLabel
    );
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.financialFormValue = this.investmentEngagementJourneyService.getPortfolioFormData();
    if (this.isLoggedInUser() && this.isFirstTimeUser()) {
      this.getFinancialDetails();

    }
    this.buildFrom();
  }

  buildFrom() {
    this.myFinancialForm = new FormGroup({
      monthlyIncome: new FormControl(this.financialFormValue.monthlyIncome),
      percentageOfSaving: new FormControl(this.financialFormValue.percentageOfSaving),
      totalAssets: new FormControl(this.financialFormValue.totalAssets),
      totalLiabilities: new FormControl(this.financialFormValue.totalLiabilities),
      suffEmergencyFund: new FormControl(
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.sufficient_emergency_fund)
    });
  }

  showEmergencyFundModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modalData.modalTitle;
    ref.componentInstance.errorMessage = this.modalData.modalMessage;
    ref.componentInstance.primaryActionLabel = this.translator.RETURN_HOME;
    ref.componentInstance.primaryAction.subscribe((emittedValue) => {
      this.router.navigate(['home']);
    });
  }

  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.helpData.modalTitle;
    ref.componentInstance.errorDescription = this.helpData.modalDesc;
    return false;
  }

  goToNext(form) {
    if (this.myFinancialForm.controls.suffEmergencyFund.value === 'no') {
      this.showEmergencyFundModal();
      return;
    }
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
    }
    const error = this.investmentEngagementJourneyService.financialValidation(form, this.financialFormValue);
    if (error) {
      // tslint:disable-next-line:no-commented-code
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessageHTML = error.errorMessage;
      // tslint:disable-next-line:triple-equals
      if (error.isButtons) {
        ref.componentInstance.primaryActionLabel = this.translator.REVIEW_INPUT;
        ref.componentInstance.secondaryActionLabel = this.translator.PROCEED_NEXT;
        ref.componentInstance.secondaryActionDim = true;
        ref.componentInstance.primaryAction.subscribe((emittedValue) => {
          // tslint:disable-next-line:triple-equals
          this.goBack(form);
        });
        ref.componentInstance.secondaryAction.subscribe((emittedValue) => {
          // tslint:disable-next-line:triple-equals
          this.saveAndProceed(form);
        });
      } else {
        ref.componentInstance.ButtonTitle = this.translator.TRY_AGAIN;
        return false;
      }
    } else {
      this.saveAndProceed(form);
    }
  }

  saveAndProceed(form: any) {
    const invCommonFormValues = this.investmentCommonService.getInvestmentCommonFormData();
    this.investmentEngagementJourneyService.setYourFinancial(form.value);
    this.investmentEngagementJourneyService.savePersonalInfo(invCommonFormValues).subscribe((data) => {
      if (data) {
        this.authService.saveEnquiryId(data.objectList.enquiryId);
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP2]);
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  goBack(form) {
    this.investmentEngagementJourneyService.setYourFinancial(form.value);
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
  }

  isLoggedInUser() {
    return this.authService.isSignedUser();
  }

  getFinancialDetails() {
    this.loaderService.showLoader({
      title: this.loaderTitle,
      desc: this.loaderDesc
    });
    this.investmentEngagementJourneyService.getUserFinancialDetails().subscribe((data) => {
      this.loaderService.hideLoader();
      if (data.responseMessage.responseCode >= 6000) {
        this.investmentEngagementJourneyService.setFinancialDetails(data.objectList);
        this.setControlValues(data.objectList);
      }
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  isFirstTimeUser() {
    if (typeof this.financialFormValue.firstTimeUser === 'undefined') {
      this.financialFormValue.firstTimeUser = true;
      return true;
    }
    return false;
  }

  setControlValues(financialDetails) {
    if (financialDetails) {
    this.myFinancialForm.controls.monthlyIncome.setValue(financialDetails.monthlyIncome);
    this.myFinancialForm.controls.percentageOfSaving.setValue(financialDetails.incomePercentageSaved);
    this.myFinancialForm.controls.totalAssets.setValue(financialDetails.totalAssets);
    this.myFinancialForm.controls.totalLiabilities.setValue(financialDetails.totalLoans);
    }
  }
}
