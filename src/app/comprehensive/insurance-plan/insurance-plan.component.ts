import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { ConfigService } from '../../config/config.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IInsurancePlan } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { AboutAge } from './../../shared/utils/about-age.util';
import { COMPREHENSIVE_CONST } from './../comprehensive-config.constants';

@Component({
  selector: 'app-insurance-plan',
  templateUrl: './insurance-plan.component.html',
  styleUrls: ['./insurance-plan.component.scss']
})
export class InsurancePlanComponent implements OnInit {
  pageTitle: any;
  pageId: string;
  menuClickSubscription: Subscription;
  insurancePlanForm: FormGroup;
  insurancePlanFormValues: IInsurancePlan;
  longTermInsurance = true;
  haveHDB = false;
  submitted = false;
  insurancePlanningDependantModal: any;
  insurancePlanningNonDependantModal: any;
  summaryRouterFlag: boolean;
  routerEnabled =  false;

  constructor(private navbarService: NavbarService, private progressService: ProgressTrackerService,
              private translate: TranslateService,
              private formBuilder: FormBuilder, private configService: ConfigService, private router: Router,
              private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
              private age: AboutAge, private route: ActivatedRoute ) {
    this.routerEnabled = this.summaryRouterFlag = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.ROUTER_CONFIG.STEP3;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_3_TITLE');
        this.setPageTitle(this.pageTitle);
        this.insurancePlanningDependantModal = this.translate.instant('CMP.MODAL.INSURANCE_PLANNING_MODAL.DEPENDANTS');
        this.insurancePlanningNonDependantModal = this.translate.instant('CMP.MODAL.INSURANCE_PLANNING_MODAL.NO_DEPENDANTS');
        if (this.route.snapshot.paramMap.get('summary') === 'summary' && this.summaryRouterFlag === true) {
          this.routerEnabled =  !this.summaryRouterFlag;
          this.showSummaryModal();
        }
      });
      if (this.comprehensiveService.getMySpendings().HLtypeOfHome === 'HDB') {
        this.haveHDB = true;
      }
    });
    if (this.comprehensiveService.getMyProfile() &&
    this.age.calculateAge( this.comprehensiveService.getMyProfile().dateOfBirth, new Date()) > 41) {
      this.longTermInsurance = false;
    }
    this.comprehensiveApiService.getInsurancePlanning().subscribe((data: IInsurancePlan) => {
      this.insurancePlanFormValues = data;
      this.buildInsuranceForm();
    });
    // Above Service Will be deleted once API is Ready
    // this.insurancePlanFormValues = this.comprehensiveService.getInsurancePlanningList();
    this.buildInsuranceForm();
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
  }
  buildInsuranceForm() {
    this.insurancePlanForm = this.formBuilder.group({
      haveHospitalPlan: [this.insurancePlanFormValues ? this.insurancePlanFormValues.haveHospitalPlan ? 'true' : 'false'
       : '' , [Validators.required]],
      haveCPFDependentsProtectionScheme: [this.insurancePlanFormValues ? this.insurancePlanFormValues.haveCPFDependentsProtectionScheme
         : '', [Validators.required]],
      life_protection_amount: [this.insurancePlanFormValues ? this.insurancePlanFormValues.
        life_protection_amount : '', [Validators.required]],
      other_life_protection_amount: [this.insurancePlanFormValues ? this.insurancePlanFormValues.other_life_protection_amount : '',
       [Validators.required]],
      criticalIllnessCoverageAmount: [this.insurancePlanFormValues ?  this.insurancePlanFormValues.criticalIllnessCoverageAmount :
         '', [Validators.required]],
      disabilityIncomeCoverageAmount: [this.insurancePlanFormValues ?  this.insurancePlanFormValues.disabilityIncomeCoverageAmount : '' ,
       [Validators.required]],
      haveLongTermElderShield: [this.insurancePlanFormValues ?  this.insurancePlanFormValues.haveLongTermElderShield :
        '', [Validators.required]],
      longTermElderShieldAmount: [this.insurancePlanFormValues ?  this.insurancePlanFormValues.longTermElderShieldAmount
        : '', [Validators.required]],
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
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  goToNext(form) {
    form.value.enquiryId = this.comprehensiveService.getEnquiryId();
    this.comprehensiveService.setInsurancePlanningList(form.value);
    this.comprehensiveApiService.saveInsurancePlanning(form.value).subscribe((data) => {

    });
    this.showSummaryModal();
  }
  showSummaryModal() {
    const dependantVar = true; // Dependant Boolean
    if (this.routerEnabled) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '/summary']);
    } else {
      const summaryModalDetails = {
        setTemplateModal: 3,
        contentObj: dependantVar ? this.insurancePlanningDependantModal : this.insurancePlanningNonDependantModal,
        dependantModelSel: dependantVar,
        estimatedCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.INSURANCE_PLAN.ESTIMATED_COST,
        termInsurance: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.INSURANCE_PLAN.TERM_INSURANCE,
        wholeLife: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.INSURANCE_PLAN.WHOLE_LIFE,
        nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/4',
        routerEnabled: this.summaryRouterFlag
      };
      this.comprehensiveService.openSummaryPopUpModal(summaryModalDetails);
    }
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.INSURANCE_PLAN.TOOLTIP.' + toolTipTitle),
      DESCRIPTION: this.translate.instant('CMP.INSURANCE_PLAN.TOOLTIP.' + toolTipMessage)
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
}
