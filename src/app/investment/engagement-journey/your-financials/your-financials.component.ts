import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AccountCreationService } from '../../account-creation/account-creation-service';
import { ENGAGEMENT_JOURNEY_CONSTANTS } from '../engagement-journey.constants';
import { FooterService } from '../../../shared/footer/footer.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../engagement-journey-routes.constants';
import { EngagementJourneyService } from '../engagement-journey.service';
import { IMyFinancials } from './your-financials.interface';

@Component({
  selector: 'app-your-financials',
  templateUrl: './your-financials.component.html',
  styleUrls: ['./your-financials.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourFinancialsComponent implements IPageComponent, OnInit {
  myFinancialsForm: FormGroup;
  myFinancialsFormValues: IMyFinancials;
  modalData: any;
  helpData: any;
  pageTitle: string;
  form: any;
  translator: any;
  oneTimeInvestmentChkBoxVal: boolean;
  monthlyInvestmentChkBoxVal: boolean;

  constructor(
    private router: Router,
    private modal: NgbModal,
    private engagementJourneyService: EngagementJourneyService,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    public readonly translate: TranslateService,
    private accountCreationService: AccountCreationService,
    private cd: ChangeDetectorRef
  ) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('MY_FINANCIALS.TITLE');
      self.modalData = this.translate.instant('MY_FINANCIALS.modalData');
      self.helpData = this.translate.instant('MY_FINANCIALS.helpData');
      self.translator = this.translate.instant('MY_FINANCIALS');
      this.setPageTitle(self.pageTitle);
    });
  }

  setPageTitle(title: string) {
    const stepLabel = this.translate.instant('MY_FINANCIALS.STEP_1_LABEL');
    this.navbarService.setPageTitle(
      title,
      undefined,
      undefined,
      undefined,
      undefined,
      stepLabel
    );
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.myFinancialsFormValues = this.engagementJourneyService.getMyFinancials();
    // tslint:disable-next-line:max-line-length
    this.oneTimeInvestmentChkBoxVal = this.myFinancialsFormValues.oneTimeInvestmentChkBox
      ? this.myFinancialsFormValues.oneTimeInvestmentChkBox
      : false;
    // tslint:disable-next-line:max-line-length
    this.monthlyInvestmentChkBoxVal = this.myFinancialsFormValues.monthlyInvestmentChkBox
      ? this.myFinancialsFormValues.monthlyInvestmentChkBox
      : false;
    if (typeof this.oneTimeInvestmentChkBoxVal === 'undefined') {
      this.oneTimeInvestmentChkBoxVal = true;
    }
    if (typeof this.monthlyInvestmentChkBoxVal === 'undefined') {
      this.monthlyInvestmentChkBoxVal = true;
    }
    this.myFinancialsForm = new FormGroup({
      monthlyIncome: new FormControl(this.myFinancialsFormValues.monthlyIncome),
      percentageOfSaving: new FormControl(this.myFinancialsFormValues.percentageOfSaving),
      totalAssets: new FormControl(this.myFinancialsFormValues.totalAssets),
      totalLiabilities: new FormControl(this.myFinancialsFormValues.totalLiabilities),
      initialInvestment: new FormControl(
        this.myFinancialsFormValues.initialInvestment,
        Validators.required
      ),
      monthlyInvestment: new FormControl(this.myFinancialsFormValues.monthlyInvestment),
      suffEmergencyFund: new FormControl(
        ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.sufficient_emergency_fund
      ),
      // tslint:disable-next-line:max-line-length
      firstChkBox: new FormControl(this.oneTimeInvestmentChkBoxVal),
      // tslint:disable-next-line:max-line-length
      secondChkBox: new FormControl(this.monthlyInvestmentChkBoxVal)
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    if (!this.oneTimeInvestmentChkBoxVal) {
      this.firstChkBoxChange();
    }
    if (!this.monthlyInvestmentChkBoxVal) {
      this.secondChkBoxChange();
    }
    this.cd.detectChanges();
  }

  showEmergencyFundModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.modalData.modalTitle;
    ref.componentInstance.errorMessage = this.modalData.modalMessage;
    ref.componentInstance.primaryActionLabel = this.translator.RETURN_HOME;
    ref.componentInstance.primaryAction.subscribe((emittedValue) => {
      this.router.navigate(['home']);
    });
  }
  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.helpData.modalTitle;
    ref.componentInstance.errorDescription = this.helpData.modalDesc;
    return false;
  }
  secondChkBoxChange() {
    if (this.myFinancialsForm.controls.secondChkBox.value === true) {
      this.myFinancialsForm.controls.monthlyInvestment.enable();
      this.myFinancialsForm.controls.monthlyInvestment.setValue(0);
    } else {
      this.myFinancialsForm.controls.monthlyInvestment.disable();
      this.myFinancialsForm.controls.monthlyInvestment.setValue('');
    }
  }
  firstChkBoxChange() {
    if (this.myFinancialsForm.controls.firstChkBox.value === true) {
      this.myFinancialsForm.controls.initialInvestment.enable();
      this.myFinancialsForm.controls.initialInvestment.setValue(0);
    } else {
      this.myFinancialsForm.controls.initialInvestment.disable();
      this.myFinancialsForm.controls.initialInvestment.setValue('');
    }
  }
  goToNext(form) {
    if (this.myFinancialsForm.controls.suffEmergencyFund.value === 'no') {
      this.showEmergencyFundModal();
      return;
    }
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
    }
    const error = this.engagementJourneyService.doFinancialValidations(form);
    if (error) {
      // tslint:disable-next-line:no-commented-code
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessageHTML = error.errorMessage;
      // tslint:disable-next-line:triple-equals
      if (error.isButtons) {
        ref.componentInstance.primaryActionLabel = this.translator.REVIEW_INPUT;
        ref.componentInstance.secondaryActionLabel = this.translator.PROCEED_NEXT;
        ref.componentInstance.secondaryActionDim = true;
        ref.componentInstance.primaryAction.subscribe((emittedValue) => {
          // tslint:disable-next-line:triple-equals
          this.goBack();
        });
        ref.componentInstance.secondaryAction.subscribe((emittedValue) => {
          // tslint:disable-next-line:triple-equals
          this.saveAndProceed(form);
        });
      } else {
        ref.componentInstance.ButtonTitle = this.translator.TRY_AGAIN;
        return false;
      }
    } else {
      this.saveAndProceed(form);
    }
  }
  saveAndProceed(form: any) {
    this.engagementJourneyService.setMyFinancials(form.value);
    // CALL API
    this.engagementJourneyService.savePersonalInfo().subscribe((data) => {
      if (data) {
        this.authService.saveEnquiryId(data.objectList.enquiryId);
        this.router.navigate([ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP2]);
      }
    },
    (err) => {
      this.accountCreationService.showGenericErrorModal();
    });
  }
  goBack() {
    this.router.navigate([ENGAGEMENT_JOURNEY_ROUTE_PATHS.MY_FINANCIALS]);
  }
}
