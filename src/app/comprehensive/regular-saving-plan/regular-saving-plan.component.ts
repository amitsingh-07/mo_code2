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
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
        this.setPageTitle(this.pageTitle);
        this.validationFlag = this.translate.instant('CMP.RSP.OPTIONAL_VALIDATION_FLAG');
      });
    });
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

    if (this.regularSavingsArray && this.regularSavingsArray.length > 0) {

      this.regularSavingsArray.forEach((regularSavePlan: any) => {
        regularSavings.push(this.buildRSPDetailsForm(regularSavePlan));
      });

    } else {
      regularSavings.push(this.buildEmptyRSPForm());
    }
    this.RSPForm = this.formBuilder.group({
      hasRegularSavings: [this.comprehensiveService.hasRegularSavings(), Validators.required],
      comprehensiveRegularSavingsList: this.formBuilder.array(regularSavings),
    });
  }
  buildRSPDetailsForm(value) {
    return this.formBuilder.group({
      regularUnitTrust: [value.regularUnitTrust, [Validators.required]],
      regularPaidByCash: [value.regularPaidByCash, [Validators.required]],
      regularPaidByCPF: [value.regularPaidByCash, [Validators.required]],
      enquiryId: this.enquiryId

    });
  }
  buildEmptyRSPForm() {
    return this.formBuilder.group({
      regularUnitTrust: ['', [Validators.required]],
      regularPaidByCash: ['', [Validators.required]],
      regularPaidByCPF: ['', [Validators.required]],
      enquiryId: this.enquiryId

    });
  }
  addRSP() {
    const RSPDetails = this.RSPForm.get('comprehensiveRegularSavingsList') as FormArray;
    RSPDetails.push(this.buildEmptyRSPForm());
  }
  removeRSP(i) {
    const dependantDetails = this.RSPForm.get('comprehensiveRegularSavingsList') as FormArray;
    dependantDetails.removeAt(i);
  }
  selectInvest(status, i) {
    const investment = status ? status : '';
    this.RSPForm.controls['comprehensiveRegularSavingsList']['controls'][i].controls.regularUnitTrust.setValue(investment);
  }
  goToNext(form) {
    if (this.viewMode) {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND]);
    } else {
      if (this.validateRegularSavings(form)) {
        this.comprehensiveService.setRegularSavings(form.value.hasRegularSavings);
        this.comprehensiveService.setRegularSavingsList(form.value.comprehensiveRegularSavingsList);
        this.comprehensiveApiService.saveRegularSavings(form.value).subscribe((data: any) => {
        });
        this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND]);
      }
    }
  }

  validateRegularSavings(form: FormGroup) {

    this.submitted = true;
    if (this.validationFlag && form.value.hasRegularSavings === 'true') {
      if (!form.valid) {
        const error = this.comprehensiveService.getMultipleFormError('', COMPREHENSIVE_FORM_CONSTANTS.REGULAR_SAVINGS,
          this.translate.instant('CMP.ERROR_MODAL_TITLE.DEPENDANT_DETAIL'));
        this.comprehensiveService.openErrorModal(error.title, error.errorMessages, true,
        );
        return false;
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

}
