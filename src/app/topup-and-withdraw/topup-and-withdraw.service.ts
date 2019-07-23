import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';

import { InvestmentAccountFormData } from '../investment-account/investment-account-form-data';
import { PortfolioService } from '../portfolio/portfolio.service';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { TransferInstructionsModalComponent } from '../shared/modal/transfer-instructions-modal/transfer-instructions-modal.component';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../topup-and-withdraw/topup-and-withdraw-routes.constants';
import { TopUPFormError } from './top-up/top-up-form-error';
import { TopUpAndWithdrawFormData } from './topup-and-withdraw-form-data';
import { TopUpAndWithdrawFormError } from './topup-and-withdraw-form-error';
import { TOPUPANDWITHDRAW_CONFIG } from './topup-and-withdraw.constants';
import { SignUpService } from '../sign-up/sign-up.service';

const SESSION_STORAGE_KEY = 'app_withdraw-session';
@Injectable({
  providedIn: 'root'
})
export class TopupAndWithDrawService {

  // transfer instructions
  bankDetails;
  paynowDetails;
  transferInstructionModal;
  activeModal;
  userProfileInfo;

  private topUpAndWithdrawFormData: TopUpAndWithdrawFormData = new TopUpAndWithdrawFormData();
  private investmentAccountFormData: InvestmentAccountFormData = new InvestmentAccountFormData();
  private topUPFormError: any = new TopUPFormError();
  private topUpAndWithdrawFormError: any = new TopUpAndWithdrawFormError();

