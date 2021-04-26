import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { IInvestmentCriteria } from '../../investment-common/investment-common-form-data';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../investment-engagement-journey-routes.constants';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS
} from '../investment-engagement-journey.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';

@Component({
  selector: 'app-your-investment-amount',
  templateUrl: './your-investment-amount.component.html',
  styleUrls: ['./your-investment-amount.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class YourInvestmentAmountComponent implements OnInit {
  investmentAmountForm: FormGroup;
  investmentAmountFormValues;
  modalData: any;
  helpData: any;
  pageTitle: string;
  form: any;
  translator: any;
  oneTimeInvestmentChkBoxVal: boolean;
  monthlyInvestmentChkBoxVal: boolean;
  investmentCriteria: IInvestmentCriteria;
  selectedPortfolioType;
  loaderTitle: string; 
  loaderDescTwo: string;

  portfolioType

  constructor(
    private router: Router,
    private modal: NgbModal,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public authService: AuthenticationService,
    public readonly translate: TranslateService,
    private investmentAccountService: InvestmentAccountService,
    private cd: ChangeDetectorRef,
    private investmentCommonService: InvestmentCommonService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = this.translate.instant('INVESTMENT_AMOUNT.TITLE');
      self.translator = this.translate.instant('MY_FINANCIALS');
      this.setPageTitle(self.pageTitle);
      this.loaderTitle = this.translate.instant('MY_FINANCIALS.RESPONSE_LOADER.TITLE');
      this.loaderDescTwo = this.translate.instant('MY_FINANCIALS.RESPONSE_LOADER.DESC_TWO');
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
    this.investmentAmountFormValues = this.investmentEngagementJourneyService.getPortfolioFormData();
    this.selectedPortfolioType = this.investmentEngagementJourneyService.getSelectPortfolioType();
    this.oneTimeInvestmentChkBoxVal = this.investmentAmountFormValues.oneTimeInvestmentChkBox
      ? this.investmentAmountFormValues.oneTimeInvestmentChkBox
      : false;
    this.monthlyInvestmentChkBoxVal = this.investmentAmountFormValues.monthlyInvestmentChkBox
      ? this.investmentAmountFormValues.monthlyInvestmentChkBox
      : false;
    if (typeof this.oneTimeInvestmentChkBoxVal === 'undefined') {
      this.oneTimeInvestmentChkBoxVal = true;
    }
    if (typeof this.monthlyInvestmentChkBoxVal === 'undefined') {
      this.monthlyInvestmentChkBoxVal = true;
    }
    this.getInvestmentCriteria(this.selectedPortfolioType);
    this.buildInvestAmountForm();
  }

  getInvestmentCriteria(selectedPortfolioValue) {
    this.portfolioType = this.toDecidedPortfolioType(selectedPortfolioValue);
    this.portfolioType = this.investmentCommonService.getInvestmentCriteria(this.portfolioType).subscribe((data) => {
      this.investmentCriteria = data;
    });
  }

  toDecidedPortfolioType(selectedPortfolioValue) {
    if (selectedPortfolioValue ===
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER_PORTFOLIO) {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISESAVER
    } else if (selectedPortfolioValue ===
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO) {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVESTMENT
    } else {
      return INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.WISEINCOME
    }
  }

  buildInvestAmountForm() {
    this.investmentAmountForm = new FormGroup({
      initialInvestment: new FormControl(
        this.investmentAmountFormValues.initialInvestment,
        Validators.required
      ),
      monthlyInvestment: new FormControl(this.investmentAmountFormValues.monthlyInvestment),
      suffEmergencyFund: new FormControl(
        INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.sufficient_emergency_fund
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
  secondChkBoxChange() {
    if (this.investmentAmountForm.controls.secondChkBox.value === true) {
      this.investmentAmountForm.controls.monthlyInvestment.enable();
      this.investmentAmountForm.controls.monthlyInvestment.setValue(0);
    } else {
      this.investmentAmountForm.controls.monthlyInvestment.disable();
      this.investmentAmountForm.controls.monthlyInvestment.setValue(0);
    }
  }
  firstChkBoxChange() {
    if (this.investmentAmountForm.controls.firstChkBox.value === true) {
      this.investmentAmountForm.controls.initialInvestment.enable();
      this.investmentAmountForm.controls.initialInvestment.setValue(0);
    } else {
      this.investmentAmountForm.controls.initialInvestment.disable();
      this.investmentAmountForm.controls.initialInvestment.setValue(0);
    }
  }
  goToNext(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
    }
    const error = this.investmentEngagementJourneyService.investmentAmountValidation(form, this.investmentCriteria);
    if (error) {
      // tslint:disable-next-line:no-commented-code
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessageHTML = error.errorMessage
        .replace('$ONE_TIME_AMOUNT$', this.investmentCriteria.oneTimeInvestmentMinimum)
        .replace('$MONTHLY_AMOUNT$', this.investmentCriteria.monthlyInvestmentMinimum);
      // tslint:disable-next-line:triple-equals
    } else {
      this.investmentAccountService.getSpecificDropList('portfolioType').subscribe((data) => {
        this.investmentCommonService.setPortfolioType(data.objectList.portfolioType);
        if (this.selectedPortfolioType === 'wiseSaverPortfolio') {
          let portfolioType = this.investmentEngagementJourneyService.filterDataByInput(data.objectList.portfolioType, 'name', 'Wisesaver');
          form.value.portfolioTypeId = portfolioType.id;
          this.investmentEngagementJourneyService.setYourInvestmentAmount(form.value);
          const invCommonFormValues = this.investmentCommonService.getInvestmentCommonFormData();
          this.investmentEngagementJourneyService.savePersonalInfo(invCommonFormValues).subscribe((data) => {
            this.investmentCommonService.clearAccountCreationActions();
            if (data) {
              this.authService.saveEnquiryId(data.objectList.enquiryId);
              if (this.investmentAccountService.isReassessActive()){
                this.getPortfolioAllocationDetails();
              }else{              
              this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.RISK_ACKNOWLEDGEMENT]);
            }
           }
          },
            (err) => {
              this.loaderService.hideLoader();
              this.investmentAccountService.showGenericErrorModal();
            });
        } else {
          this.investmentEngagementJourneyService.setYourInvestmentAmount(form.value);
          this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.MY_FINANCIAL]);
        }
      },
        (err) => {
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        });
    }
  }
  getPortfolioAllocationDetails() {
    this.loaderService.showLoader({
      title: this.loaderTitle,
      desc: this.loaderDescTwo
    });
    const params = this.constructGetAllocationParams();
    if (params && params.enquiryId) {
      this.investmentEngagementJourneyService.getPortfolioAllocationDetails(params).subscribe((data) => {
        this.loaderService.hideLoader(); 
        this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CONFIRM_PORTFOLIO]);      
      },
        (err) => {
          this.loaderService.hideLoader();
          this.investmentAccountService.showGenericErrorModal();
        });
    } else {
      this.navbarService.logoutUser();
    }
  }
  constructGetAllocationParams() {
    return {
      enquiryId: this.authService.getEnquiryId()
    };
  }
 
}
