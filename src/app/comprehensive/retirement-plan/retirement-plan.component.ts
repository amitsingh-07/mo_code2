import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  ValidatorFn,
  AbstractControl,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NouisliderComponent } from 'ng2-nouislider';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { ProgressTrackerService } from '../../shared/modal/progress-tracker/progress-tracker.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from '../comprehensive-api.service';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMySummaryModal, IRetirementPlan } from '../comprehensive-types';
import { ComprehensiveService } from '../comprehensive.service';
import { AboutAge } from './../../shared/utils/about-age.util';
import { COMPREHENSIVE_CONST } from './../comprehensive-config.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';

@Component({
  selector: 'app-retirement-plan',
  templateUrl: './retirement-plan.component.html',
  styleUrls: ['./retirement-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RetirementPlanComponent
  implements OnInit, AfterViewInit, OnDestroy {
  sliderValue = 45;
  pageTitle: any;
  pageId: string;
  menuClickSubscription: Subscription;
  subscription: Subscription;
  summaryModalDetails: IMySummaryModal;
  retirementPlanForm: FormGroup;
  retireModal: any;
  summaryRouterFlag: boolean;
  routerEnabled = false;
  retirementDetails: IRetirementPlan;
  retirementValueChanges = false;
  viewMode: boolean;
  payoutDurationYears: any;
  showRetirementIncome = false;
  showLumpSumBenefit = false;
  submitted = false;
  confirmRetirementData: string;
  @ViewChild('ciMultiplierSlider') ciMultiplierSlider: NouisliderComponent;
  ciSliderConfig: any = {
    behaviour: 'snap',
    start: 0,
    connect: [true, false],
    format: {
      to: value => {
        return Math.round(value);
      },
      from: value => {
        return Math.round(value);
      }
    },
    pips: {
      mode: 'values',
      values: [45, 50, 55, 60, 65],
      density: 4
    }
  };
  userAge: number;
  constructor(
    private navbarService: NavbarService,
    private progressService: ProgressTrackerService,
    private translate: TranslateService,
    private configService: ConfigService,
    private comprehensiveService: ComprehensiveService,
    private comprehensiveApiService: ComprehensiveApiService,
    private router: Router,
    private route: ActivatedRoute,
    private aboutAge: AboutAge,
    private eleRef: ElementRef,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private modal: NgbModal
  ) {
    this.routerEnabled = this.summaryRouterFlag =
      COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.ROUTER_CONFIG.STEP4;
    this.pageId = this.route.routeConfig.component.name;
    this.viewMode = this.comprehensiveService.getViewableMode();
    this.userAge = this.aboutAge.calculateAge(
      this.comprehensiveService.getMyProfile().dateOfBirth,
      new Date()
    );
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.payoutDurationYears = this.translate.instant(
          'CMP.RETIREMENT_PLAN.PAYOUT_DURATION_YEARS'
        );
        this.pageTitle = this.translate.instant(
          'CMP.COMPREHENSIVE_STEPS.STEP_4_TITLE_NAV'
        );
        this.setPageTitle(this.pageTitle);
        this.confirmRetirementData = this.translate.instant(
          'CMP.RETIREMENT_PLAN.CONFIRM_DELETE'
        );
        this.retireModal = this.translate.instant('CMP.MODAL.RETIREMENT_MODAL');
        if (
          this.route.snapshot.paramMap.get('summary') === 'summary' &&
          this.summaryRouterFlag === true
        ) {
          this.routerEnabled = !this.summaryRouterFlag;
          this.showSummaryModal();
        }
      });
    });
    this.progressService.setProgressTrackerData(
      this.comprehensiveService.generateProgressTrackerData()
    );
  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe(
      pageId => {
        if (this.pageId === pageId) {
          this.progressService.show();
        }
      }
    );

    this.subscription = this.navbarService
      .subscribeBackPress()
      .subscribe(event => {
        if (event && event !== '') {
          const previousUrl = this.comprehensiveService.getPreviousUrl(
            this.router.url
          );
          if (previousUrl !== null) {
            this.router.navigate([previousUrl]);
          } else {
            this.navbarService.goBack();
          }
        }
      });

    this.sliderValue = this.comprehensiveService.getRetirementPlan()
      ? parseInt(this.comprehensiveService.getRetirementPlan().retirementAge)
      : 45;
    if (this.sliderValue >= 45 && this.sliderValue < this.userAge) {
      this.sliderValue = Math.ceil(this.userAge / 5) * 5;
    }
    this.retirementDetails = this.comprehensiveService.getRetirementPlan();
    this.buildRetirementPlanForm();
  }
  ngAfterViewInit() {
    const containerRef = this.eleRef.nativeElement.querySelector(
      '.noUi-value:last-child'
    );
    this.renderer.setProperty(containerRef, 'innerHTML', '62 or later');
    this.renderer.addClass(containerRef, 'lastSliderPips');
    if (this.sliderValue >= 45 && this.sliderValue < this.userAge) {
      this.sliderValue = Math.ceil(this.userAge / 5) * 5;
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    } else {
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    }
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
    this.navbarService.unsubscribeBackPress();
    this.subscription.unsubscribe();
  }
  buildRetirementPlanForm() {
    const retirementIncomeSet = [];

    if (
      this.retirementDetails &&
      this.retirementDetails.retirementIncomeSet.length > 0
    ) {
      this.showRetirementIncome = true;
      this.retirementDetails.retirementIncomeSet.forEach(
        (retirementIncome: any) => {
          retirementIncomeSet.push(
            this.buildRetirementDetailsForm(retirementIncome)
          );
        }
      );
    } else {
      retirementIncomeSet.push(this.buildEmptyRetirementorm());
    }
    const lumpSumBenefitSet = [];
    if (
      this.retirementDetails &&
      this.retirementDetails.lumpSumBenefitSet.length > 0
    ) {
      this.showLumpSumBenefit = true;
      this.retirementDetails.lumpSumBenefitSet.forEach(
        (lumpSumBenefit: any) => {
          lumpSumBenefitSet.push(this.buildLumpSumDetailsForm(lumpSumBenefit));
        }
      );
    } else {
      lumpSumBenefitSet.push(this.buildEmptyLumpBenefitSetForm());
    }

    this.retirementPlanForm = this.formBuilder.group({
      retirementAge: [this.sliderValue],
      haveOtherSourceRetirementIncome: [
        this.retirementDetails
          ? this.retirementDetails.haveOtherSourceRetirementIncome
          : ''
      ],
      retirementIncomeSet: this.formBuilder.array(retirementIncomeSet),
      lumpSumBenefitSet: this.formBuilder.array(lumpSumBenefitSet)
    });
  }
  buildEmptyRetirementorm() {
    let ageValidator = !this.showRetirementIncome ? [] : [this.ageValidation];
    return this.formBuilder.group({
      monthlyPayout: [''],
      payoutStartAge: ['', ageValidator],
      payoutDuration: ['']
    });
  }
  buildEmptyLumpBenefitSetForm() {
    let yearValidator = !this.showLumpSumBenefit ? [] : [this.payOffYearValid];
    return this.formBuilder.group({
      maturityAmount: [''],
      maturityYear: ['', yearValidator]
    });
  }
  buildRetirementDetailsForm(value) {
    return this.formBuilder.group({
      monthlyPayout: [value.monthlyPayout],
      payoutStartAge: [value.payoutStartAge],
      payoutDuration: [value.payoutDuration]
    });
  }
  buildLumpSumDetailsForm(value) {
    return this.formBuilder.group({
      maturityAmount: [value.maturityAmount],
      maturityYear: [value.maturityYear]
    });
  }
  addRetirementIncome() {
    this.submitted = false;
    const retireIncomeLength = this.retirementPlanForm.get(
      'retirementIncomeSet'
    )['length'];
    if (this.showRetirementIncome) {
      const retirementIncomeDetails = this.retirementPlanForm.get(
        'retirementIncomeSet'
      ) as FormArray;
      retirementIncomeDetails.push(this.buildEmptyRetirementorm());
    }
    if (retireIncomeLength === 1) {
      this.showRetirementIncome = true;
    }
  }
  SelectPayoutYears(status, i) {
    const retirementIncomeDetails = status ? status : '';
    this.retirementPlanForm.controls['retirementIncomeSet']['controls'][
      i
    ].controls.payoutDuration.setValue(retirementIncomeDetails);
    this.retirementPlanForm.get('retirementIncomeSet').markAsDirty();
  }

  addLumpSumAmount() {
    this.submitted = false;
    const retireIncomeLength = this.retirementPlanForm.get('lumpSumBenefitSet')[
      'length'
    ];
    if (this.showLumpSumBenefit) {
      const retirementIncomeDetails = this.retirementPlanForm.get(
        'lumpSumBenefitSet'
      ) as FormArray;
      retirementIncomeDetails.push(this.buildEmptyLumpBenefitSetForm());
    }
    if (retireIncomeLength === 1) {
      this.showLumpSumBenefit = true;
    }
  }
  onSliderChange(value): void {
    this.sliderValue = value;
    this.retirementValueChanges = true;
    if (this.sliderValue >= 45 && this.sliderValue < this.userAge) {
      this.sliderValue = Math.ceil(this.userAge / 5) * 5;
      this.ciMultiplierSlider.writeValue(this.sliderValue);
    }
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, {
      id: this.pageId,
      iconClass: 'navbar__menuItem--journey-map'
    });
  }
  goToNext(form: FormGroup) {
    if (this.viewMode) {
      this.showSummaryModal();
    } else {
      form.value.lumpSumBenefitSet.forEach((lumpSumBenefit: any, index) => {
        const otherPropertyControl =
          form.controls.lumpSumBenefitSet['controls'][index]['controls'][
          'maturityYear'
          ];
        let yearValidator = !this.showLumpSumBenefit
          ? []
          : [this.payOffYearValid];
        otherPropertyControl.setValidators(yearValidator);
        otherPropertyControl.updateValueAndValidity();
      });
      form.value.retirementIncomeSet.forEach((retirementIncome: any, index) => {
        const otherPropertyControl =
          form.controls.retirementIncomeSet['controls'][index]['controls'][
          'payoutStartAge'
          ];
        let ageValidator = !this.showRetirementIncome
          ? []
          : [this.ageValidation];
        otherPropertyControl.setValidators(ageValidator);
        otherPropertyControl.updateValueAndValidity();
      });
      if (this.validateRetirement(form)) {
        const retirementData = form.value;
        (retirementData.enquiryId = this.comprehensiveService.getEnquiryId()),
          (retirementData.retirementAge = this.sliderValue.toString());
        if (!this.showLumpSumBenefit) {
          retirementData.lumpSumBenefitSet = [];
        }
        if (!this.showRetirementIncome) {
          retirementData.retirementIncomeSet = [];
        }
        this.comprehensiveApiService
          .saveRetirementPlanning(retirementData)
          .subscribe((data: any) => {
            this.comprehensiveService.setRetirementPlan(retirementData);
            this.showSummaryModal();
          });
      }
    }
  }
  validateRetirement(form) {
    this.submitted = true;
    if (!form.valid) {
      const error = this.comprehensiveService.getMultipleFormError(
        form,
        COMPREHENSIVE_FORM_CONSTANTS.RETIREMENT_FORM,
        ''
      );
      this.comprehensiveService.openErrorModal(
        error.title,
        error.errorMessages,
        true
      );
      return false;
    }
    return true;
  }
  showSummaryModal() {
    if (this.routerEnabled) {
      this.router.navigate([
        COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN + '/summary'
      ]);
    } else {
      this.summaryModalDetails = {
        setTemplateModal: 4,
        contentObj: this.retireModal,
        nextPageURL: this.viewMode
          ? COMPREHENSIVE_ROUTE_PATHS.DASHBOARD
          : COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT,
        routerEnabled: this.summaryRouterFlag
      };
      this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
    }
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant(
        'CMP.RETIREMENT_PLAN.TOOLTIP.' + toolTipTitle
      ),
      DESCRIPTION: this.translate.instant(
        'CMP.RETIREMENT_PLAN.TOOLTIP.' + toolTipMessage
      )
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }
  openConfirmationModal() {
    if (this.showRetirementIncome || this.showLumpSumBenefit) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.unSaved = true;
      ref.componentInstance.hasImpact = this.confirmRetirementData;
      ref.result.then(data => {
        if (data === 'yes') {
          const retirementIncomeDetails = this.retirementPlanForm.get('retirementIncomeSet') as FormArray;

          const lumpSumBenefitSet = this.retirementPlanForm.get('lumpSumBenefitSet') as FormArray;
          for (let i = retirementIncomeDetails.length; i > 0; i--) {
            this.deleteRetirementDetails(i - 1, 'retirementIncomeSet');
          }
          for (let i = lumpSumBenefitSet.length; i > 0; i--) {
            this.deleteRetirementDetails(i - 1, 'lumpSumBenefitSet');
          }
          this.retirementPlanForm.controls['haveOtherSourceRetirementIncome'].setValue(false);
        }
      });
      return false;
    }

  }
  deleteRetirementDetails(i, array) {

    const retirementIncomeDetails = this.retirementPlanForm.get(
      array
    ) as FormArray;
    if (retirementIncomeDetails.length === 0) {
      if (array === 'retirementIncomeSet') {
        this.showRetirementIncome = false;
      } else if (array === 'lumpSumBenefitSet') {
        this.showLumpSumBenefit = false;
      }
    } else {
      retirementIncomeDetails.removeAt(i);
    }
    this.retirementPlanForm.get(array).markAsDirty();
  }

  ageValidation(form) {
    if (parseInt(form.value) < 100 && parseInt(form.value) >= 0) {
      return null;
    }

    return { pattern: true };
  }
  payOffYearValid(payOffYearVal) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let validCheck: boolean;
    if (payOffYearVal.value === null || payOffYearVal.value === '') {
      validCheck = true;
    } else {
      validCheck = payOffYearVal.value >= currentYear ? true : false;
    }
    if (validCheck) {
      return null;
    }
    return { pattern: true };
  }
}
