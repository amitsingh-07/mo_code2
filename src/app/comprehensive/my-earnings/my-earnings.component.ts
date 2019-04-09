import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyEarnings } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Util } from './../../shared/utils/util';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss']
})
export class MyEarningsComponent implements OnInit, AfterViewInit, OnDestroy {
  pageTitle: string;
  myEarningsForm: FormGroup;
  submitted: boolean;
  employmentType = '';
  employmentTypeList: any;
  monthlyRentIncome = false;
  otherMonthlyWorkIncomeType = false;
  otherMonthlyIncomeType = false;
  annualDividendsType = false;
  otherAnnualIncomeType = false;
  totalAnnualIncomeBucket = 0;
  bucketImage: string;
  menuClickSubscription: Subscription;
  earningDetails: IMyEarnings;
  pageId: string;
  incomeDetailsDyn = {
    monthlyRentIncome: 'monthlyRentalIncome',
    otherMonthlyWorkIncomeType: 'otherMonthlyWorkIncome',
    otherMonthlyIncomeType: 'otherMonthlyIncome',
    annualDividendsType: 'annualDividends',
    otherAnnualIncomeType: 'otherAnnualIncome'
  };
  validationFlag: boolean;
  viewMode: boolean;
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
        this.employmentTypeList = this.translate.instant('CMP.MY_EARNINGS.EMPLOYMENT_TYPE_LIST');
        this.setPageTitle(this.pageTitle);
        this.validationFlag = this.translate.instant('CMP.MY_EARNINGS.OPTIONAL_VALIDATION_FLAG');
      });
    });
    this.earningDetails = this.comprehensiveService.getMyEarnings();
    if (this.earningDetails && this.earningDetails.employmentType) {
      this.employmentType = this.earningDetails.employmentType;
    } else {
      this.employmentType = 'Employed';
    }
    this.viewMode = this.comprehensiveService.getViewableMode();
  }
  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    this.buildMyEarningsForm();
    this.onTotalAnnualIncomeBucket();
    for (const i in this.incomeDetailsDyn) {
      if (this.earningDetails[this.incomeDetailsDyn[i]] !== null
        && this.earningDetails[this.incomeDetailsDyn[i]] !== '' &&
        this.earningDetails[this.incomeDetailsDyn[i]] > 0) {
        this.SelectEarningsType(i, true);
      }
    }
  }
  ngAfterViewInit() {
     if (this.viewMode) {
       //this.comprehensiveService.getFormDisabled(this.myEarningsForm);
     }
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  SelectEarningsType(earningsType, earningFlag) {
    this[earningsType] = earningFlag;
    const otherEarningsControl = this.myEarningsForm.controls[this.incomeDetailsDyn[earningsType]];
    if (!this.viewMode) {
      if (!earningFlag) {
        otherEarningsControl.markAsDirty();
        otherEarningsControl.setValue(0);
        otherEarningsControl.setValidators([]);
        otherEarningsControl.updateValueAndValidity();
      } else {
        otherEarningsControl.setValidators([ Validators.required, Validators.pattern('^0*[1-9]\\d*$')]);
        otherEarningsControl.updateValueAndValidity();
      }
    }
    this.onTotalAnnualIncomeBucket();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  buildMyEarningsForm() {
    this.myEarningsForm = this.formBuilder.group({
      employmentType: [{value: (this.employmentType) ? this.employmentType : '', disabled: this.viewMode}, []],
      monthlySalary: [{value: this.earningDetails ? this.earningDetails.monthlySalary : '', disabled: this.viewMode}, []],
      monthlyRentalIncome: [{value: this.earningDetails ? this.earningDetails.monthlyRentalIncome : '', disabled: this.viewMode}],
      otherMonthlyWorkIncome: [{value: this.earningDetails ? this.earningDetails.otherMonthlyWorkIncome : '', disabled: this.viewMode}],
      otherMonthlyIncome: [{value: this.earningDetails ? this.earningDetails.otherMonthlyIncome : '', disabled: this.viewMode}],
      annualBonus: [{value: this.earningDetails ? this.earningDetails.annualBonus : '', disabled: this.viewMode}, []],
      annualDividends: [{value: this.earningDetails ? this.earningDetails.annualDividends : '', disabled: this.viewMode}],
      otherAnnualIncome: [{value: this.earningDetails ? this.earningDetails.otherAnnualIncome : '', disabled: this.viewMode}]
    });
  }
  selectEmploymentType(employmentType) {
    employmentType = employmentType ? employmentType : { text: '', value: '' };
    this.employmentType = employmentType.text;
    this.myEarningsForm.controls['employmentType'].setValue(employmentType.text);
    if (!this.viewMode) {
      this.myEarningsForm.markAsDirty();
    }
  }
  goToNext(form: FormGroup) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS]);
    } else {
      if (this.validateEarnings(form)) {
        const earningsData = this.comprehensiveService.getComprehensiveSummary().comprehensiveIncome;
        if (!form.pristine || Util.isEmptyOrNull(earningsData)) {
          this.earningDetails = form.value;
          this.earningDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_EARNINGS.API_TOTAL_BUCKET_KEY] = this.totalAnnualIncomeBucket;
          this.earningDetails.enquiryId = this.comprehensiveService.getEnquiryId();
          this.comprehensiveService.setMyEarnings(this.earningDetails);
          this.loaderService.showLoader({ title: 'Saving' });
          this.comprehensiveApiService.saveEarnings(this.earningDetails).subscribe((data) => {
            this.loaderService.hideLoader();
            this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS]);
          });
        } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS]);
        }
      }
    }
  }
  validateEarnings(form: FormGroup) {
    this.submitted = true;
    if (this.validationFlag === true && !form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_EARNINGS);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_EARNINGS'));
      return false;
    } else {
      this.submitted = false;
    }
    return true;
  }
  get addEarnValid() { return this.myEarningsForm.controls; }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.MY_EARNINGS.TOOLTIP.' + toolTipTitle),
      DESCRIPTION: this.translate.instant('CMP.MY_EARNINGS.TOOLTIP.' + toolTipMessage)
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.onTotalAnnualIncomeBucket();
  }

  onTotalAnnualIncomeBucket() {
    const inputParams = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_EARNINGS.MONTHLY_INPUT_CALC;
    this.totalAnnualIncomeBucket = this.comprehensiveService.additionOfCurrency(this.myEarningsForm.value, inputParams);
    const bucketParams = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_EARNINGS.BUCKET_INPUT_CALC;
    const earningInput = this.myEarningsForm.value;
    this.bucketImage = this.comprehensiveService.setBucketImage(bucketParams, earningInput, this.totalAnnualIncomeBucket);
  }
}
