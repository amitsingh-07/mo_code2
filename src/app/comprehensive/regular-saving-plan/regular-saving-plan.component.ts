import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IRegularSavePlan } from '../comprehensive-types';
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
  RSPSelection: boolean;
  regularSavingsArray: IRegularSavePlan;
  submitted = false;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder,
    private configService: ConfigService, private comprehensiveService: ComprehensiveService,
    private progressService: ProgressTrackerService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.investmentList = this.translate.instant('CMP.INVESTMENT_TYPE_LIST');
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });

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
      this.RSPSelection = form.hasRegularSavings === 'true' ? true : false;
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
    this.regularSavingsArray = this.comprehensiveService.getRSP();
    this.buildRSPForm();
  }
  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  buildRSPForm() {
    const regularSavings = [];
    if (this.regularSavingsArray.comprehensiveRegularSavingsList) {

      this.RSPSelection = this.regularSavingsArray.hasRegularSavings;
      this.regularSavingsArray.comprehensiveRegularSavingsList.forEach((regularSavePlan: any) => {
        regularSavings.push(this.buildRSPDetailsForm(regularSavePlan));
      });
    } else {
      regularSavings.push(this.buildEmptyRSPForm());
    }
    this.RSPForm = this.formBuilder.group({
      hasRegularSavings: [this.regularSavingsArray.hasRegularSavings, Validators.required],
      comprehensiveRegularSavingsList: this.formBuilder.array(regularSavings),
    });
  }
  buildRSPDetailsForm(value) {
    return this.formBuilder.group({
      regularUnitTrust: [value.regularUnitTrust, [Validators.required]],
      regularPaidByCash: [value.regularPaidByCash, [Validators.required]],
      regularPaidByCPF: [value.regularPaidByCash, [Validators.required]]

    });
  }
  buildEmptyRSPForm() {
    return this.formBuilder.group({
      regularUnitTrust: ['', [Validators.required]],
      regularPaidByCash: ['', [Validators.required]],
      regularPaidByCPF: ['', [Validators.required]]

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
    if (this.validateRegularSavings(form)) {
      this.comprehensiveService.setRSP(form.value);
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND]);
    }
  }

  validateRegularSavings(form: FormGroup) {

    this.submitted = true;
    if (form.value.hasRegularSavings === 'true') {
      if (!form.valid) {
        const error = this.comprehensiveService.getMultipleFormError('', COMPREHENSIVE_FORM_CONSTANTS.REGULAR_SAVINGS,
          this.translate.instant('CMP.ERROR_MODAL_TITLE.DEPENDANT_DETAIL'));
        this.comprehensiveService.openErrorModal(error.title, error.errorMessages, true,
        );
        return false;
      }
    }

    return true;
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = { TITLE: this.translate.instant('CMP.RSP.TOOLTIP.' + toolTipTitle),
    DESCRIPTION: this.translate.instant('CMP.RSP.TOOLTIP.' + toolTipMessage)};
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }

}
