import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from '../../shared/http/api.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    TransferInstructionsModalComponent
} from '../../shared/modal/transfer-instructions-modal/transfer-instructions-modal.component';
import { SignUpService } from '../../sign-up/sign-up.service';
import { InvestmentAccountFormData } from '../investment-account/investment-account-form-data';
import { InvestmentApiService } from '../investment-api.service';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey/investment-engagement-journey.service';
import { ManageInvestmentsFormData } from './manage-investments-form-data';
import { ManageInvestmentsFormError } from './manage-investments-form-error';
import {
    MANAGE_INVESTMENTS_ROUTE_PATHS
} from './manage-investments-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS } from './manage-investments.constants';
import { TopUPFormError } from './top-up/top-up-form-error';

const SESSION_STORAGE_KEY = 'app_withdraw-session';
@Injectable({
  providedIn: 'root'
})
export class ManageInvestmentsService {

  // transfer instructions
  bankDetails;
  paynowDetails;
  transferInstructionModal;
  activeModal;
  userProfileInfo;

  private manageInvestmentsFormData: ManageInvestmentsFormData = new ManageInvestmentsFormData();
  private investmentAccountFormData: InvestmentAccountFormData = new InvestmentAccountFormData();
  private topUPFormError: any = new TopUPFormError();
  private managementFormError: any = new ManageInvestmentsFormError();

