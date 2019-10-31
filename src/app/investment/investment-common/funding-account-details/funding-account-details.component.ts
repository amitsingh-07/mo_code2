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
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import {
    INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import {
    InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import {
    INVESTMENT_COMMON_ROUTE_PATHS, INVESTMENT_COMMON_ROUTES
} from '../investment-common-routes.constants';
import { InvestmentCommonService } from '../investment-common.service';


@Component({
  selector: 'app-funding-account-details',
  templateUrl: './funding-account-details.component.html',
  styleUrls: ['./funding-account-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingAccountDetailsComponent implements OnInit {
  pageTitle: string;
  fundingAccountDetailsForm: FormGroup;
  formValues;
  investmentAccountFormValues;
  fundingMethods: any;
  srsAgentBankList;
  characterLength;
  srsBank;
  showMaxLength;
  fundingSubText;
  selectedFundingMethod;
  srsFormData;

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
    this.investmentAccountFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.getOptionListCollection();
   }

  getOptionListCollection() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.fundingMethods = data.objectList.portfolioFundingMethod;
      this.srsAgentBankList = data.objectList.srsAgentBank;
      this.buildForm();
      this.addAndRemoveSrsForm(this.fundingAccountDetailsForm.get('confirmedFundingMethodId').value);
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  buildForm() {
    this.fundingAccountDetailsForm = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      confirmedFundingMethodId: [this.formValues.confirmedFundingMethodId ? this.formValues.confirmedFundingMethodId : this.formValues.initialFundingMethodId, Validators.required]
    });
  }

  addAndRemoveSrsForm(fundingMethodId) {
    if (this.isSRSAccount(fundingMethodId, this.fundingMethods)) {
     this.getSrsAccountDetails();
     this.buildForSrsForm();
    } else if (this.isCashAccount(fundingMethodId, this.fundingMethods)) {
      const srsFormGroup = this.fundingAccountDetailsForm.get('srsFundingDetails') as FormGroup;
      this.fundingAccountDetailsForm.removeControl('srsFundingDetails');
     
    }
    this.addorRemoveAccNoValidator();
  }
  getSrsAccountDetails() {
   this.investmentAccountService.getSrsAccountDetails().subscribe((data) => {
    if (data.responseMessage.responseCode >= 6000) {
      this.investmentEngagementJourneyService.setFinancialDetails(data.objectList);
      this.srsFormData = data.objectList;
     this.isDisable();
     this.setSrsDetails(data.objectList);
    }
  },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
    }
  isDisable() {
         const srsFormDataValue = this.srsFormData ? true : false;
         return srsFormDataValue;
      }
  isCashAccount(fundingMethodId, fundingMethods) {
    const fundingMethodName = this.getFundingMethodNameById(fundingMethodId, fundingMethods);
    if (fundingMethodName.toUpperCase() === 'CASH') {
      return true;
    }
  }

  // tslint:disable-next-line:no-identical-functions
  isSRSAccount(fundingMethodId, fundingMethods) {
    const fundingMethodName = this.getFundingMethodNameById(fundingMethodId, fundingMethods);
    if (fundingMethodName.toUpperCase() === 'SRS') {
      return true;
    }
  }

  buildForSrsForm() {
    this.fundingAccountDetailsForm.addControl(
      'srsFundingDetails', this.formBuilder.group({
         srsOperatorBank: [{value:this.formValues.srsOperatorBank,  disabled: this.isDisable()}, Validators.required],
         srsAccountNumber: [{value:this.formValues.srsAccountNumber, disabled: this.isDisable()}, Validators.required],
          })
    );
  }

  selectFundingMethod(key, value) {
    if (value !== this.formValues.confirmedFundingMethodId) {
      //this.investmentCommonService.setConfirmedFundingMethod({confirmedFundingMethodId: value });
      this.fundingAccountDetailsForm.controls[key].setValue(value);
      this.addAndRemoveSrsForm(value);
      if ((value !== this.formValues.initialFundingMethodId)) {
        this.fundingSubText = {
          userGivenPortfolioName: this.investmentAccountFormValues.defaultPortfolioName,
          userFundingMethod: this.getFundingMethodNameById(value, this.fundingMethods)
        };
        this.showReassessRiskModal(key, value);
      }
    }
  }

  selectSrsOperator(key, value, nestedKey) {
    this.fundingAccountDetailsForm.controls[nestedKey]['controls'][key].setValue(value);
    this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsAccountNumber').setValue('');
    this.getAccNoMaxLength(value);
    this.addorRemoveAccNoValidator();
  }

  showReassessRiskModal(key, value) {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('CONFIRM_ACCOUNT_DETAILS.SHOW_MODAL.TITLE');
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorMessage = this.translate.instant('CONFIRM_ACCOUNT_DETAILS.SHOW_MODAL.DESC', { userGivenPortfolioName: this.fundingSubText.userGivenPortfolioName, userFundingMethod: this.fundingSubText.userFundingMethod });
    ref.componentInstance.yesOrNoButton = true;
    ref.componentInstance.closeBtn = false;
    ref.componentInstance.yesClickAction.subscribe((emittedValue) => { // Yes Reassess
      ref.close();
      this.investmentCommonService.setInitialFundingMethod({initialFundingMethodId: value });
      this.investmentCommonService.clearConfirmedFundingMethod();
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
    });
    ref.componentInstance.noClickAction.subscribe((emittedValue) => { // No do not Reassess
      ref.close();
    });
  }

  getFundingMethodNameById(fundingMethodId, fundingOptions) {
    const fundingMethod = fundingOptions.filter(
      (prop) => prop.id === fundingMethodId
    );
    return fundingMethod[0].name;
  }
  getOperatorIdByName(operatorId, OperatorOptions) {
    const OperatorBank = OperatorOptions.filter(
      (prop) => prop.id === operatorId
    );
    return OperatorBank[0];
  }

  goToNext(form) {
    if (!form.valid) {
      return false;
    } else {
      this.investmentCommonService.setFundingAccountDetails(form.getRawValue());
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ADD_PORTFOLIO_NAME]);
    }
  }

  maskConfig() {
    const config = {
      mask: RegexConstants.operatorMask.DBS,
      guide: false
    };
    if (this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value) {
      const operator = this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value.name;
      switch (operator.toUpperCase()) {
        case 'DBS':
          config.mask = RegexConstants.operatorMask.DBS;
          break;
        case 'OCBC':
          config.mask = RegexConstants.operatorMask.OCBC;
          break;
        case 'UOB':
          config.mask = RegexConstants.operatorMask.UOB;
          break;
      }
    }
    return config;
  }

  getAccNoLength() {
    if (this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value) {
      const accNo = this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsAccountNumber').value;
      if (accNo) {
        return accNo.match(/\d/g).join('').length;
      } else {
        return 0;
      }
    }
  }

  getAccNoMaxLength(value) {
    let accNoMaxLength;
    switch (this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value.name) {
      case 'DBS':
        accNoMaxLength = 14;
        break;
      case 'OCBC':
        accNoMaxLength = 12;
        break;
      case 'UOB':
        accNoMaxLength = 9;
        break;
    }
    return accNoMaxLength;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  addorRemoveAccNoValidator() {
    const bankName = this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value.name.toUpperCase();
    const accNoControl = this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsAccountNumber');
    if (bankName) {
      switch (bankName) {
        case 'DBS':
          accNoControl.setValidators(
            [Validators.pattern(RegexConstants.operatorMaskForValidation.DBS)]);
          break;
        case 'OCBC':
          accNoControl.setValidators(
            [Validators.pattern(RegexConstants.operatorMaskForValidation.OCBC)]);
          break;
        case 'UOB':
          accNoControl.setValidators(
            [Validators.pattern(RegexConstants.operatorMaskForValidation.UOB)]);
          break;
      }
    } else {
      accNoControl.clearValidators();
    }
    this.fundingAccountDetailsForm.updateValueAndValidity();
  }
  setSrsDetails(formData) {
    if (formData) {
     const operatorBank = this.getOperatorIdByName(formData.srsDetails.operatorId, this.srsAgentBankList);
     this.fundingAccountDetailsForm.controls.srsFundingDetails.get('srsOperatorBank').setValue(operatorBank);
     this.fundingAccountDetailsForm.controls.srsFundingDetails.get('srsAccountNumber').setValue(formData.srsDetails.accountNumber);
      }
  }
  
}
