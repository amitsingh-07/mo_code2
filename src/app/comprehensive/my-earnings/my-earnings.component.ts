import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMyEarnings } from '../comprehensive-types';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss']
})
export class MyEarningsComponent implements OnInit, OnDestroy {
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
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
      this.employmentTypeList = this.translate.instant('CMP.MY_EARNINGS.EMPLOYMENT_TYPE_LIST');
      this.setPageTitle(this.pageTitle);
    });
    this.earningDetails = this.comprehensiveService.getMyEarnings();
    if (this.earningDetails.employmentType) {
      this.employmentType = this.earningDetails.employmentType;
    }

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

  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  SelectEarningsType(earningsType, earningFlag) {
    this[earningsType] = earningFlag;
    const otherEarningsControl = this.myEarningsForm.controls[this.incomeDetailsDyn[earningsType]];
    if (!earningFlag) {
      otherEarningsControl.setValue(0);
      otherEarningsControl.setValidators([]);
      otherEarningsControl.updateValueAndValidity();
    } else {
      otherEarningsControl.setValidators([ Validators.required, Validators.pattern('^0*[1-9]\\d*$')]);
      otherEarningsControl.updateValueAndValidity();
    }
    this.onTotalAnnualIncomeBucket();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  buildMyEarningsForm() {
    this.myEarningsForm = this.formBuilder.group({
      employmentType: [this.earningDetails ? this.earningDetails.employmentType : '', []],
      monthlySalary: [this.earningDetails ? this.earningDetails.monthlySalary : '', []],
      monthlyRentalIncome: [this.earningDetails ? this.earningDetails.monthlyRentalIncome : ''],
      otherMonthlyWorkIncome: [this.earningDetails ? this.earningDetails.otherMonthlyWorkIncome : ''],
      otherMonthlyIncome: [this.earningDetails ? this.earningDetails.otherMonthlyIncome : ''],
      annualBonus: [this.earningDetails ? this.earningDetails.annualBonus : '', []],
      annualDividends: [this.earningDetails ? this.earningDetails.annualDividends : ''],
      otherAnnualIncome: [this.earningDetails ? this.earningDetails.otherAnnualIncome : '']
    });
  }
  selectEmploymentType(employmentType) {
    employmentType = employmentType ? employmentType : { text: '', value: '' };
    this.employmentType = employmentType.text;
    this.myEarningsForm.controls['employmentType'].setValue(employmentType.text);
    this.myEarningsForm.markAsDirty();
  }
  goToNext(form: FormGroup) {
    if (this.validateEarnings(form)) {
      this.earningDetails = form.value;
      this.earningDetails.totalAnnualIncomeBucket = this.totalAnnualIncomeBucket;
      this.comprehensiveService.setMyEarnings(form.value);
      this.comprehensiveApiService.saveEarnings(form.value).subscribe((data) => {
      });
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS]);
    }
  }
  validateEarnings(form: FormGroup) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_EARNINGS);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_EARNINGS'));
      return false;
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
    const inputParams = ['monthlySalary', 'monthlyRentalIncome', 'otherMonthlyWorkIncome', 'otherMonthlyIncome'];
    this.totalAnnualIncomeBucket = this.comprehensiveService.additionOfCurrency(this.myEarningsForm.value, inputParams);
    const bucketParams = ['monthlySalary', 'annualBonus'];
    const earningInput = this.myEarningsForm.value;
    this.bucketImage = this.comprehensiveService.setBucketImage(bucketParams, earningInput);
  }
}
