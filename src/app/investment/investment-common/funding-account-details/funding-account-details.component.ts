import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import {
  INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS
} from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import {
  InvestmentEngagementJourneyService
} from '../../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
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
  isSrsAccountAvailable = false;
  srsAccountDetails;

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
    this.getSrsAccountDetails();
  }

  getOptionListCollection() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.fundingMethods = data.objectList.portfolioFundingMethod;
      this.srsAgentBankList = data.objectList.srsAgentBank;
      this.investmentEngagementJourneyService.sortByProperty(this.fundingMethods, 'name', 'asc');
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
      confirmedFundingMethodId: [this.formValues.confirmedFundingMethodId ? this.formValues.confirmedFundingMethodId : this.formValues.initialFundingMethodId , Validators.required]
    });
  }

  addAndRemoveSrsForm(fundingMethodId) {
    if (this.isSRSAccount(fundingMethodId, this.fundingMethods)) {
      this.buildSrsForm();
    } else if (this.isCashAccount(fundingMethodId, this.fundingMethods)) {
      this.fundingAccountDetailsForm.removeControl('srsFundingDetails');
    }
    this.addorRemoveAccNoValidator();
  }

  getSrsAccountDetails() {
    this.investmentAccountService.getSrsAccountDetails().subscribe((data) => {
      if (data.responseMessage.responseCode >= 6000 && data.objectList) {
        if (data.objectList.accountNumber && data.objectList.srsBankOperator) {
          this.isSrsAccountAvailable = true;
          this.srsAccountDetails = data.objectList;
          this.setSrsAccountDetails(this.srsAccountDetails);
        }
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  isCashAccount(fundingMethodId, fundingMethods) {
    const fundingMethodName = this.getFundingMethodNameById(fundingMethodId, fundingMethods);
    if (fundingMethodName.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.CASH) {
      return true;
    } else {
      return false;
    }
  }

  // tslint:disable-next-line:no-identical-functions
  isSRSAccount(fundingMethodId, fundingMethods) {
    const fundingMethodName = this.getFundingMethodNameById(fundingMethodId, fundingMethods);
    if (fundingMethodName.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.SRS) {
      return true;
    } else {
      return false;
    }
  }

  buildSrsForm() {
    this.fundingAccountDetailsForm.addControl(
      'srsFundingDetails', this.formBuilder.group({
        srsOperatorBank: [{ value: this.formValues.srsOperatorBank, disabled: this.isSrsAccountAvailable }, Validators.required],
        srsAccountNumber: [{ value: this.formValues.srsAccountNumber, disabled: this.isSrsAccountAvailable }, Validators.required],
      })
    );
    this.setSrsAccountDetails(this.srsAccountDetails);
  }

  selectFundingMethod(key, value) {
    if (value !== this.fundingAccountDetailsForm.get('confirmedFundingMethodId').value) {
      // #this.investmentCommonService.setConfirmedFundingMethod({confirmedFundingMethodId: value });
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
    this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsAccountNumber').setValue(null);
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
      this.investmentAccountService.activateReassess();
      this.investmentCommonService.setInitialFundingMethod({ initialFundingMethodId: value });
      this.investmentCommonService.clearConfirmedFundingMethod();
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
    });
    ref.componentInstance.noClickAction.subscribe((emittedValue) => { // No do not Reassess
      ref.close();
    });
  }

  getFundingMethodNameById(fundingMethodId, fundingOptions) {
    if (fundingMethodId && fundingOptions) {
      const fundingMethod = fundingOptions.filter(
        (prop) => prop.id === fundingMethodId
      );
      return fundingMethod[0].name;
    } else {
      return '';
    }
  }
  getOperatorIdByName(operatorId, OperatorOptions) {
    if (operatorId && OperatorOptions) {
      const OperatorBank = OperatorOptions.filter(
        (prop) => prop.id === operatorId
      );
      return OperatorBank[0];
    } else {
      return '';
    }
  }

  saveSRSAccountDetails(form) {
    const params = this.constructSaveSrsAccountParams(form.value);
    const customerPortfolioId = this.investmentAccountFormValues.recommendedCustomerPortfolioId;
    this.investmentCommonService.saveSrsAccountDetails(params, customerPortfolioId).subscribe((data) => {
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ADD_PORTFOLIO_NAME]);
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  constructSaveSrsAccountParams(data) {
    const reqParams = {};
    reqParams['fundTypeId'] = data.confirmedFundingMethodId;
    if (this.isSRSAccount(data.confirmedFundingMethodId, this.fundingMethods) && !this.isSrsAccountAvailable) {
      reqParams['srsDetails'] = {
        accountNumber: data.srsFundingDetails ? data.srsFundingDetails.srsAccountNumber.replace(/[-]/g, '') : null,
        operatorId: data.srsFundingDetails ? data.srsFundingDetails.srsOperatorBank.id : null
      };
    } else {
      reqParams['srsDetails'] = null;
    }
    return reqParams;
  }

  maskConfig() {
    const config = {
      mask: RegexConstants.operatorMask.DBS
    };
    if (this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value) {
      const operator = this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value.name;
      switch (operator.toUpperCase()) {
        case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.DBS:
          config.mask = RegexConstants.operatorMask.DBS;
          break;
        case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.OCBC:
          config.mask = RegexConstants.operatorMask.OCBC;
          break;
        case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.UOB:
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
      case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.DBS:
        accNoMaxLength = 14;
        break;
      case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.OCBC:
        accNoMaxLength = 12;
        break;
      case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.UOB:
        accNoMaxLength = 9;
        break;
    }
    return accNoMaxLength;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  addorRemoveAccNoValidator() {
    if (this.fundingAccountDetailsForm.get('srsFundingDetails')) {
      const accNoControl = this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsAccountNumber');
      const selectedBank = this.fundingAccountDetailsForm.get('srsFundingDetails').get('srsOperatorBank').value;
      if (selectedBank) {
        switch (selectedBank.name.toUpperCase()) {
          case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.DBS:
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.operatorMaskForValidation.DBS)]);
            break;
          case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.OCBC:
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.operatorMaskForValidation.OCBC)]);
            break;
          case INVESTMENT_COMMON_CONSTANTS.SRS_OPERATOR.UOB:
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.operatorMaskForValidation.UOB)]);
            break;
        }
      } else {
        accNoControl.setValidators([Validators.required]);
      }
      this.fundingAccountDetailsForm.updateValueAndValidity();
    }
  }

  setSrsAccountDetails(data) {
    if (data) {
      const operatorBank = this.getOperatorIdByName(data.srsBankOperator.id, this.srsAgentBankList);
      if (operatorBank && this.fundingAccountDetailsForm.get('srsFundingDetails')) {
        this.fundingAccountDetailsForm.controls.srsFundingDetails.get('srsOperatorBank').setValue(operatorBank);
        this.fundingAccountDetailsForm.controls.srsFundingDetails.get('srsAccountNumber').setValue(data.accountNumber);
      }
    }
  }

  goToNext(form) {
    if (!form.valid) {
      return false;
    } else {
      const fundingMethod = this.getFundingMethodNameById(form.getRawValue().confirmedFundingMethodId, this.fundingMethods);
      this.investmentCommonService.setFundingAccountDetails(form.getRawValue(), fundingMethod);
      this.saveSRSAccountDetails(form);
    }
  }
}
