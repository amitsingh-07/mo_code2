import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IRegularSavings } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { ConfigService } from './../../config/config.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';

@Component({
  selector: 'app-regular-saving-plan',
  templateUrl: './regular-saving-plan.component.html',
  styleUrls: ['./regular-saving-plan.component.scss']
})
export class RegularSavingPlanComponent implements OnInit, OnDestroy {

  pageTitle: string;
  RSPForm: FormGroup;
  investmentList: any;
  pageId: string;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  RSPSelection = false;
  regularSavingsArray: IRegularSavings[];
  submitted = false;
  validationFlag: boolean;
  hasRegularSavings: boolean;
  enquiryId: number;
  viewMode: boolean;
  comprehensiveJourneyMode: boolean;
  fundTypeList: any;
  fundTypeLite: any;
  errorMessageLite: any;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder,
    private configService: ConfigService, private comprehensiveService: ComprehensiveService,
    private progressService: ProgressTrackerService, private comprehensiveApiService: ComprehensiveApiService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.investmentList = this.translate.instant('CMP.INVESTMENT_TYPE_LIST');
        this.fundTypeList = this.translate.instant('CMP.FUND_TYPE_LIST');  
        this.fundTypeLite = this.translate.instant('CMP.RSP.FUND_TYPE_LITE');
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
        this.setPageTitle(this.pageTitle);
        this.validationFlag = this.translate.instant('CMP.RSP.OPTIONAL_VALIDATION_FLAG');
        this.errorMessageLite = this.translate.instant('CMP.RSP.LITE_RSP_ERROR');
      });
    });
    this.comprehensiveJourneyMode = this.comprehensiveService.getComprehensiveVersion();
    this.enquiryId = this.comprehensiveService.getEnquiryId();
    this.viewMode = this.comprehensiveService.getViewableMode();

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  @HostListener('input', ['$event'])
  onChange() {
    this.rspSelection();
  }
  rspSelection() {
    this.RSPForm.valueChanges.subscribe((form: any) => {
      this.hasRegularSavings = form.hasRegularSavings;
    });
  }
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

    this.regularSavingsArray = this.comprehensiveService.getRegularSavingsList();
    this.hasRegularSavings = this.comprehensiveService.hasRegularSavings();
    if (this.regularSavingsArray !=null && this.regularSavingsArray.length > 0 && this.hasRegularSavings === null 
      && this.comprehensiveService.getReportStatus() === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
      this.hasRegularSavings = true;
    }
    this.buildRSPForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.navbarService.unsubscribeMenuItemClick();
  }

  buildRSPForm() {
    const regularSavings = [];

    if (this.regularSavingsArray !=null && this.regularSavingsArray.length > 0) {

      this.regularSavingsArray.forEach((regularSavePlan: any) => {
        regularSavings.push(this.buildRSPDetailsForm(regularSavePlan));
      });

    } else {
      regularSavings.push(this.buildEmptyRSPForm());
    }
    this.RSPForm = this.formBuilder.group({
      hasRegularSavings: [this.hasRegularSavings, Validators.required],
      comprehensiveRegularSavingsList: this.formBuilder.array(regularSavings),
    });
  }
  buildRSPDetailsForm(value) {
    const fundTypeValue = (!this.comprehensiveJourneyMode)?this.fundTypeLite:value.fundType;
    return this.formBuilder.group({
      portfolioType: [value.portfolioType],
      fundType: [fundTypeValue],
      amount: [value.amount],
      enquiryId: this.enquiryId

    });
  }
  buildEmptyRSPForm() {
    const fundTypeValue = (!this.comprehensiveJourneyMode)?this.fundTypeLite:'';
    return this.formBuilder.group({
      portfolioType: [''],
      fundType: [fundTypeValue],
      amount: [''],
      enquiryId: this.enquiryId

    });
  }
  addRSP() {
    const RSPDetails = this.RSPForm.get('comprehensiveRegularSavingsList') as FormArray;
    RSPDetails.push(this.buildEmptyRSPForm());
  }
  removeRSP(i) {
    const RSPDetails = this.RSPForm.get('comprehensiveRegularSavingsList') as FormArray;
    RSPDetails.removeAt(i);
    this.RSPForm.get('comprehensiveRegularSavingsList').markAsDirty();
  }
  selectInvest(status, i) {
    const investment = status ? status : '';
    this.RSPForm.controls['comprehensiveRegularSavingsList']['controls'][i].controls.portfolioType.setValue(investment);
    this.RSPForm.get('comprehensiveRegularSavingsList').markAsDirty();
  }  
  selectFundType(status, i) {
    const investment = status ? status : '';
    this.RSPForm.controls['comprehensiveRegularSavingsList']['controls'][i].controls.fundType.setValue(investment);
    this.RSPForm.get('comprehensiveRegularSavingsList').markAsDirty();
  }
  goToNext(form) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND]);
    } else {
        if (this.validateRegularSavings(form)) {
          if (!form.pristine || this.comprehensiveService.getReportStatus() === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
            if(!form.value.hasRegularSavings) {
              form.value.comprehensiveRegularSavingsList = [{
                portfolioType: '',
                fundType: '',
                amount: '',
                enquiryId: this.enquiryId          
              }];
            }
            this.comprehensiveApiService.saveRegularSavings(form.value).subscribe((data: any) => {
            this.comprehensiveService.setRegularSavings(form.value.hasRegularSavings);
            this.comprehensiveService.setRegularSavingsList(form.value.comprehensiveRegularSavingsList);
            if (!this.comprehensiveService.hasBadMoodFund() && this.comprehensiveService.getDownOnLuck().badMoodMonthlyAmount) {
              this.comprehensiveService.saveBadMoodFund();
            }
            if (this.comprehensiveService.getMySteps() === 1
            && this.comprehensiveService.getMySubSteps() < 3) {
              this.comprehensiveService.setStepCompletion(1, 3).subscribe((data1: any) => {
                this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND]);
              });
            } else {
              this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND]);
            }
          });
        } else {
          this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND]);
        }
      }
    }
  }

  validateRegularSavings(form: FormGroup) {

    this.submitted = true;
    if (this.comprehensiveService.getReportStatus() === COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
      this.RSPForm.markAsDirty();
    }
    this.investTypeValidation();
    if (form.value.hasRegularSavings) {
      if (!form.valid) {
        Object.keys(form.controls).forEach((key) => {
  
          form.get(key).markAsDirty();
        });
        const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.REGULAR_SAVINGS);
        if(error.errorMessages && !this.comprehensiveJourneyMode){
          error.errorMessages = [this.errorMessageLite];
        }
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.REGULAR_SAVINGS'));
        return false;
      } else {
        this.submitted = false;
        return true;
      }
    } else {
      this.submitted = false;
    }
    return true;
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.RSP.TOOLTIP.' + toolTipTitle),
      DESCRIPTION: this.translate.instant('CMP.RSP.TOOLTIP.' + toolTipMessage)
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
  investTypeValidation() {
    if (this.RSPForm.controls['comprehensiveRegularSavingsList']['controls'].length > 0) {
      this.RSPForm.controls['comprehensiveRegularSavingsList']['controls'].forEach((otherInvest, i) => {
        const otherInvestmentControl = this.RSPForm.controls['comprehensiveRegularSavingsList']['controls'][i].controls;
        if (otherInvestmentControl['amount'].value > 0 ) {
          otherInvestmentControl['portfolioType'].setValidators([Validators.required]);
          otherInvestmentControl['portfolioType'].updateValueAndValidity();
          otherInvestmentControl['fundType'].setValidators([Validators.required]);
          otherInvestmentControl['fundType'].updateValueAndValidity();
        } else {
          otherInvestmentControl['portfolioType'].setValidators([]);
          otherInvestmentControl['portfolioType'].updateValueAndValidity();
          otherInvestmentControl['fundType'].setValidators([]);
          otherInvestmentControl['fundType'].updateValueAndValidity();
        }
      });
      this.RSPForm.markAsDirty();
    }
  }

}
