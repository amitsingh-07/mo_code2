import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyEarnings, IMySpendings } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Util } from './../../shared/utils/util';
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
  subscription: Subscription;
  pageId: string;
  bucketImage: string;
  validationFlag: boolean;
  mortageFieldSet = ['mortgagePaymentUsingCPF', 'mortgagePaymentUsingCash', 'mortgageTypeOfHome', 'mortgagePayOffUntil'];
  payOffFieldSet = ['HLMortgagePaymentUsingCPF', 'mortgagePaymentUsingCPF', 'carLoanPayment', 'otherLoanPayment']
  viewMode: boolean;
  homeTypeList: any[];
  mortgageTypeOfHome = '';
  HLTypeOfHome = '';
  comprehensiveJourneyMode: boolean;
  saveData: string;
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
        this.homeTypeList = this.translate.instant('CMP.HOME_TYPE_LIST');
        this.setPageTitle(this.pageTitle);
        this.validationFlag = this.translate.instant('CMP.MY_SPENDINGS.OPTIONAL_VALIDATION_FLAG');
        this.saveData = this.translate.instant('COMMON_LOADER.SAVE_DATA');
      });
    });
    this.spendingDetails = this.comprehensiveService.getMySpendings();
    this.mortgageTypeOfHome = this.spendingDetails.mortgageTypeOfHome ? this.spendingDetails.mortgageTypeOfHome : '';
    this.HLTypeOfHome = this.spendingDetails.HLtypeOfHome ? this.spendingDetails.HLtypeOfHome : '';
    this.viewMode = this.comprehensiveService.getViewableMode();
    this.comprehensiveJourneyMode = this.comprehensiveService.getComprehensiveVersion();
    if (!this.comprehensiveJourneyMode && this.spendingDetails) {
      this.spendingDetails.HLtypeOfHome = '';
      this.spendingDetails.mortgagePaymentUsingCPF = 0;
      this.spendingDetails.mortgagePaymentUsingCash = 0;
      this.spendingDetails.mortgageTypeOfHome = '';
      this.spendingDetails.mortgagePayOffUntil = null;
      this.spendingDetails.carLoanPayment = 0;
      this.spendingDetails.carLoanPayoffUntil = null;
      this.spendingDetails.otherLoanPayoffUntil = null;
    }
  }
  // tslint:disable-next-line:cognitive-complexity
  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });

    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        const previousUrl = this.comprehensiveService.getPreviousUrl(this.router.url);
        if (previousUrl !== null) {
          this.router.navigate([previousUrl]);
        } else {
          this.navbarService.goBack();
        }
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
    this.validatePayoff();
    this.earningDetails = this.comprehensiveService.getMyEarnings();
    if (this.earningDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_EARNINGS.API_TOTAL_BUCKET_KEY]) {
      this.totalBucket = this.earningDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_EARNINGS.API_TOTAL_BUCKET_KEY];
    }

    this.onTotalAnnualSpendings();
  }
  selectHLHomeType(homeType: any) {

    this.HLTypeOfHome = homeType;
    this.mySpendingsForm.controls['HLtypeOfHome'].setValue(homeType);
    this.mySpendingsForm.markAsDirty();
  }
  selectMortgageHomeType(homeType: any) {

    this.mortgageTypeOfHome = homeType;
    this.mySpendingsForm.controls['mortgageTypeOfHome'].setValue(homeType);
    this.mySpendingsForm.markAsDirty();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
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
        otherPropertyControl.markAsDirty();
        otherPropertyControl.setValue('');
        if (this.validationFlag === true) {
          otherPropertyControl.setValidators([]);
        }
        otherPropertyControl.updateValueAndValidity();
      }
    }
    this.otherMortage = !this.otherMortage;
  }
  validatePayoff() {
    for (const value of this.payOffFieldSet) {
      switch (value) {
        case 'HLMortgagePaymentUsingCPF':
          const HLMortgagePaymentUsingCPF = parseInt(this.mySpendingsForm.controls['HLMortgagePaymentUsingCPF'].value !=null || this.mySpendingsForm.controls['HLMortgagePaymentUsingCPF'].value !='' ?  this.mySpendingsForm.controls['HLMortgagePaymentUsingCPF'].value:0);
          const HLMortgagePaymentUsingCash = parseInt(this.mySpendingsForm.controls['HLMortgagePaymentUsingCash'].value !=null || this.mySpendingsForm.controls['HLMortgagePaymentUsingCash'].value !='' ?  this.mySpendingsForm.controls['HLMortgagePaymentUsingCash'].value:0);
          const HLMortgagePayoffUntil =  this.mySpendingsForm.controls['homeLoanPayOffUntil'];
          if ((HLMortgagePaymentUsingCPF + HLMortgagePaymentUsingCash) > 0) {
            HLMortgagePayoffUntil.setValidators([Validators.required, this.payOffYearValid]);
            HLMortgagePayoffUntil.updateValueAndValidity();
          } else {
            HLMortgagePayoffUntil.clearValidators();
            HLMortgagePayoffUntil.setValidators([this.payOffYearValid]);
            HLMortgagePayoffUntil.updateValueAndValidity();
          }
        break;
        case 'mortgagePaymentUsingCPF':
          const mortgagePaymentUsingCPF = parseInt(this.mySpendingsForm.controls['mortgagePaymentUsingCPF'].value !=null || this.mySpendingsForm.controls['mortgagePaymentUsingCPF'].value !=''?  this.mySpendingsForm.controls['mortgagePaymentUsingCPF'].value:0);
          const mortgagePaymentUsingCash = parseInt(this.mySpendingsForm.controls['mortgagePaymentUsingCash'].value !=null || this.mySpendingsForm.controls['mortgagePaymentUsingCash'].value !=''?  this.mySpendingsForm.controls['mortgagePaymentUsingCash'].value:0);
          const mortgagePayOffUntil =  this.mySpendingsForm.controls['mortgagePayOffUntil'];
          if ((mortgagePaymentUsingCPF + mortgagePaymentUsingCash)> 0) {
            mortgagePayOffUntil.setValidators([Validators.required, this.payOffYearValid]);
            mortgagePayOffUntil.updateValueAndValidity();
          } else {
            mortgagePayOffUntil.clearValidators();
            mortgagePayOffUntil.setValidators([this.payOffYearValid]);
            mortgagePayOffUntil.updateValueAndValidity();
          }
        break;
        case 'carLoanPayment':
          const carLoanPayment = parseInt(this.mySpendingsForm.controls['carLoanPayment'].value);
          const carLoanPayoffUntil =  this.mySpendingsForm.controls['carLoanPayoffUntil'];
          if (carLoanPayment > 0) {
            carLoanPayoffUntil.setValidators([Validators.required, this.payOffYearValid]);
            carLoanPayoffUntil.updateValueAndValidity();
          } else {
            carLoanPayoffUntil.clearValidators();
            carLoanPayoffUntil.setValidators([this.payOffYearValid]);
            carLoanPayoffUntil.updateValueAndValidity();
          }
          break;
        case 'otherLoanPayment':
          const otherLoanPayment = parseInt(this.mySpendingsForm.controls['otherLoanPayment'].value);
          const otherLoanPayoffUntil =  this.mySpendingsForm.controls['otherLoanPayoffUntil'];
          if (otherLoanPayment > 0) {
            otherLoanPayoffUntil.setValidators([Validators.required, this.payOffYearValid]);
            otherLoanPayoffUntil.updateValueAndValidity();
          } else {
            otherLoanPayoffUntil.clearValidators();
            otherLoanPayoffUntil.setValidators([this.payOffYearValid]);
            otherLoanPayoffUntil.updateValueAndValidity();
          }
          break;

      }

    }

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
      carLoanPayoffUntil: [this.spendingDetails ? this.spendingDetails.carLoanPayoffUntil : '', [this.payOffYearValid]],
      otherLoanPayment: [this.spendingDetails ? this.spendingDetails.otherLoanPayment : '', []],
      otherLoanPayoffUntil: [this.spendingDetails ? this.spendingDetails.otherLoanPayoffUntil : '',
      [this.payOffYearValid]]
    });
  }
  goToNext(form: FormGroup) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN]);
    } else {
      if (this.validateSpendings(form)) {
        const spendingsData = this.comprehensiveService.getComprehensiveSummary().comprehensiveSpending;
        if (!form.pristine || Util.isEmptyOrNull(spendingsData)) {
          this.spendingDetails = form.value;
          this.spendingDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_SPENDING.API_TOTAL_BUCKET_KEY] = this.totalSpending;
          this.spendingDetails.enquiryId = this.comprehensiveService.getEnquiryId();
          this.loaderService.showLoader({ title: this.saveData });
          this.comprehensiveApiService.saveExpenses(this.spendingDetails).subscribe((data) => {
            this.comprehensiveService.setMySpendings(this.spendingDetails);
            if (!this.comprehensiveService.hasBadMoodFund() && this.comprehensiveService.getDownOnLuck().badMoodMonthlyAmount) {
              this.comprehensiveService.saveBadMoodFund();
            }
            if (this.comprehensiveService.getMySteps() === 1
              && this.comprehensiveService.getMySubSteps() < 2) {
              this.comprehensiveService.setStepCompletion(1, 2).subscribe((data1: any) => {
                this.loaderService.hideLoader();
                this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN]);
              });
            } else {
              this.loaderService.hideLoader();
              this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN]);
            }
          });
        } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN]);
        }
      }
    }
  }
  validateSpendings(form: FormGroup) {
    this.submitted = true;
    if (this.comprehensiveService.getReportStatus() === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
      this.mySpendingsForm.markAsDirty();
    }
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
    this.validatePayoff();
  }

  onTotalAnnualSpendings() {
    const inputParams = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_SPENDING.MONTHLY_INPUT_CALC;
    const spendingValues = this.mySpendingsForm.value;
    const spendingFormObject = {
      monthlyLivingExpenses: spendingValues.monthlyLivingExpenses,
      adHocExpenses: spendingValues.adHocExpenses,
      HLMortgagePaymentUsingCash: spendingValues.HLMortgagePaymentUsingCash, mortgagePaymentUsingCash:
        spendingValues.mortgagePaymentUsingCash, carLoanPayment: spendingValues.carLoanPayment,
      otherLoanPayment: spendingValues.otherLoanPayment
    };
    this.totalSpending = this.comprehensiveService.additionOfCurrency(spendingFormObject, inputParams);
    this.calculatedSpending = this.totalBucket - this.totalSpending;
    if (this.totalSpending <= 0 && this.totalBucket > 0) {
      this.bucketImage = 'filledSpend';
    } else if (this.totalSpending > 0 && this.calculatedSpending > 0) {
      this.bucketImage = 'middleSpend';
    } else {
      this.bucketImage = 'emptySpend';
    }
  }
}
