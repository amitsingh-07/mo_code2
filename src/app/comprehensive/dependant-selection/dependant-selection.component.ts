import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMySummaryModal, IDependantSummaryList } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { COMPREHENSIVE_CONST } from './../comprehensive-config.constants';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependant-selection',
  templateUrl: './dependant-selection.component.html',
  styleUrls: ['./dependant-selection.component.scss']
})
export class DependantSelectionComponent implements OnInit, OnDestroy {
  pageTitle: string;
  dependantSelectionForm: FormGroup;
  pageId: string;
  hasDependant: boolean;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  summaryModalDetails: IMySummaryModal;
  childrenEducationNonDependantModal: any;
  summaryRouterFlag: boolean;
  householdMembersList: any;
  householdIncomeList: any;
  viewMode: boolean;
  submitted: any;
  householdDetails: IDependantSummaryList;
  stepIndicatorCount: number;
  saveData: any;
  constructor(
    private cmpService: ComprehensiveService, private progressService: ProgressTrackerService,
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private configService: ConfigService,
    private cmpApiService: ComprehensiveApiService, private loaderService: LoaderService,
    private comprehensiveService: ComprehensiveService) {
    this.pageId = this.route.routeConfig.component.name;
    this.summaryRouterFlag = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.ROUTER_CONFIG.STEP1;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.householdMembersList = this.translate.instant('CMP.DEPENDANT_SELECTION.HOUSEHOLD_MEMBERS_VALUES');
        this.householdIncomeList = this.translate.instant('CMP.DEPENDANT_SELECTION.HOUSEHOLD_INCOME_VALUES');
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.saveData = this.translate.instant('COMMON_LOADER.SAVE_DATA');
        this.setPageTitle(this.pageTitle);
        this.childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
      });
    });
    this.viewMode = this.cmpService.getViewableMode();
    this.stepIndicatorCount = 5;
  }
  ngOnInit() {
    this.progressService.setProgressTrackerData(this.cmpService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
      }
    });

    this.subscription = this.navbarService.subscribeBackPress().subscribe((event) => {
      if (event && event !== '') {
        const previousUrl = this.cmpService.getPreviousUrl(this.router.url);
        if (previousUrl !== null) {
          this.router.navigate([previousUrl]);
        } else {
          this.navbarService.goBack();
        }
      }
    });

    this.buildMyDependantSelectionForm();
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

  buildMyDependantSelectionForm() {
    this.hasDependant = this.cmpService.hasDependant();
    this.householdDetails = this.cmpService.gethouseHoldDetails();
    this.dependantSelectionForm = new FormGroup({
      dependantSelection: new FormControl(this.hasDependant, Validators.required),
      noOfHouseholdMembers: new FormControl(this.householdDetails ? this.householdDetails.noOfHouseholdMembers : '', [Validators.required, Validators.min(1), Validators.max(10)]),
      houseHoldIncome: new FormControl(this.householdDetails ? this.householdDetails.houseHoldIncome : '', Validators.required),
    });
  }
  selectHouseHoldMembers(status) {
    this.dependantSelectionForm.controls['noOfHouseholdMembers'].setValue(status);
    this.dependantSelectionForm.markAsDirty();
  }
  selectHouseHoldIncome(status) {
    this.dependantSelectionForm.controls['houseHoldIncome'].setValue(status);
    this.dependantSelectionForm.markAsDirty();
  }

  goToNext(dependantSelectionForm) {
    if (this.viewMode) {
      this.routerPath(dependantSelectionForm);
    } else {
      this.cmpService.setDependantSelection(dependantSelectionForm.value.dependantSelection);
      dependantSelectionForm.value.dependentsList = this.householdDetails.dependentsList;
      this.cmpService.sethouseHoldDetails(dependantSelectionForm.value);
      const payload = {
        hasDependents: dependantSelectionForm.value.dependantSelection,
        noOfHouseholdMembers: dependantSelectionForm.value.noOfHouseholdMembers,
        houseHoldIncome: dependantSelectionForm.value.houseHoldIncome,
        enquiryId: this.cmpService.getEnquiryId(),
        dependentMappingList: [{
          id: 0,
          customerId: 0,
          name: '',
          relationship: '',
          gender: '',
          dateOfBirth: '',
          nation: ''
        }],
        saveDependentInfo: false
      };
      this.loaderService.showLoader({ title: this.saveData });
      this.cmpApiService.addDependents(payload).subscribe((data: any) => {
        this.cmpService.setHasDependant(dependantSelectionForm.value.dependantSelection);
        const dependantDetails = this.comprehensiveService.getMyDependant();
        if (!(dependantSelectionForm.value.dependantSelection && dependantDetails.length > 0)) {
          this.cmpService.setMyDependant([]);
          this.cmpService.clearEndowmentPlan();
        }
        if (this.comprehensiveService.getMySteps() === 0 && this.comprehensiveService.getMySubSteps() < 1) {
          this.comprehensiveService.setStepCompletion(0, 1).subscribe((data1: any) => {
            this.loaderService.hideLoader();
            this.routerPath(dependantSelectionForm);
          });
        } else {
          this.loaderService.hideLoader();
          this.routerPath(dependantSelectionForm);
        }
      });
    }
  }
  routerPath(dependantSelectionForm) {
    if (dependantSelectionForm.value.dependantSelection) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS]);
    } else {
      this.showSummaryModal();
    }
  }
  showSummaryModal() {
    this.summaryModalDetails = {
      setTemplateModal: 1, dependantModelSel: false,
      contentObj: this.childrenEducationNonDependantModal,
      nonDependantDetails: {
        livingCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.EXPENSE,
        livingPercent: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.PERCENT,
        livingEstimatedCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.LIVING_EXPENSES.COMPUTED_EXPENSE,
        medicalBill: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.EXPENSE,
        medicalYear: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.PERCENT,
        medicalCost: COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.NON_DEPENDANT.MEDICAL_BILL.COMPUTED_EXPENSE
      },
      nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2',
      routerEnabled: this.summaryRouterFlag
    };
    this.cmpService.openSummaryPopUpModal(this.summaryModalDetails);
  }
}