  constructor(
    public readonly translate: TranslateService,
    private http: HttpClient,
    private apiService: ApiService,
    public authService: AuthenticationService,
    public portfolioService: PortfolioService,
    private router: Router,
    private modal: NgbModal,
    private signUpService: SignUpService
  ) {
    this.getAllDropDownList();
    this.getTopUpFormData();
    this.getTopupInvestmentList();
    this.topUpAndWithdrawFormData.withdrawMode =
      TOPUPANDWITHDRAW_CONFIG.WITHDRAW.DEFAULT_WITHDRAW_MODE;
    this.activeModal = TOPUPANDWITHDRAW_CONFIG.TRANSFER_INSTRUCTION.MODE;
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(this.topUpAndWithdrawFormData)
      );
    }
  }

  // Return the entire Form Data
  getTopUpFormData() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.topUpAndWithdrawFormData = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE_KEY)
      );
    }
    return this.topUpAndWithdrawFormData;
  }
  getAllDropDownList() {
    return this.apiService.getAllDropdownList();
  }

  getTopupInvestmentList() {
    return this.apiService.getAllDropdownList();
  }
  getHoldingList() {
    return this.apiService.getHoldingList();
  }
  getPortfolioList() {
    return this.apiService.getPortfolioList();
  }
  getMoreList() {
    return this.apiService.getMoreList();
  }
  getIndividualPortfolioDetails(portfolioId) {
    return this.apiService.getIndividualPortfolioDetails(portfolioId);
  }

  doFinancialValidations(form, allowMonthlyZero) {
    const invalid = [];
    // tslint:disable-next-line:triple-equals
    if (
      Number(form.value.oneTimeInvestmentAmount) < this.topUpAndWithdrawFormData.minimumBalanceOfTopup
      && form.value.Investment === 'One-time Investment'
    ) {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['zero']);
      return this.topUPFormError.formFieldErrors['topupValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(form.value.MonthlyInvestmentAmount) < this.topUpAndWithdrawFormData.minimumBalanceOfTopup
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
      portfolio: this.topUpAndWithdrawFormData.portfolio,
      oneTimeInvestmentAmount: this.topUpAndWithdrawFormData.oneTimeInvestmentAmount,
      MonthlyInvestmentAmount: this.topUpAndWithdrawFormData.MonthlyInvestmentAmount,
      Investment: this.topUpAndWithdrawFormData.Investment,
      topupportfolioamount: this.topUpAndWithdrawFormData.topupportfolioamount
    };
  }
  setTopUp(data) {
    this.topUpAndWithdrawFormData.portfolio = data.portfolio;
    this.topUpAndWithdrawFormData.oneTimeInvestmentAmount = data.oneTimeInvestmentAmount;
    this.topUpAndWithdrawFormData.MonthlyInvestmentAmount = data.MonthlyInvestmentAmount;
    this.topUpAndWithdrawFormData.Investment = data.Investment;
    this.topUpAndWithdrawFormData.topupportfolioamount = data.topupportfolioamount;
    this.commit();
  }
  clearTopUpData() {
    this.topUpAndWithdrawFormData.portfolio = null;
    this.topUpAndWithdrawFormData.oneTimeInvestmentAmount = null;
    this.topUpAndWithdrawFormData.MonthlyInvestmentAmount = null;
    this.topUpAndWithdrawFormData.Investment = null;
    this.commit();
  }
  setInvestmentValue(minimumBalanceOfTopup) {
    this.topUpAndWithdrawFormData.minimumBalanceOfTopup = minimumBalanceOfTopup;
    this.commit();
  }
  setFundingDetails(fundDetails) {
    this.topUpAndWithdrawFormData.fundDetails = fundDetails;
    this.commit();
  }

  getFundingDetails() {
    return this.topUpAndWithdrawFormData.fundDetails;
  }

  getTransferDetails() {
    return this.apiService.getTransferDetails();
  }
  getInvestmentOverview() {
    return this.apiService.getInvestmentOverview();
  }
  deletePortfolio(data) {
    const payload = this.constructDeletePortfolioParams(data);
    return this.apiService.deletePortfolio(payload);
  }

  constructDeletePortfolioParams(data) {
    return {
      portfolioId: data.productCode
    };
  }

  setPortfolioValues(portfolio) {
    this.topUpAndWithdrawFormData.PortfolioValues = portfolio;
    this.commit();
  }
  getPortfolioValues() {
    return this.topUpAndWithdrawFormData.PortfolioValues;
  }
  setSelectedPortfolio(portfolio) {
    this.topUpAndWithdrawFormData.selectedPortfolio = portfolio;
    this.commit();
  }
  getSelectedPortfolio() {
    return this.topUpAndWithdrawFormData.selectedPortfolio;
  }
  setUserPortfolioList(portfolioList) {
    this.topUpAndWithdrawFormData.userPortfolios = portfolioList;
    this.commit();
  }
  getUserPortfolioList() {
    return this.topUpAndWithdrawFormData.userPortfolios;
  }
  setSelectedPortfolioForTopup(portfolio) {
    this.topUpAndWithdrawFormData.selectedPortfolioForTopup = portfolio;
    this.commit();
  }
  getSelectedPortfolioForTopup(portfolio) {
    return this.topUpAndWithdrawFormData.selectedPortfolioForTopup;
  }
  setUserCashBalance(amount) {
    this.topUpAndWithdrawFormData.cashAccountBalance = amount;
    this.commit();
  }
  getUserCashBalance() {
    if (this.topUpAndWithdrawFormData.cashAccountBalance) {
      return this.topUpAndWithdrawFormData.cashAccountBalance;
    } else {
      return 0;
    }
  }
  setHoldingValues(holdingList) {
    this.topUpAndWithdrawFormData.holdingList = holdingList;
    this.commit();
  }
  getHoldingValues() {
    return this.topUpAndWithdrawFormData.holdingList;
  }
  setAssetAllocationValues(assetAllocationValues) {
    this.topUpAndWithdrawFormData.assetAllocationValues = assetAllocationValues;
    this.commit();
  }
  getAssetAllocationValues() {
    return this.topUpAndWithdrawFormData.assetAllocationValues;
  }
  // tslint:disable-next-line
  getFormErrorList(form) {
    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.topUpAndWithdrawFormError.formFieldErrors.errorTitle;
    for (const name in controls) {
      if (controls[name].invalid) {
        // HAS NESTED CONTROLS ?
        if (controls[name].controls) {
          const nestedControls = controls[name].controls;
          for (const nestedControlName in nestedControls) {
            if (nestedControls[nestedControlName].invalid) {
              // tslint:disable-next-line
              errors.errorMessages.push(
                this.topUpAndWithdrawFormError.formFieldErrors[nestedControlName][
                  Object.keys(nestedControls[nestedControlName]['errors'])[0]
                ].errorMessage
              );
            }
          }
        } else {
          // NO NESTED CONTROLS
          // tslint:disable-next-line
          errors.errorMessages.push(
            this.topUpAndWithdrawFormError.formFieldErrors[name][
              Object.keys(controls[name]['errors'])[0]
            ].errorMessage
          );
        }
      }
    }
    return errors;
  }

  setWithdrawalTypeFormData(data, isRedeemAll) {
    this.topUpAndWithdrawFormData.withdrawType = data.withdrawType;
    this.topUpAndWithdrawFormData.withdrawAmount = data.withdrawAmount;
    this.topUpAndWithdrawFormData.withdrawPortfolio = data.withdrawPortfolio;
    this.topUpAndWithdrawFormData.isRedeemAll = isRedeemAll;
    this.commit();
  }

  getUserBankList() {
    return this.apiService.getUserBankList();
  }

  getUserAddress() {
    return this.apiService.getUserAddress();
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
    return this.apiService.sellPortfolio(payload);
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
    return this.apiService.buyPortfolio(payload);
  }

  constructBuyPortfolioParams(data) {
    let oneTimeInvestment: number;
    oneTimeInvestment = data.oneTimeInvestment;
    return {
      portfolioId: data.portfolio.productCode,
      investmentAmount: Number(oneTimeInvestment) // todo
    };
  }

  // MONTHLY INVESTMENT PAYLOAD
  monthlyInvestment(data) {
    const payload = this.constructBuyPortfolioForMonthly(data);
    return this.apiService.monthlyInvestment(payload);
  }

  constructBuyPortfolioForMonthly(data) {
    let monthlyInvestmentAmount: number;
    monthlyInvestmentAmount = data.monthlyInvestment;
    return {
      portfolioId: data.portfolio.productCode,
      monthlyInvestmentAmount: Number(monthlyInvestmentAmount)
    };
  }
  getTransactionHistory(from?, to?) {
    return this.apiService.getTransactionHistory(from, to);
  }

  getPortfolioAllocationDetails(params) {
    const urlParams = this.portfolioService.buildQueryString(params);
    return this.apiService.getPortfolioAllocationDetails(urlParams);
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
    this.topUpAndWithdrawFormData = new TopUpAndWithdrawFormData();
    this.commit();
  }

  clearData() {
    this.clearFormData();
    if (window.sessionStorage) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  downloadStatement(data) {
    return this.apiService.downloadStatement(data);
  }

  /*
  * Method to navigate to topup, transactions and withdraw based on menu selection
  */
  showMenu(option) {
    switch (option.id) {
      case 1: {
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP]);
        break;
      }
      case 2: {
        this.bankDetails && this.paynowDetails ? this.showTransferInstructionModal() : '';
        break;
      }
      case 3: {
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TRANSACTION]);
        break;
      }
      case 4: {
        this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.WITHDRAWAL]);
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
      'TRANSFER_INSTRUCTION.FUND_YOUR_ACCOUNT.MODAL.SHOWPOPUP.TITLE'
    );
    const recipientName = this.activeModal === 'BANK' ? this.bankDetails.receipientName : this.paynowDetails.receipientName;
    ref.componentInstance.errorMessage = recipientName + this.translate.instant(
      'TRANSFER_INSTRUCTION.FUND_YOUR_ACCOUNT.MODAL.SHOWPOPUP.MESSAGE'
    );
    ref.result.then((result) => {
    }, (reason) => {
      this.showTransferInstructionModal();
    });
  }

  getMonthlyInvestmentInfo() {
    return this.apiService.getMonthlyInvestmentInfo();
  }

  getEntitlementsFromPortfolio(portfolio) {
    const userProfileInfo = this.signUpService.getUserProfileInfo();
    const filteredPortfolio = userProfileInfo.investementDetails.portfolios.filter(
      (portfolioItem) => portfolioItem.portfolioId === portfolio.productCode
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
}
