import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IChildEndowment, IMySummaryModal } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { AboutAge } from './../../shared/utils/about-age.util';
import { COMPREHENSIVE_CONST } from './../comprehensive-config.constants';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependant-education-list',
  templateUrl: './dependant-education-list.component.html',
  styleUrls: ['./dependant-education-list.component.scss']
})
export class DependantEducationListComponent implements OnInit {
  pageTitle: string;
  pageId: string;
  endowmentListForm: FormGroup;
  menuClickSubscription: Subscription;
  endowmentDetail: IChildEndowment[];
  endowmentArrayPlan: any;
  endowmentPlan: any = [];
  endowmentSkipEnable = true;
  summaryModalDetails: IMySummaryModal;
  submitted: boolean;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private progressService: ProgressTrackerService,
    private configService: ConfigService, private comprehensiveService: ComprehensiveService, private aboutAge: AboutAge,
    private comprehensiveApiService: ComprehensiveApiService) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title

        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });

  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });
    this.endowmentDetail = this.comprehensiveService.getChildEndowment();
    this.endowmentArrayPlan = this.endowmentDetail;
    this.buildEndowmentListForm();
    let endowmentSkipEnableFlag = true;
    this.endowmentArrayPlan.forEach((dependant: any) => {
      if (dependant.endowmentMaturityAmount !== '') {
        endowmentSkipEnableFlag = false;
      }
    });
    this.endowmentSkipEnable = endowmentSkipEnableFlag;

  }
  buildEndowmentListForm() {
    const endowmentArray = [];
    this.endowmentArrayPlan.forEach((endowmentPlan: any) => {
      endowmentArray.push(this.buildEndowmentDetailsForm(endowmentPlan));
    });
    this.endowmentListForm = this.formBuilder.group({
      endowmentPlan: this.formBuilder.array(endowmentArray),

    });

  }
  buildEndowmentDetailsForm(value): FormGroup {

    return this.formBuilder.group({
      name: [value.name, []],
      age: [value.age, []],
      endowmentMaturityAmount: [value.endowmentMaturityAmount, []],
      endowmentMaturityYears: [value.endowmentMaturityYears, []],
      endowmentPlanShow: [value.endowmentMaturityAmount === 0.0
        ? false : true, []],
      gender: [value.gender, []]
    });

  }
  goToNext(form) {
    const dependantArray = [];
    if (this.endowmentSkipEnable) {
      form.value.endowmentPlan.forEach((preferenceDetails: any, index) => {

        if (preferenceDetails.endowmentPlanShow === false) {
          this.endowmentArrayPlan[index].endowmentMaturityAmount = 0.0;
          this.endowmentArrayPlan[index].endowmentMaturityYears = '';
        }
      });
      const childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
      this.summaryModalDetails = {
        setTemplateModal: 1, dependantModelSel: false,
        contentObj: childrenEducationNonDependantModal,
        nonDependantDetails: {
          livingCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.EXPENSE,
          livingPercent: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.PERCENT,
          livingEstimatedCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.COMPUTED_EXPENSE,
          medicalBill: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.EXPENSE,
          medicalYear: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.PERCENT,
          medicalCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.COMPUTED_EXPENSE
        },
        nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2'
      };
      this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
    } else {
      form.value.endowmentPlan.forEach((preferenceDetails: any, index) => {
        const otherPropertyControl = this.endowmentListForm.controls.endowmentPlan['controls'][index]['controls'];
        if (preferenceDetails.endowmentPlanShow) {
          otherPropertyControl['endowmentMaturityAmount'].setValidators([Validators.required, , Validators.pattern('^0*[1-9]\\d*$')]);
          otherPropertyControl['endowmentMaturityYears'].setValidators([Validators.required, this.payOffYearValid]);
          otherPropertyControl['endowmentMaturityAmount'].updateValueAndValidity();
          otherPropertyControl['endowmentMaturityYears'].updateValueAndValidity();
          this.endowmentArrayPlan[index].endowmentMaturityAmount = preferenceDetails.endowmentMaturityAmount;
          this.endowmentArrayPlan[index].endowmentMaturityYears = preferenceDetails.endowmentMaturityYears;
          dependantArray.push({
            userName: preferenceDetails.name, userAge: preferenceDetails.age, userEstimatedCost: preferenceDetails.endowmentMaturityAmount
          });
        } else {
          otherPropertyControl['endowmentMaturityAmount'].setValidators([]);
          otherPropertyControl['endowmentMaturityYears'].setValidators([]);
          otherPropertyControl['endowmentMaturityAmount'].updateValueAndValidity();
          otherPropertyControl['endowmentMaturityYears'].updateValueAndValidity();
          this.endowmentArrayPlan[index].endowmentMaturityAmount = 0.0;
          this.endowmentArrayPlan[index].endowmentMaturityYears = '';
        }
      });
      if (this.validateDependantList(form)) {
        this.comprehensiveService.setChildEndowment(this.endowmentDetail);
        const educationPreferenceList = [];
        this.endowmentDetail.forEach((details: any) => {
          educationPreferenceList.push({
            dependentId: details.dependentId, id: details.id, location: details.location, educationCourse: details.educationCourse,
            endowmentMaturityAmount: details.endowmentMaturityAmount, endowmentMaturityYears: details.endowmentMaturityYears,
            enquiryId: details.enquiryId
          }
          );
        });
        console.log(educationPreferenceList);

        this.comprehensiveApiService.saveChildEndowment({
          hasEndowments: this.comprehensiveService.hasEndowment(), endowmentDetailsList:
            educationPreferenceList
        }).subscribe((data: any) => {
          console.log(data);

          const childrenEducationDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.DEPENDANTS');
          this.summaryModalDetails = {
            setTemplateModal: 1, dependantModelSel: true,
            contentObj: childrenEducationDependantModal, dependantDetails: dependantArray,
            nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2'
          };
          this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
        });
      }
    }
  }
  showToolTipModal() {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_TITLE'),
      DESCRIPTION: this.translate.instant('CMP.ENDOWMENT_PLAN.TOOLTIP_MESSAGE')
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);

  }

  @HostListener('input', ['$event'])
  onChange() {
    this.checkDependant();
  }

  checkDependant() {
    this.endowmentListForm.valueChanges.subscribe((form: any) => {
      let endowmentSkipEnableFlag = true;
      form.endowmentPlan.forEach((dependant: any, index) => {
        if (dependant.endowmentPlanShow) {
          endowmentSkipEnableFlag = false;
        }
      });
      this.endowmentSkipEnable = endowmentSkipEnableFlag;
    });
  }
  validateDependantList(form: FormGroup) {
    this.submitted = true;
    if (!form.valid) {
      const error = this.comprehensiveService.getMultipleFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_DEPENDANT_EDUCATION,
        this.endowmentArrayPlan);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, true,
      );
      return false;
    }
    return true;
  }

  payOffYearValid(payOffYearVal) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let validCheck: boolean;
    if (payOffYearVal.value === null || payOffYearVal.value === '') {
      validCheck = true;
    } else {
      validCheck = ( payOffYearVal.value >= currentYear ) ? true : false;
    }
    if (validCheck) {
        return null;
    }
    return { pattern: true };
  }
}