  constructor(
    public readonly translate: TranslateService,
    private http: HttpClient,
    private apiService: ApiService,
    private investmentApiService: InvestmentApiService,
    public authService: AuthenticationService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private router: Router,
    private modal: NgbModal,
    private signUpService: SignUpService
  ) {
    this.getAllDropDownList();
    this.getTopUpFormData();
    this.getTopupInvestmentList();
    this.manageInvestmentsFormData.withdrawMode =
      MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW.DEFAULT_WITHDRAW_MODE;
    this.activeModal = MANAGE_INVESTMENTS_CONSTANTS.TRANSFER_INSTRUCTION.MODE;
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(this.manageInvestmentsFormData)
      );
    }
  }

  // Return the entire Form Data
  getTopUpFormData() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.manageInvestmentsFormData = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE_KEY)
      );
    }
    return this.manageInvestmentsFormData;
  }
  getAllDropDownList() {
    return this.investmentApiService.getAllDropdownList();
  }

  getTopupInvestmentList() {
    return this.investmentApiService.getAllDropdownList();
  }
  getHoldingList() {
    return this.investmentApiService.getHoldingList();
  }
  getPortfolioList() {
    return this.investmentApiService.getPortfolioList();
  }
  getMoreList() {
    return this.investmentApiService.getMoreList();
  }
  getIndividualPortfolioDetails(portfolioId) {
    return this.investmentApiService.getIndividualPortfolioDetails(portfolioId);
  }

  doFinancialValidations(form, allowMonthlyZero) {
    const invalid = [];
    // tslint:disable-next-line:triple-equals
    if (
      Number(form.value.oneTimeInvestmentAmount) < this.manageInvestmentsFormData.minimumBalanceOfTopup
      && form.value.Investment === 'One-time Investment'
    ) {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['zero']);
      return this.topUPFormError.formFieldErrors['topupValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(form.value.MonthlyInvestmentAmount) < this.manageInvestmentsFormData.minimumBalanceOfTopup
      && form.value.Investment === 'Monthly Investment'
      && ( (Number(form.value.MonthlyInvestmentAmount) === 0 && !allowMonthlyZero) || (Number(form.value.MonthlyInvestmentAmount) !== 0))
    ) {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['more']);
      return this.topUPFormError.formFieldErrors['topupValidations']['more'];
      // tslint:disable-next-line:max-line-length
    } else {
      return false;
    }
  }

  // removeCommas(str) {
  // if(str.lenght>3)
  // {
  //   while (str.search(',') >= 0) {
  //     str = (str + '').replace(',', '');
  //   }
  // }
  //   return str;
  // }

  getTopUp() {
    return {
      portfolio: this.manageInvestmentsFormData.portfolio,
      oneTimeInvestmentAmount: this.manageInvestmentsFormData.oneTimeInvestmentAmount,
      MonthlyInvestmentAmount: this.manageInvestmentsFormData.MonthlyInvestmentAmount,
      Investment: this.manageInvestmentsFormData.Investment,
      topupportfolioamount: this.manageInvestmentsFormData.topupportfolioamount
    };
  }
  setTopUp(data) {
    this.manageInvestmentsFormData.portfolio = data.portfolio;
    this.manageInvestmentsFormData.oneTimeInvestmentAmount = data.oneTimeInvestmentAmount;
    this.manageInvestmentsFormData.MonthlyInvestmentAmount = data.MonthlyInvestmentAmount;
    this.manageInvestmentsFormData.Investment = data.Investment;
    this.manageInvestmentsFormData.topupportfolioamount = data.topupportfolioamount;
    this.commit();
  }
  clearTopUpData() {
    this.manageInvestmentsFormData.portfolio = null;
    this.manageInvestmentsFormData.oneTimeInvestmentAmount = null;
    this.manageInvestmentsFormData.MonthlyInvestmentAmount = null;
    this.manageInvestmentsFormData.Investment = null;
    this.commit();
  }
  setInvestmentValue(minimumBalanceOfTopup) {
    this.manageInvestmentsFormData.minimumBalanceOfTopup = minimumBalanceOfTopup;
    this.commit();
  }
  setFundingDetails(fundDetails) {
    this.manageInvestmentsFormData.fundDetails = fundDetails;
    this.commit();
  }

  getFundingDetails() {
    return this.manageInvestmentsFormData.fundDetails;
  }

  getTransferDetails(customerPortfolioId) {
    return this.investmentApiService.getTransferDetails(customerPortfolioId);
  }
  getInvestmentOverview() {
    return this.investmentApiService.getInvestmentOverview();
  }
  deletePortfolio(data) {
    const payload = this.constructDeletePortfolioParams(data);
    return this.investmentApiService.deletePortfolio(payload);
  }

  constructDeletePortfolioParams(data) {
    return {
      portfolioId: data.productCode
    };
  }

  setPortfolioValues(portfolio) {
    this.manageInvestmentsFormData.PortfolioValues = portfolio;
    this.commit();
  }
  getPortfolioValues() {
    return this.manageInvestmentsFormData.PortfolioValues;
  }
  setSelectedPortfolio(portfolio) {
    this.manageInvestmentsFormData.selectedPortfolio = portfolio;
    this.commit();
  }
  getSelectedPortfolio() {
    return this.manageInvestmentsFormData.selectedPortfolio;
  }
  setUserPortfolioList(portfolioList) {
    this.manageInvestmentsFormData.userPortfolios = portfolioList;
    this.commit();
  }
  getUserPortfolioList() {
    return this.manageInvestmentsFormData.userPortfolios;
  }
  setSelectedPortfolioForTopup(portfolio) {
    this.manageInvestmentsFormData.selectedPortfolioForTopup = portfolio;
    this.commit();
  }
  getSelectedPortfolioForTopup(portfolio) {
    return this.manageInvestmentsFormData.selectedPortfolioForTopup;
  }
  setUserCashBalance(amount) {
    this.manageInvestmentsFormData.cashAccountBalance = amount;
    this.commit();
  }
  getUserCashBalance() {
    if (this.manageInvestmentsFormData.cashAccountBalance) {
      return this.manageInvestmentsFormData.cashAccountBalance;
    } else {
      return 0;
    }
  }
  setHoldingValues(holdingList) {
    this.manageInvestmentsFormData.holdingList = holdingList;
    this.commit();
  }
  getHoldingValues() {
    return this.manageInvestmentsFormData.holdingList;
  }
  setAssetAllocationValues(assetAllocationValues) {
    this.manageInvestmentsFormData.assetAllocationValues = assetAllocationValues;
    this.commit();
  }
  getAssetAllocationValues() {
    return this.manageInvestmentsFormData.assetAllocationValues;
  }
  // tslint:disable-next-line
  getFormErrorList(form) {
    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.managementFormError.formFieldErrors.errorTitle;
    for (const name in controls) {
      if (controls[name].invalid) {
        // HAS NESTED CONTROLS ?
        if (controls[name].controls) {
          const nestedControls = controls[name].controls;
          for (const nestedControlName in nestedControls) {
            if (nestedControls[nestedControlName].invalid) {
              // tslint:disable-next-line
              errors.errorMessages.push(
                this.managementFormError.formFieldErrors[nestedControlName][
                  Object.keys(nestedControls[nestedControlName]['errors'])[0]
                ].errorMessage
              );
            }
          }
        } else {
          // NO NESTED CONTROLS
          // tslint:disable-next-line
          errors.errorMessages.push(
            this.managementFormError.formFieldErrors[name][
              Object.keys(controls[name]['errors'])[0]
            ].errorMessage
          );
        }
      }
    }
    return errors;
  }

  setWithdrawalTypeFormData(data, isRedeemAll) {
    this.manageInvestmentsFormData.withdrawType = data.withdrawType;
    this.manageInvestmentsFormData.withdrawAmount = data.withdrawAmount;
    this.manageInvestmentsFormData.withdrawPortfolio = data.withdrawPortfolio;
    this.manageInvestmentsFormData.isRedeemAll = isRedeemAll;
    this.commit();
  }

  getUserBankList() {
    return this.investmentApiService.getUserBankList();
  }

  getUserAddress() {
    return this.investmentApiService.getUserAddress();
  }

  saveNewBank(data) {
    const payload = this.constructSaveNewBankRequest(data);
    return this.apiService.saveNewBank(payload);
  }

  constructSaveNewBankRequest(data) {
    const request = {};
    request['bank'] = data.bank;
    request['accountName'] = data.accountHolderName;
    request['accountNumber'] = data.accountNo;
    return request;
  }
  updateBankInfo(bank, fullName, accountNum, id) {
    // API Call here
    const data = this.constructUpdateBankPayload(bank, fullName, accountNum, id);
    return this.apiService.saveNewBank(data);
  }
  // tslint:disable-next-line:no-identical-functions
  constructUpdateBankPayload(bank, fullName, accountNum, id) {
    const request = {};
    request['id'] = id;
    request['bank'] = bank;
    request['accountName'] = fullName;
    request['accountNumber'] = accountNum;
    return request;
  }

  sellPortfolio(data) {
    const payload = this.constructSellPortfolioRequestParams(data);
    return this.investmentApiService.sellPortfolio(payload);
  }

  constructSellPortfolioRequestParams(data) {
    const request = {};
    request['withdrawType'] = data.withdrawType ? data.withdrawType.value : null;
    request['portfolioId'] = data.withdrawPortfolio
      ? data.withdrawPortfolio.productCode
      : null;
    request['redemptionAmount'] = data.withdrawAmount;
    request['customerBankDetail'] = {
      accountNumber: data.bank ? data.bank.accountNumber : null
    };
    request['redeemAll'] = data.isRedeemAll;
    return request;
  }
  // ONE-TIME INVESTMENT PAYLOAD
  buyPortfolio(data) {
    const payload = this.constructBuyPortfolioParams(data);
    return this.investmentApiService.buyPortfolio(payload);
  }

  constructBuyPortfolioParams(data) {
    let oneTimeInvestment: number;
    oneTimeInvestment = data.oneTimeInvestment;
    return {
      portfolioId: data.portfolio.customerPortfolioId,
      investmentAmount: Number(oneTimeInvestment) // todo
    };
  }

  // MONTHLY INVESTMENT PAYLOAD
  monthlyInvestment(data) {
    const payload = this.constructBuyPortfolioForMonthly(data);
    return this.investmentApiService.monthlyInvestment(payload);
  }

  constructBuyPortfolioForMonthly(data) {
    let monthlyInvestmentAmount: number;
    monthlyInvestmentAmount = data.monthlyInvestment;
    return {
      portfolioId: data.portfolio.customerPortfolioId,
      monthlyInvestmentAmount: Number(monthlyInvestmentAmount)
    };
  }
  getTransactionHistory(from?, to?) {
    return this.investmentApiService.getTransactionHistory(from, to);
  }

  getPortfolioAllocationDetails(params) {
    const urlParams = this.investmentEngagementJourneyService.buildQueryString(params);
    return this.investmentApiService.getPortfolioAllocationDetails(urlParams);
  }

  getMonthListByPeriod(from, to) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    let durationMonths = [];
    const fromYear = from.getFullYear();
    const toYear = to.getFullYear();
    const diffYear = 12 * (toYear - fromYear) + to.getMonth() - 1;
    const initMonth = from.getMonth();
    for (let i = initMonth; i <= diffYear; i++) {
      durationMonths.unshift({
        monthName: monthNames[i % 12],
        year: Math.floor(fromYear + i / 12)
      });
    }

    // GROUPING
    const groups = {};
    for (const month of durationMonths) {
      const groupName = month.year;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(month);
    }
    durationMonths = [];
    for (const groupName in groups) {
      durationMonths.unshift({ year: groupName, months: groups[groupName] });
      // tslint:disable-next-line
    }
    return durationMonths;
  }

  clearFormData() {
    this.manageInvestmentsFormData = new ManageInvestmentsFormData();
    this.commit();
  }

  clearData() {
    this.clearFormData();
    if (window.sessionStorage) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  downloadStatement(data) {
    return this.investmentApiService.downloadStatement(data);
  }

  /*
  * Method to navigate to topup, transactions and withdraw based on menu selection
  */
  showMenu(option) {
    switch (option.id) {
      case 1: {
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
        break;
      }
      case 2: {
        this.bankDetails && this.paynowDetails ? this.showTransferInstructionModal() : '';
        break;
      }
      case 3: {
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TRANSACTION]);
        break;
      }
      case 4: {
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.WITHDRAWAL]);
        break;
      }
    }
  }

  /*
  * Method to get details based on bank or paynow
  */
 setBankPayNowDetails(data) {
  this.bankDetails = data.filter(
    (transferType) => transferType.institutionType === this.translate.instant('TRANSFER_INSTRUCTION.INSTITUTION_TYPE_BANK')
  )[0];
  this.paynowDetails = data.filter(
    (transferType) => transferType.institutionType === this.translate.instant('TRANSFER_INSTRUCTION.INSTITUTION_TYPE_PAY_NOW')
  )[0];
}

  /*
  * Method to show transfer instruction steps modal
  */
  showTransferInstructionModal() {
    this.transferInstructionModal = this.modal.open(TransferInstructionsModalComponent, {
            windowClass : 'transfer-steps-modal custom-full-height'
    });
    this.transferInstructionModal.componentInstance.bankDetails = this.bankDetails;
    this.transferInstructionModal.componentInstance.paynowDetails = this.paynowDetails;
    this.transferInstructionModal.componentInstance.activeMode = this.activeModal;
    this.transferInstructionModal.componentInstance.closeModal.subscribe(() => {
      this.transferInstructionModal.dismiss();
    });
    this.transferInstructionModal.componentInstance.openModal.subscribe(() => {
      this.showPopUp();
    });

    this.transferInstructionModal.componentInstance.activeTab.subscribe((res) => {
      this.activeModal = res;
    });
  }

  /*
  * Method to show recipients/entity name instructions modal
  */
  showPopUp() {
    this.transferInstructionModal.dismiss();
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'TRANSFER_INSTRUCTION.FUNDING_INSTRUCTIONS.MODAL.SHOWPOPUP.TITLE'
    );
    const recipientName = this.activeModal === 'BANK' ? this.bankDetails.receipientName : this.paynowDetails.receipientName;
    ref.componentInstance.errorMessage = recipientName + this.translate.instant(
      'TRANSFER_INSTRUCTION.FUNDING_INSTRUCTIONS.MODAL.SHOWPOPUP.MESSAGE'
    );
    ref.result.then((result) => {
    }, (reason) => {
      this.showTransferInstructionModal();
    });
  }

  getMonthlyInvestmentInfo() {
    return this.investmentApiService.getMonthlyInvestmentInfo();
  }

  getOneTimeInvestmentInfo() {
    return this.investmentApiService.getOneTimeInvestmentInfo();
  }

  getEntitlementsFromPortfolio(portfolio) {
    const userProfileInfo = this.signUpService.getUserProfileInfo();
    const filteredPortfolio = userProfileInfo.investementDetails.portfolios.filter(
      (portfolioItem) => (portfolio && portfolioItem.portfolioId === portfolio.productCode)
    )[0];
    if (filteredPortfolio && filteredPortfolio.entitlements) {
      return filteredPortfolio.entitlements;
    } else {
      return {
        showDelete: false,
        showInvest: false,
        showTopup: false,
        showWithdrawPvToBa: false,
        showWithdrawPvToCa: false,
        showWithdrawCaToBa: true // always allowed irrespective of portfolio status
      };
    }
  }

  setToastMessage(toastMessage) {
    this.manageInvestmentsFormData.toastMessage = toastMessage;
    this.commit();
  }

  activateToastMessage() {
    this.manageInvestmentsFormData.toastMessage.isShown = true;
    this.commit();
  }

  clearToastMessage() {
    this.manageInvestmentsFormData.toastMessage = null;
    this.commit();
  }

  getToastMessage() {
    return this.manageInvestmentsFormData.toastMessage;
  }

  // TOP UP REQUEST
  topUp(data) {
    const payload = this.constructTopUpRequestParams(data);
    return this.investmentApiService.topUpRequest(data.portfolio['customerPortfolioId'], payload);
  }

  constructTopUpRequestParams(data) {
    let investmentAmt: number;
    investmentAmt = data['exceededAmount'];
    let isMonthly = false;
    if (data['fundingType'] === MANAGE_INVESTMENTS_CONSTANTS.FUNDING_INSTRUCTIONS.MONTHLY) {
      isMonthly = true;
    }
    return {
      // transactionId: 1,
      investmentAmount: Number(investmentAmt),
      payMonthly: isMonthly,
      // notifyInsufficientFund: true
    };
  }
}
