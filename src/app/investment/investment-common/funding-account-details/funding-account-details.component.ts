import {
  ModelWithButtonComponent
} from 'src/app/shared/modal/model-with-button/model-with-button.component';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import {
  InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_COMMON_ROUTE_PATHS, INVESTMENT_COMMON_ROUTES } from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';

@Component({
  selector: 'app-funding-account-details',
  templateUrl: './funding-account-details.component.html',
  styleUrls: ['./funding-account-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingAccountDetailsComponent implements OnInit {
  pageTitle: string;
  formValues;
  FundValue;
  fundingMethods: any;
  srsAgentBankList;
  fundingAccountDetailsFrom: FormGroup;

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    private modal: NgbModal,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    public investmentAccountService: InvestmentAccountService,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('Confirm Account Details');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.formValues = this.investmentCommonService.getInvestmentCommonFormData();
    this.getSrsAgentBank();
    this.fundingAccountDetailsFrom = this.buildForm();
    this.addAndRemoveSrsForm(this.fundingAccountDetailsFrom.get('fundingAccountMethod').value);
  }
  getSrsAgentBank() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.fundingMethods = data.objectList.portfolioFundingMethod;
      this.srsAgentBankList = data.objectList.srsAgentBank;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  buildForm() {
    return this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      fundingAccountMethod: [this.formValues.fundingAccountMethod ? this.formValues.fundingAccountMethod : this.formValues.fundingMethod, Validators.required]
    });
  }
  addAndRemoveSrsForm(FundingMethod) {
    if (FundingMethod === 'SRS') {
      this.buildForSrsForm();
    } else if (FundingMethod === 'Cash' && this.fundingAccountDetailsFrom.get('srsFundingDetails')) {
      const srsFormGroup = this.fundingAccountDetailsFrom.get('srsFundingDetails') as FormGroup;
      this.fundingAccountDetailsFrom.removeControl('srsFundingDetails');
      srsFormGroup.removeControl('srsOperatorBank');
      srsFormGroup.removeControl('srsAccountNumber');

    }
    this.observeFundingMethodChange();
  }

  buildForSrsForm() {
    this.fundingAccountDetailsFrom.addControl(
      'srsFundingDetails', this.formBuilder.group({
        srsOperatorBank: [this.formValues.srsOperatorBank, Validators.required],
        srsAccountNumber: [this.formValues.srsAccountNumber, Validators.required],
      })
    );
  }

  observeFundingMethodChange() {
    this.fundingAccountDetailsFrom
      .get('fundingAccountMethod')
      .valueChanges.subscribe((value) => {
        this.addAndRemoveSrsForm(value);
      });
  }

  selectFundingMethod(key, value) {
    if (this.fundingAccountDetailsFrom.get('fundingAccountMethod').value !== value) {
      this.changingFundMethod(value);
    }
    this.fundingAccountDetailsFrom.controls[key].setValue(value);
  }
  selectSrsOperator(key, value, nestedKey) {
    this.fundingAccountDetailsFrom.controls[nestedKey]['controls'][key].setValue(value);
  }

  changingFundMethod(value) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('Reassess the Risk profile');
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorMessage = this.translate.instant('you want change the risk fund method you can risk  reassess the risk profile');
    ref.componentInstance.yesOrNoButton = true;
    ref.componentInstance.closeBtn = false;
    ref.componentInstance.yesClickAction.subscribe((emittedValue) => {
      ref.close();
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ADD_PORTFOLIO_NAME]);
    });
    ref.componentInstance.noClickAction.subscribe((emittedValue) => {
      ref.close();
      this.addAndRemoveSrsForm(value);
    });
  }
  goToNext(form) {
    if (!form.valid) {
      return false;
    } else {
      this.investmentCommonService.setFundingAccountDetails(form.getRawValue());
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ADD_PORTFOLIO_NAME]);
    }
  }

}
