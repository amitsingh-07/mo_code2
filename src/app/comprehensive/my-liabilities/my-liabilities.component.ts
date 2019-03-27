import { ProgressTrackerService } from './../../shared/modal/progress-tracker/progress-tracker.service';
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
import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { COMPREHENSIVE_CONST } from '../comprehensive-config.constants';

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
  validationFlag: boolean;
  constructor(
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private formBuilder: FormBuilder, private configService: ConfigService,
    private comprehensiveService: ComprehensiveService, private comprehensiveApiService: ComprehensiveApiService,
    private progressService: ProgressTrackerService, private loaderService: LoaderService) {
    this.pageId = this.route.routeConfig.component.name;
    this.configService.getConfig().subscribe((config) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
    });
    this.translate.get('COMMON').subscribe((result: string) => {
      // meta tag and title
      this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_2_TITLE');

      this.setPageTitle(this.pageTitle);
      this.validationFlag = this.translate.instant('CMP.MY_LIABILITIES.OPTIONAL_VALIDATION_FLAG');
    });

    this.liabilitiesDetails = this.comprehensiveService.getMyLiabilities();

  }

  ngOnInit() {
    this.progressService.setProgressTrackerData(this.comprehensiveService.generateProgressTrackerData());
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        this.progressService.show();
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
    const otherPropertyControl = this.myLiabilitiesForm.controls['otherPropertyLoanOutstandingAmount'];
    if (this.propertyLoan) {
      otherPropertyControl.setValidators([Validators.required, Validators.pattern('^0*[1-9]\\d*$')]);
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
      homeLoanOutstandingAmount: [this.liabilitiesDetails ? this.liabilitiesDetails.homeLoanOutstandingAmount : '', []],
      otherPropertyLoanOutstandingAmount: [this.liabilitiesDetails ? this.liabilitiesDetails.otherPropertyLoanOutstandingAmount : ''],
      otherLoanOutstandingAmount: [this.liabilitiesDetails ? this.liabilitiesDetails.otherLoanOutstandingAmount :'', []],
      carLoansAmount: [this.liabilitiesDetails ? this.liabilitiesDetails.carLoansAmount : '', []],

    });
  }
  goToNext(form: FormGroup) {
    if (this.validateLiabilities(form)) {
      if (!form.pristine) {
        this.liabilitiesDetails = form.value;
        this.liabilitiesDetails[COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_LIABILITIES.API_TOTAL_BUCKET_KEY] = this.totalOutstanding;
        this.liabilitiesDetails.enquiryId = this.comprehensiveService.getEnquiryId();
        this.comprehensiveService.setMyLiabilities(this.liabilitiesDetails);
        // this.loaderService.showLoader({ title: 'Saving' });
        // this.comprehensiveApiService.saveLiabilities(this.liabilitiesDetails).subscribe((data) => {
        //   this.loaderService.hideLoader();
          const financeModal = this.translate.instant('CMP.MODAL.FINANCES_MODAL');
          this.summaryModalDetails = {
              setTemplateModal: 2,
              contentObj: financeModal,
              liabilitiesEmergency: false,
              liabilitiesLiquidCash: 30000,
              liabilitiesMonthlySpareCash: 200,
              nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/3'
          };
          this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
        //});
      } else {
        const financeModal = this.translate.instant('CMP.MODAL.FINANCES_MODAL');
        this.summaryModalDetails = {
            setTemplateModal: 2,
            contentObj: financeModal,
            liabilitiesEmergency: false,
            liabilitiesLiquidCash: 30000,
            liabilitiesMonthlySpareCash: 200,
            nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/3'
        };
        this.comprehensiveService.openSummaryPopUpModal(this.summaryModalDetails);
      }
    }
  }
  get addLiabilitiesValid() { return this.myLiabilitiesForm.controls; }
  validateLiabilities(form: FormGroup) {
    this.submitted = true;
    if (this.validationFlag === true && !form.valid) {
      Object.keys(form.controls).forEach((key) => {

        form.get(key).markAsDirty();
      });

      const error = this.comprehensiveService.getFormError(form, COMPREHENSIVE_FORM_CONSTANTS.MY_LIABILITIES);
      this.comprehensiveService.openErrorModal(error.title, error.errorMessages, false,
        this.translate.instant('CMP.ERROR_MODAL_TITLE.MY_LIABILITIES'));
      return false;
    } else {
      this.submitted = false;
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

