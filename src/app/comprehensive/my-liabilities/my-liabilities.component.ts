import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { COMPREHENSIVE_FORM_CONSTANTS } from '../comprehensive-form-constants';
import { IMyLiabilities, IMySummaryModal } from '../comprehensive-types';
import { appConstants } from './../../app.constants';
import { AppService } from './../../app.service';
import { ConfigService } from './../../config/config.service';
import { FooterService } from './../../shared/footer/footer.service';
import { apiConstants } from './../../shared/http/api.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveApiService } from './../comprehensive-api.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-my-liabilities',
  templateUrl: './my-liabilities.component.html',
  styleUrls: ['./my-liabilities.component.scss']
})
export class MyLiabilitiesComponent implements OnInit, OnDestroy {
  pageTitle: string;
  myLiabilitiesForm: FormGroup;
  submitted: boolean;
  propertyLoan = true;
  liabilitiesDetails: IMyLiabilities;
  summaryModalDetails: IMySummaryModal;
  totalOutstanding = 0;
  menuClickSubscription: Subscription;
  pageId: string;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');

      this.setPageTitle(this.pageTitle);
    });

    this.liabilitiesDetails = this.comprehensiveService.getMyLiabilities();

  }

  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildMyLiabilitiesForm();
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }
  addPropertyLoan() {
    const otherPropertyControl = this.myLiabilitiesForm.controls['otherPropertyLoan'];
    if (this.propertyLoan) {
      otherPropertyControl.setValidators([Validators.required]);
      otherPropertyControl.updateValueAndValidity();
    } else {
      otherPropertyControl.setValue('');
      otherPropertyControl.setValidators([]);
      otherPropertyControl.updateValueAndValidity();
    }
    this.onTotalOutstanding();
    this.propertyLoan = !this.propertyLoan;
  }
  buildMyLiabilitiesForm() {
    this.myLiabilitiesForm = this.formBuilder.group({
      homeLoanOutstanding: [this.liabilitiesDetails ? this.liabilitiesDetails.homeLoanOutstanding : '', [Validators.required]],
      otherPropertyLoan: [this.liabilitiesDetails ? this.liabilitiesDetails.otherPropertyLoan : ''],
      otherLoanAmountOutstanding: [this.liabilitiesDetails ? this.liabilitiesDetails.otherLoanAmountOutstanding :'', [Validators.required]],
      carLoan: [this.liabilitiesDetails ? this.liabilitiesDetails.carLoan : '', [Validators.required]],

    });
  }

  goToNext(form: FormGroup) {
    if (this.validateLiabilities(form)) {
      this.comprehensiveService.setMyLiabilities(form.value);
      console.log('Got it');
      const financeModal = this.translate.instant('CMP.MY_LIABILITIES.FINANCES_MODAL');
      const retireModal = this.translate.instant('CMP.MY_LIABILITIES.RETIREMENT_MODAL');
      const insurancePlanningDependantModal = this.translate.instant('CMP.MY_LIABILITIES.INSURANCE_PLANNING_MODAL.DEPENDANTS');
      const insurancePlanningNonDependantModal = this.translate.instant('CMP.MY_LIABILITIES.INSURANCE_PLANNING_MODAL.NO_DEPENDANTS');
      const childrenEducationDependantModal = this.translate.instant('CMP.MY_LIABILITIES.CHILDREN_EDUCATION_MODAL.DEPENDANTS');
      const childrenEducationNonDependantModal = this.translate.instant('CMP.MY_LIABILITIES.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');

      this.comprehensiveService.openSummaryModal(financeModal, retireModal, insurancePlanningDependantModal,
        insurancePlanningNonDependantModal, childrenEducationDependantModal, childrenEducationNonDependantModal,
        this.summaryModalDetails);
    }

  }

  validateLiabilities(form: FormGroup) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_LIABILITIES);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_LIABILITIES'));
      return false;
    }
    return true;
  }
  showToolTipModal(toolTipTitle, toolTipMessage) {
    const toolTipParams = {
      TITLE: this.translate.instant('CMP.MY_LIABILITIES.TOOLTIP.' + toolTipTitle),
      DESCRIPTION: this.translate.instant('CMP.MY_LIABILITIES.TOOLTIP.' + toolTipMessage)
    };
    this.comprehensiveService.openTooltipModal(toolTipParams);
  }

  @HostListener('input', ['$event'])
  onChange() {
    this.onTotalOutstanding();
  }

  onTotalOutstanding() {
    this.totalOutstanding = this.comprehensiveService.additionOfCurrency(this.myLiabilitiesForm.value);
  }
}
