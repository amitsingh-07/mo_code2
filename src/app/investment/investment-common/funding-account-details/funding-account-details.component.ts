
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
import { INVESTMENT_COMMON_ROUTES, INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { InvestmentCommonService } from '../investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment-engagement-journey/investment-engagement-journey.constants';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { Util } from '../../../shared/utils/util';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../../manage-investments/manage-investments.constants';

@Component({
  selector: 'app-funding-account-details',
  templateUrl: './funding-account-details.component.html',
  styleUrls: ['./funding-account-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FundingAccountDetailsComponent implements OnInit {
  pageTitle: string;
  editPageTitle: string;
  fundingAccountDetailsForm: FormGroup;
  formValues;
  investmentAccountFormValues;
  fundingMethods: any;
  srsAgentBankList;
  cpfAgentBankList: any;
  characterLength;
  srsBank;
  showMaxLength;
  fundingSubText;
  selectedFundingMethod;
  isSrsAccountAvailable = false;
  srsAccountDetails;
  cpfAccountDetails: any;
  portfolio: any;
  disableFundingMethod: boolean;
  userPortfolioType: any;
  isJAEnabled: boolean;
  navigationType: any;
  selectedPortfolio: any;
  fundList:any;
  userPortfolioList: any;

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
    public manageInvestmentsService: ManageInvestmentsService
  ) {
    this.navigationType = this.investmentCommonService.setNavigationType(this.router.url, INVESTMENT_COMMON_ROUTES.EDIT_FUNDING_ACCOUNT_DETAILS,
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NAVIGATION_TYPE.EDIT);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CONFIRM_ACCOUNT_DETAILS.TITLE');
      this.editPageTitle = this.translate.instant('CONFIRM_ACCOUNT_DETAILS.EDIT_TITLE');
      if (this.navigationType) {
        this.setPageTitle(this.editPageTitle);
      } else {
        this.setPageTitle(this.pageTitle);
      }
    });
    this.fundList = INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS;
    this.userPortfolioType = investmentEngagementJourneyService.getUserPortfolioType();
    this.isJAEnabled = (this.userPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT_ID);
    this.selectedPortfolio = investmentEngagementJourneyService.getSelectPortfolioType();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    let withdrawData = this.manageInvestmentsService.getTopUpFormData();
    this.userPortfolioList = withdrawData ? withdrawData.userPortfolios : [];
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.formValues = this.investmentCommonService.getInvestmentCommonFormData();
    this.investmentAccountFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.portfolio = this.investmentCommonService.getPortfolioDetails();
    this.disableFundingMethod = (this.portfolio && this.portfolio.portfolioDetails && this.portfolio.portfolioDetails.payoutType &&
      (this.portfolio.portfolioDetails.payoutType === INVESTMENT_COMMON_CONSTANTS.WISE_INCOME_PAYOUT.FOUR_PERCENT
        || this.portfolio.portfolioDetails.payoutType === INVESTMENT_COMMON_CONSTANTS.WISE_INCOME_PAYOUT.EIGHT_PERCENT)) || (this.userPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.PORTFOLIO_TYPE.JOINT_ACCOUNT_ID) || (this.selectedPortfolio === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.CPF_PORTFOLIO);
    this.getSrsAccDetailsAndOptionListCol();
  }

  getSrsAccDetailsAndOptionListCol() {
    this.investmentAccountService.getAllDropDownList().subscribe((response) => {
      this.callbackForOptionListCollection(response);
    });
  }
  
  callbackForOptionListCollection(data) {
    if (data.responseMessage.responseCode >= 6000 && data.objectList) {
      this.fundingMethods = data.objectList.portfolioFundingMethod;
      this.srsAgentBankList = data.objectList.srsAgentBank;
      this.cpfAgentBankList = data.objectList.cpfAgentBank;
      this.investmentEngagementJourneyService.sortByProperty(this.fundingMethods, 'name', 'asc');
      this.buildForm();
      const fundingMethodId = this.fundingAccountDetailsForm.get('confirmedFundingMethodId').value;
      this.addAndRemoveSrsForm(fundingMethodId);
      this.addAndRemoveCPFForm(fundingMethodId);
      this.callbackForGetSrsAccountDetails();
      this.callbackToGetCPFAccountDetails();
    }
  }

  callbackForGetSrsAccountDetails() {
    const fundingMethodId = this.fundingAccountDetailsForm.get('confirmedFundingMethodId').value;
    if (this.isSRSAccount(fundingMethodId, this.fundingMethods)) {
      this.manageInvestmentsService.getProfileSrsAccountDetails().subscribe((data) => {
        if (data && data['srsAccountNumber'] && data['srsOperator']) {
          this.isSrsAccountAvailable = true;
          this.srsAccountDetails = data;
          this.setSrsAccountDetails(data);
        }
      });
    }
  }

  buildForm() {
    this.fundingAccountDetailsForm = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      confirmedFundingMethodId: [this.formValues.confirmedFundingMethodId ?
        this.formValues.confirmedFundingMethodId : this.formValues.initialFundingMethodId,
      Validators.required]
    });
  }

  addAndRemoveSrsForm(fundingMethodId) {
    if (this.isSRSAccount(fundingMethodId, this.fundingMethods)) {
      this.buildSrsForm();
    } else if (this.isCashAccount(fundingMethodId, this.fundingMethods) || this.isCPFAccount(fundingMethodId, this.fundingMethods)) {
      this.fundingAccountDetailsForm.removeControl('srsFundingDetails');
    }
    this.addorRemoveAccNoValidator();
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
      this.fundingAccountDetailsForm.controls[key].setValue(value);
      this.addAndRemoveSrsForm(value);
      if ((value !== this.formValues.initialFundingMethodId)) {
        this.fundingSubText = {
          userGivenPortfolioName: this.investmentAccountFormValues.defaultPortfolioName,
          userFundingMethod: this.getFundingMethodNameById(value, this.fundingMethods)
        };
        if (this.portfolio.portfolioDetails.portfolioType.toUpperCase() !== INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.WISEINCOME.toUpperCase()) {
          this.showReassessRiskModal(key, value);
        }
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
      const selectedPortfolioType = this.investmentEngagementJourneyService.getSelectPortfolioType();
      this.investmentCommonService.saveUpdateSessionData(this.portfolio.portfolioDetails);
      if (selectedPortfolioType === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.INVEST_PORTFOLIO) {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.PERSONAL_INFO]);
      } else {
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.INVESTMENT_AMOUNT]);
      }
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
      if (!Util.isEmptyOrNull(this.navigationType)) {
        this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.PORTFOLIO_SUMMARY]);
      } else {
        this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ADD_PORTFOLIO_NAME]);
      }
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
      const operatorBank = this.getOperatorIdByName(data.srsOperatorId, this.srsAgentBankList);
      if (operatorBank && this.fundingAccountDetailsForm.get('srsFundingDetails')) {
        this.fundingAccountDetailsForm.controls.srsFundingDetails.get('srsOperatorBank').setValue(operatorBank);
        this.fundingAccountDetailsForm.controls.srsFundingDetails.get('srsAccountNumber').setValue(data.srsAccountNumber.conformedValue);
      }
    }
  }

  goToNext(form) {
    if (!form.valid) {
      return false;
    } else {
      const fundingMethod = this.getFundingMethodNameById(form.getRawValue().confirmedFundingMethodId, this.fundingMethods);
      this.investmentCommonService.setFundingAccountDetails(form.getRawValue(), fundingMethod);
      const fundingMethodId = this.fundingAccountDetailsForm.get('confirmedFundingMethodId').value;
      if(this.isCPFAccount(fundingMethodId, this.fundingMethods)) {
        this.saveCPFAccountDetails(form);
      } else {
        this.saveSRSAccountDetails(form);
      } 
    }
  }

  /* CPFIA block */
  checkIfCPFPortfolio() {
    return this.selectedPortfolio && this.selectedPortfolio.toUpperCase() === INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.SELECT_POROFOLIO_TYPE.CPF_PORTFOLIO;
  }

  buildCPFIAForm() {
    this.fundingAccountDetailsForm.addControl(
      'cpfIADetails', this.formBuilder.group({
        cpfOperatorBank: ['' , Validators.required],
        cpfAccountNumber: ['', Validators.required],
      })
    );
  }

  selectCPFOperator(key, value, nestedKey) {
    this.fundingAccountDetailsForm.controls[nestedKey]['controls'][key].setValue(value);
    this.fundingAccountDetailsForm.get(nestedKey).get('cpfAccountNumber').setValue(null);
    this.getCPFAccNoMaxLength(nestedKey, key);
    this.addorRemoveCPFAccNoValidator(nestedKey);
  }

  getCPFAccNoMaxLength(nestedKey, key) {
    let accNoMaxLength;
    switch (this.fundingAccountDetailsForm.get(nestedKey).get(key).value.name) {
      case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.DBS:
        accNoMaxLength = 13;
        break;
      case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.OCBC:
        accNoMaxLength = 9;
        break;
      case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.UOB:
        accNoMaxLength = 9;
        break;
    }
    return accNoMaxLength;
  }

  addorRemoveCPFAccNoValidator(nestedKey) {
    if (this.fundingAccountDetailsForm.get(nestedKey)) {
      const accNoControl = this.fundingAccountDetailsForm.get(nestedKey).get('cpfAccountNumber');
      const selectedBank = this.fundingAccountDetailsForm.get(nestedKey).get('cpfOperatorBank').value;
      if (selectedBank) {
        switch (selectedBank.name.toUpperCase()) {
          case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.DBS:
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.DBS)]);
            break;
          case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.OCBC:
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.OCBC)]);
            break;
          case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.UOB:
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.UOB)]);
            break;
        }
      } else {
        accNoControl.setValidators([Validators.required]);
      }
      this.fundingAccountDetailsForm.updateValueAndValidity();
    }
  }

  addAndRemoveCPFForm(fundingMethodId) {
    if (this.isCPFAccount(fundingMethodId, this.fundingMethods)) {
      this.buildCPFIAForm();
    } else if (this.isCashAccount(fundingMethodId, this.fundingMethods) || this.isSRSAccount(fundingMethodId, this.fundingMethods)) {
      this.fundingAccountDetailsForm.removeControl('cpfIADetails');
    }
    this.addorRemoveCPFAccNoValidator('cpfIADetails');
  }  

  isCPFAccount(fundingMethodId, fundingMethods) {
    const fundingMethodName = this.getFundingMethodNameById(fundingMethodId, fundingMethods);
    if (fundingMethodName.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.FUNDING_METHODS.CPF_OA) {
      return true;
    } else {
      return false;
    }
  }

  cpfMaskConfig() {
    const config = {
      mask: RegexConstants.cpfOperatorMask.DBS
    };
    if (this.fundingAccountDetailsForm.get('cpfIADetails').get('cpfOperatorBank').value) {
      const operator = this.fundingAccountDetailsForm.get('cpfIADetails').get('cpfOperatorBank').value.name;
      switch (operator.toUpperCase()) {
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.DBS:
          config.mask = RegexConstants.cpfOperatorMask.DBS;
          break;
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.OCBC:
          config.mask = RegexConstants.cpfOperatorMask.OCBC;
          break;
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.UOB:
          config.mask = RegexConstants.cpfOperatorMask.UOB;
          break;
      }
    }
    return config;
  }

  getCPFAccNoLength() {
    if (this.fundingAccountDetailsForm.get('cpfIADetails').get('cpfOperatorBank').value) {
      const accNo = this.fundingAccountDetailsForm.get('cpfIADetails').get('cpfAccountNumber').value;
      if (accNo) {
        return accNo.match(/\d/g).join('').length;
      } else {
        return 0;
      }
    }
  }

  setCPFAccountDetails(data) {
    if (data) {
      // Below const value set should be changed as per response from BE for CPF
      const operatorBank = this.getOperatorIdByName(data.bankOperator.id, this.cpfAgentBankList);
      if (operatorBank && this.fundingAccountDetailsForm.get('cpfIADetails')) {
        this.fundingAccountDetailsForm.controls.cpfIADetails.get('cpfOperatorBank').setValue(operatorBank);
        this.fundingAccountDetailsForm.controls.cpfIADetails.get('cpfAccountNumber').setValue(data.accountNumber);
      }
    }
  }

  callbackToGetCPFAccountDetails() {
    const fundingMethodId = this.fundingAccountDetailsForm.get('confirmedFundingMethodId').value;
    if (this.isCPFAccount(fundingMethodId, this.fundingMethods)) {
      this.investmentCommonService.getCKABankDetails(this.checkIfCPFDisabled()).subscribe((resp: any) => {
        if (resp && resp.responseMessage && resp.responseMessage.responseCode >= 6000) {
          if (resp.objectList) {
            this.cpfAccountDetails = resp.objectList;
            this.setCPFAccountDetails(this.cpfAccountDetails);
          }
        }
      });
    }
  } 
   
  saveCPFAccountDetails(form) {
    const params = this.constructCpfAccountParams(form.value.cpfIADetails);
    this.investmentCommonService.saveCKABankAccount(params).subscribe((data) => {
      if (data && data.objectList) {
        this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ADD_PORTFOLIO_NAME]);      
      }
    }, () => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  constructCpfAccountParams(data) {
    let reqParams = {
      accountNumber: data.cpfAccountNumber ? data.cpfAccountNumber.replace(/[-]/g, '') : null,
      bankOperatorId: data.cpfOperatorBank ? data.cpfOperatorBank.id : null
    };  
    return reqParams;
  }

  shpwCPFModal() {
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true , windowClass: 'custom-cka-modal' });
    ref.componentInstance.errorTitle = this.translate.instant(
      'CONFIRM_ACCOUNT_DETAILS.CPF_TOOLTIP.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'CONFIRM_ACCOUNT_DETAILS.CPF_TOOLTIP.DESC'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'CONFIRM_ACCOUNT_DETAILS.CPF_TOOLTIP.BTN'
    );
    ref.componentInstance.closeBtn = false;
  }

  checkIfCPFDisabled() {
    const cpfPortfolio = this.userPortfolioList && this.userPortfolioList.length > 0 ? this.userPortfolioList.find(element => element.portfolioType === MANAGE_INVESTMENTS_CONSTANTS.TOPUP.FUNDING_METHODS.CPF) : null;
    return !Util.isEmptyOrNull(cpfPortfolio);
  }
}
