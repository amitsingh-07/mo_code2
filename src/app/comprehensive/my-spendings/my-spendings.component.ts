import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyEarnings, IMySpendings } from '../comprehensive-types';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-my-spendings',
  templateUrl: './my-spendings.component.html',
  styleUrls: ['./my-spendings.component.scss']
})
export class MySpendingsComponent implements OnInit, OnDestroy {
  pageTitle: string;
  mySpendingsForm: FormGroup;
  submitted: boolean;
  spendingDetails: IMySpendings;
  earningDetails: IMyEarnings;
  otherMortage = true;
  validateFlag = true;
  totalSpending = 0;
  calculatedSpending = 0;
  totalBucket = 0;
  spendDesc: string;
  spendTitle: string;
  menuClickSubscription: Subscription;
  pageId: string;
  bucketImage: string;
  validationFlag: boolean;
  mortageFieldSet = ['mortgagePaymentUsingCPF', 'mortgagePaymentUsingCash', 'mortgageTypeOfHome', 'mortgagePayOffUntil'];
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService, private loaderService: LoaderService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
        this.spendDesc = this.translate.instant('CMP.MY_SPENDINGS.SPEND_DESC');
        this.spendTitle = this.translate.instant('CMP.MY_SPENDINGS.SPEND_TITLE');
        this.setPageTitle(this.pageTitle);
        this.validationFlag = this.translate.instant('CMP.MY_SPENDINGS.OPTIONAL_VALIDATION_FLAG');
      });
    });
    this.spendingDetails = this.comprehensiveService.getMySpendings();
  }
  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    this.buildMySpendingForm();
    if (this.spendingDetails) {
      for (const value of this.mortageFieldSet) {
        if (this.spendingDetails[value] !== null && this.spendingDetails[value] !== '' &&
          (this.spendingDetails[value] > 0 || (value === 'mortgageTypeOfHome' &&
            this.spendingDetails[value] !== undefined))) {
          this.validateFlag = false;
        }
      }
      if (!this.validateFlag) {
        this.addOtherMortage();
      }
    }
    this.earningDetails = this.comprehensiveService.getMyEarnings();
    if (this.earningDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_EARNINGS.API_TOTAL_BUCKET_KEY]) {
      this.totalBucket = this.earningDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_EARNINGS.API_TOTAL_BUCKET_KEY];
    }

    this.onTotalAnnualSpendings();
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  addOtherMortage() {
    for (const value of this.mortageFieldSet) {
      const otherPropertyControl = this.mySpendingsForm.controls[value];
      if (this.otherMortage) {
        if (value === 'mortgagePayOffUntil' && this.validationFlag === true) {
          otherPropertyControl.setValidators([Validators.required, this.payOffYearValid]);
          otherPropertyControl.updateValueAndValidity();
        } else if (value === 'mortgageTypeOfHome' && this.validationFlag === true) {
          otherPropertyControl.setValidators([Validators.required]);
          otherPropertyControl.updateValueAndValidity();
        } else if (this.validationFlag === true) {
          otherPropertyControl.setValidators([Validators.required, Validators.pattern('^0*[1-9]\\d*$')]);
          otherPropertyControl.updateValueAndValidity();
        }
      } else {
        otherPropertyControl.setValue('');
        if (this.validationFlag === true) {
          otherPropertyControl.setValidators([]);
        }
        otherPropertyControl.updateValueAndValidity();
      }
    }
    this.otherMortage = !this.otherMortage;
  }
  buildMySpendingForm() {
    this.mySpendingsForm = this.formBuilder.group({
      monthlyLivingExpenses: [this.spendingDetails ? this.spendingDetails.monthlyLivingExpenses : '', []],
      adHocExpenses: [this.spendingDetails ? this.spendingDetails.adHocExpenses : '', []],
      HLMortgagePaymentUsingCPF: [this.spendingDetails ? this.spendingDetails.HLMortgagePaymentUsingCPF : '', []],
      HLMortgagePaymentUsingCash: [this.spendingDetails ? this.spendingDetails.HLMortgagePaymentUsingCash : '', []],
      HLtypeOfHome: [this.spendingDetails ? this.spendingDetails.HLtypeOfHome : '', []],
      homeLoanPayOffUntil: [this.spendingDetails ? this.spendingDetails.homeLoanPayOffUntil : '',
      [this.payOffYearValid]],
      mortgagePaymentUsingCPF: [this.spendingDetails ? this.spendingDetails.mortgagePaymentUsingCPF : ''],
      mortgagePaymentUsingCash: [this.spendingDetails ? this.spendingDetails.mortgagePaymentUsingCash : ''],
      mortgageTypeOfHome: [this.spendingDetails ? this.spendingDetails.mortgageTypeOfHome : ''],
      mortgagePayOffUntil: [this.spendingDetails ? this.spendingDetails.mortgagePayOffUntil : '', [this.payOffYearValid]],
      carLoanPayment: [this.spendingDetails ? this.spendingDetails.carLoanPayment : '', []],
      otherLoanPayment: [this.spendingDetails ? this.spendingDetails.otherLoanPayment : '', []],
      otherLoanPayoffUntil: [this.spendingDetails ? this.spendingDetails.otherLoanPayoffUntil : '',
      [this.payOffYearValid]]
    });
  }
  goToNext(form: FormGroup) {
    if (this.validateSpendings(form)) {
      if (!form.pristine) {
        this.spendingDetails = form.value;
        this.spendingDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_SPENDING.API_TOTAL_BUCKET_KEY] = this.totalSpending;
        this.spendingDetails.enquiryId = this.comprehensiveService.getEnquiryId();
        this.comprehensiveService.setMySpendings(this.spendingDetails);
        this.loaderService.showLoader({ title: 'Saving' });
        this.comprehensiveApiService.saveExpenses(this.spendingDetails).subscribe((data) => {
          this.loaderService.hideLoader();
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN]);
        });
      } else {
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN]);
      }

    }
  }
  validateSpendings(form: FormGroup) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_SPENDINGS);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_SPENDINGS'));
      return false;
    } else {
      this.submitted = false;
    }
    return true;
  }
  get addSpendValid() { return this.mySpendingsForm.controls; }
  payOffYearValid(payOffYearVal) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let validCheck: boolean;
    if (payOffYearVal.value === null || payOffYearVal.value === '') {
      validCheck = true;
    } else {
      validCheck = (payOffYearVal.value >= currentYear) ? true : false;
    }
    if (validCheck) {
      return null;
    }
    return { pattern: true };
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.MY_SPENDINGS.TOOLTIP.' + toolTipTitle),
      DESCRIPTION: this.translate.instant('CMP.MY_SPENDINGS.TOOLTIP.' + toolTipMessage)
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.onTotalAnnualSpendings();
  }

  onTotalAnnualSpendings() {
    const inputParams = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_SPENDING.MONTHLY_INPUT_CALC;
    const spendingValues = this.mySpendingsForm.value;
    const spendingFormObject = {
      monthlyLivingExpenses: spendingValues.monthlyLivingExpenses,
      adHocExpenses: spendingValues.adHocExpenses, HLMortgagePaymentUsingCPF: spendingValues.HLMortgagePaymentUsingCPF,
      HLMortgagePaymentUsingCash: spendingValues.HLMortgagePaymentUsingCash, mortgagePaymentUsingCPF:
        spendingValues.mortgagePaymentUsingCPF, mortgagePaymentUsingCash:
        spendingValues.mortgagePaymentUsingCash, carLoanPayment: spendingValues.carLoanPayment,
      otherLoanPayment: spendingValues.otherLoanPayment
    };
    this.totalSpending = this.comprehensiveService.additionOfCurrency(spendingFormObject, inputParams);
    this.calculatedSpending = this.totalBucket - this.totalSpending;
    if (this.totalSpending === 0 && this.totalBucket > 0) {
      this.bucketImage = 'filledSpend';
    } else if (this.totalSpending > 0 && this.calculatedSpending > 0) {
      this.bucketImage = 'middleSpend';
    } else {
      this.bucketImage = 'emptySpend';
    }
  }
}
