
import {of as observableOf,  Observable, Subject } from 'rxjs';

import {map} from 'rxjs/operators';
import { conformToMask } from 'text-mask-core';

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
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { InvestmentAccountFormData } from '../investment-account/investment-account-form-data';
import { InvestmentAccountService } from '../investment-account/investment-account-service';
import { InvestmentApiService } from '../investment-api.service';
import {
  InvestmentEngagementJourneyService
} from '../investment-engagement-journey/investment-engagement-journey.service';
import { INVESTMENT_COMMON_CONSTANTS } from './../investment-common/investment-common.constants';
import { ISrsAccountDetails, ManageInvestmentsFormData } from './manage-investments-form-data';
import { ManageInvestmentsFormError } from './manage-investments-form-error';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from './manage-investments-routes.constants';
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
  formatedAccountNumber;
  private manageInvestmentsFormData: ManageInvestmentsFormData = new ManageInvestmentsFormData();
  private investmentAccountFormData: InvestmentAccountFormData = new InvestmentAccountFormData();
  private topUPFormError: any = new TopUPFormError();
  private managementFormError: any = new ManageInvestmentsFormError();
  selectedPortfolioCategory = INVESTMENT_COMMON_CONSTANTS.PORTFOLIO_CATEGORY.ALL;
  copyToastSubject = new Subject();

  constructor(
    public readonly translate: TranslateService,
    private http: HttpClient,
    private apiService: ApiService,
    private investmentApiService: InvestmentApiService,
    public authService: AuthenticationService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentAccountService: InvestmentAccountService,
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

  getSrsFormData(): ISrsAccountDetails {
    return this.manageInvestmentsFormData.srsAccountDetails;
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
  getCustomerPortfolioDetailsById(portfolioId) {
    return this.investmentApiService.getCustomerPortfolioDetailsById(portfolioId);
  }

  doFinancialValidations(form, allowMonthlyZero) {
    const invalid = [];
    // tslint:disable-next-line:triple-equals
    if (
      Number(form.value.oneTimeInvestmentAmount) < this.manageInvestmentsFormData.minimumBalanceOfTopup
      && form.value.Investment === MANAGE_INVESTMENTS_CONSTANTS.TOPUP.TOPUP_TYPES.ONE_TIME.VALUE
    ) {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['zero']);
      return this.topUPFormError.formFieldErrors['topupValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(form.value.MonthlyInvestmentAmount) < this.manageInvestmentsFormData.minimumBalanceOfTopup
      && form.value.Investment ===  MANAGE_INVESTMENTS_CONSTANTS.TOPUP.TOPUP_TYPES.MONTHLY.VALUE
      && ((Number(form.value.MonthlyInvestmentAmount) === 0 && !allowMonthlyZero) || (Number(form.value.MonthlyInvestmentAmount) !== 0))
    ) {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['more']);
      return this.topUPFormError.formFieldErrors['topupValidations']['more'];
      // tslint:disable-next-line:max-line-length
    } else {
      return false;
    }
  }

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
      customerPortfolioId: data.customerPortfolioId
    };
  }

  setUserPortfolioList(portfolioList) {
    this.manageInvestmentsFormData.userPortfolios = portfolioList;
    this.commit();
  }
  // GET CCASH PORTFOLIO LIST//

   getCashPortfolioList() { 
    const CashPortfolioList = [];
    this.manageInvestmentsFormData.userPortfolios.forEach(portfolio => {
      if (portfolio.portfolioType === 'Cash' && portfolio.cashAccountBalance) {
        CashPortfolioList.push(portfolio);
        CashPortfolioList.sort((a, b) => {
          return a.portfolioName.toLowerCase().localeCompare(b.portfolioName.toLowerCase());
        });
      }
    });
    return CashPortfolioList;
   }

  getUserPortfolioList() {
    // Sort portfolio by ascending alphabetical order order
    const sortedArray = this.manageInvestmentsFormData.userPortfolios.sort((a, b) => {
      return a.portfolioName.toLowerCase().localeCompare(b.portfolioName.toLowerCase());
    });
    return sortedArray;
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
  
  clearWithdrawalTypeFormData() {
    this.manageInvestmentsFormData.withdrawType = null;
    this.manageInvestmentsFormData.withdrawAmount = null;
    this.manageInvestmentsFormData.withdrawPortfolio = null;
    this.manageInvestmentsFormData.isRedeemAll = null;
    this.commit();
  }

  getUserBankList() {
    return this.investmentApiService.getUserBankList();
  }

  getUserAddress() {
    return this.investmentApiService.getUserAddress();
  }

  saveProfileNewBank(data) {
    const payload = this.constructSaveNewBankRequest(data);
    return this.apiService.saveNewBankProfile(payload);
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
    return this.apiService.saveNewBankProfile(data);
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
    return this.investmentApiService.sellPortfolio(data.withdrawPortfolio.customerPortfolioId, payload);
  }
 
  constructSellPortfolioRequestParams(data) {
    const request = {};
    request['withdrawType'] = data.withdrawType ? data.withdrawType.value : null;
    request['redemptionAmount'] = data.withdrawAmount;
    request['customerBankDetail'] = {
      accountNumber: data.bankAccountNo ? data.bankAccountNo : null
    };
    request['redeemAll'] = data.isRedeemAll;
    return request;
  }
  // ONE-TIME INVESTMENT PAYLOAD
  buyPortfolio(data) {
    const payload = this.constructBuyPortfolioParams(data);
    return this.investmentApiService.buyPortfolio(data['portfolio']['customerPortfolioId'], payload);
  }

  constructBuyPortfolioParams(data) {
    let oneTimeInvestment: number;
    oneTimeInvestment = data.oneTimeInvestment;
    return {
      investmentAmount: Number(oneTimeInvestment) // todo
    };
  }

  // MONTHLY INVESTMENT PAYLOAD
  monthlyInvestment(data) {
    const payload = this.constructBuyPortfolioForMonthly(data);
    return this.investmentApiService.monthlyInvestment(data['portfolio']['customerPortfolioId'], payload);
  }

  constructBuyPortfolioForMonthly(data) {
    let monthlyInvestmentAmount: number;
    monthlyInvestmentAmount = data.monthlyInvestment;
    return {
      monthlyInvestmentAmount: Number(monthlyInvestmentAmount)
    };
  }
  getTransactionHistory(id) { 
    return this.investmentApiService.getTransactionHistory(id);
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

  downloadStatement(data, id) {
    return this.investmentApiService.downloadStatement(data, id);
  }

  /*
  * Method to get details based on bank or paynow
  */
  setBankPayNowDetails(data) {
    if (data) {
      this.bankDetails = data.filter(
        (transferType) => transferType.institutionType === this.translate.instant('TRANSFER_INSTRUCTION.INSTITUTION_TYPE_BANK')
      )[0];
      this.paynowDetails = data.filter(
        (transferType) => transferType.institutionType === this.translate.instant('TRANSFER_INSTRUCTION.INSTITUTION_TYPE_PAY_NOW')
      )[0];
    }
  }

  /*
  * Method to show transfer instruction steps modal
  */
  showTransferInstructionModal(numberOfPendingRequest) {
    this.transferInstructionModal = this.modal.open(TransferInstructionsModalComponent, {
      windowClass: 'transfer-steps-modal custom-full-height'
    });
    this.transferInstructionModal.componentInstance.bankDetails = this.bankDetails;
    this.transferInstructionModal.componentInstance.paynowDetails = this.paynowDetails;
    this.transferInstructionModal.componentInstance.activeMode = this.activeModal;
    this.transferInstructionModal.componentInstance.numberOfPendingReq = numberOfPendingRequest;
    this.transferInstructionModal.componentInstance.closeModal.subscribe(() => {
      this.transferInstructionModal.dismiss();
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
    });
    this.transferInstructionModal.componentInstance.openModal.subscribe(() => {
      this.showPopUp(numberOfPendingRequest);
    });

    this.transferInstructionModal.componentInstance.activeTab.subscribe((res) => {
      this.activeModal = res;
    });
    this.transferInstructionModal.componentInstance.topUpActionBtn.subscribe(() => {
      this.transferInstructionModal.dismiss();
      this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.TOPUP]);
    });

    this.transferInstructionModal.componentInstance.showCopied.subscribe(() => {
      const toasterMsg = {
        desc: this.translate.instant('TRANSFER_INSTRUCTION.COPIED')
      };
      this.copyToastSubject.next(toasterMsg);
    });
  }

  /*
  * Method to show recipients/entity name instructions modal
  */
  showPopUp(numberOfPendingRequest) {
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
      this.showTransferInstructionModal(numberOfPendingRequest);
    });
  }

  getMonthlyInvestmentInfo(customerPortfolioId) {
    return this.investmentApiService.getMonthlyInvestmentInfo(customerPortfolioId);
  }

  setToastMessage(toastMessage) {
    this.manageInvestmentsFormData.toastMessage = toastMessage;
    this.commit();
  }

  activateToastMessage() {
    if (this.manageInvestmentsFormData.toastMessage) {
      this.manageInvestmentsFormData.toastMessage.isShown = true;
      this.commit();
    }
  }

  clearToastMessage() {
    this.manageInvestmentsFormData.toastMessage = null;
    this.commit();
  }

  getToastMessage() {
    return this.manageInvestmentsFormData.toastMessage;
  }

  setSelectedCustomerPortfolioId(id) {
    this.manageInvestmentsFormData.selectedCustomerPortfolioId = id;
    this.commit();
  }

  setSelectedCustomerPortfolio(portfolio) {
    this.manageInvestmentsFormData.selectedCustomerPortfolio = portfolio;
    this.commit();
  }

  getSelectedCustomerPortfolio() {
    return this.manageInvestmentsFormData.selectedCustomerPortfolio;
  }

  // Update new portfolio name for specific customer portfolio
  updateNewPortfolioName(customerPortfolioId, newPortfolioName) {
    this.manageInvestmentsFormData.userPortfolios.find((portfolio) => {
      if (portfolio.customerPortfolioId === customerPortfolioId) {
        portfolio.portfolioName = newPortfolioName;
      }
    });
    this.commit();
  }
  // SRS Onetime Request
  getAwaitingOrPendingInfo(customerProfileId, awaitingOrPendingParam) {
    return this.investmentApiService.getAwaitingOrPendingInfo(customerProfileId, awaitingOrPendingParam);
  }
  // # SRS Formate Account number
  srsAccountFormat(accountNumber, srsOperator) {
    this.formatedAccountNumber = '';
    switch (srsOperator.toUpperCase()) {
      case MANAGE_INVESTMENTS_CONSTANTS.TOPUP.SRS_OPERATOR.DBS:
        this.formatedAccountNumber = conformToMask(
          accountNumber,
          RegexConstants.operatorMask.DBS,
          { guide: false });
        break;
      case MANAGE_INVESTMENTS_CONSTANTS.TOPUP.SRS_OPERATOR.OCBC:
        this.formatedAccountNumber = conformToMask(
          accountNumber,
          RegexConstants.operatorMask.OCBC,
          { guide: false });
        break;
      case MANAGE_INVESTMENTS_CONSTANTS.TOPUP.SRS_OPERATOR.UOB:
        this.formatedAccountNumber = conformToMask(
          accountNumber,
          RegexConstants.operatorMask.UOB,
          { guide: false });
        break;
    }
    return this.formatedAccountNumber;
  }

  getSrsAccountDetails(): Observable<ISrsAccountDetails> {
    return this.investmentApiService.getSrsAccountDetails().pipe(map((data: any) => {
      if (data && data.objectList && data.objectList.accountNumber &&
        data.objectList.srsBankOperator && data.objectList.srsBankOperator.name) {
        const srsAccountDetails = {
          // srsAccountNumber: data.objectList.accountNumber,
          srsAccountNumber: this.srsAccountFormat(data.objectList.accountNumber, data.objectList.srsBankOperator.name),
          srsOperator: data.objectList.srsBankOperator.name,
          customerId: data.objectList.customerId
        };
        this.setSrsAccountDetails(srsAccountDetails);
        return srsAccountDetails;
      } else {
        return null;
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      }));
  }

  getProfileSrsAccountDetails(): Observable<ISrsAccountDetails> {
    return this.investmentApiService.getProfileSrsAccountDetails().pipe(map((data: any) => {
      if (data && data.objectList && data.objectList.accountNumber &&
        data.objectList.srsBankOperator && data.objectList.srsBankOperator.name) {
        const srsAccountDetails = {
          // srsAccountNumber: data.objectList.accountNumber,
          srsAccountNumber: this.srsAccountFormat(data.objectList.accountNumber, data.objectList.srsBankOperator.name),
          srsOperator: data.objectList.srsBankOperator.name,
          srsOperatorId: data.objectList.srsBankOperator.id,
          customerId: data.objectList.customerId
        };
        this.setSrsAccountDetails(srsAccountDetails);
        return srsAccountDetails;
      } else {
        return null;
      }
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      }));
  }

  setSrsAccountDetails(srsAccountDetails: ISrsAccountDetails) {
    this.manageInvestmentsFormData.srsAccountDetails = srsAccountDetails;
    this.commit();
  }

  getInvestmentNoteFromApi() {
    return this.investmentApiService.getInvestmentNoteFromApi();
  }

  getAllNotes(noteInSession): Observable<any> {
    if (noteInSession) {
      return observableOf(noteInSession);
    } else {
      return this.getInvestmentNoteFromApi().pipe(map((data: any) => {
        if (data) {
          this.setInvestmentNoteToSession(data.objectList);
          return data.objectList;
        }
      }));
    }
  }

  setInvestmentNoteToSession(note: any) {
    this.manageInvestmentsFormData.investmentNote = note;
    this.commit();
  }

  setSrsSuccessFlag(isSrsAccountUpdated) {
    this.manageInvestmentsFormData.isSrsAccountUpdated = isSrsAccountUpdated;
    this.commit();
  }
  getSrsSuccessFlag() {
    return this.manageInvestmentsFormData.isSrsAccountUpdated;
  }

  setSelectedPortfolioCategory(category) {
    this.selectedPortfolioCategory = category;
  }
  // Get Mock for Transfer Data
  getTransferEntityList(customerPortfolioId) {
    return this.investmentApiService.getTransferEntityList(customerPortfolioId);
  }

  getTransferCashPortfolioList() {
    return this.investmentApiService.getTransferCashPortfolioList();
  }

  TransferCash(data) {
    const payload = this.constructTransferCashParams(data);
    return this.investmentApiService.TransferCash(payload);
  }
  constructTransferCashParams(data) {
    const request = {};
    request['sourceRefNo'] = data.transferFrom.refno;
    request['destinationRefNo'] = data.transferTo.refno;
    request['amount'] = parseFloat(data.transferAmount) ;
    request['transferAll'] = data.TransferAll === true ? 'Y' : 'N';
    return request;
   }
  setTransferFormData(data ,TransferAll) {
    if(data &&data.transferFrom && data.transferTo){
      this.manageInvestmentsFormData.transferFrom = data.transferFrom;
      this.manageInvestmentsFormData.transferTo = data.transferTo;
      this.manageInvestmentsFormData.transferAmount = data.transferAmount;
      this.manageInvestmentsFormData.TransferAll =TransferAll;
      this.commit();
    }
   
  }
  clearSetTransferData() {
    this.manageInvestmentsFormData.transferFrom = null;
      this.manageInvestmentsFormData.transferTo = null;
      this.manageInvestmentsFormData.transferAmount = null;
      this.manageInvestmentsFormData.TransferAll =null;
     this.commit();
  }
  //
  getWrapFeeDetails(customerId) {
    const payload = {
      customer_id: customerId,
   };
    return this.investmentApiService.getWrapFeeDetails(payload);
  }
  // User both person Investment and Joint Account
  isInvestAndJointAccount() {
    const investAndJointAccountList = [];
    let isInvestAndJointAccountHolder = false;
    this.manageInvestmentsFormData.userPortfolios.forEach(portfolio => {
      if (portfolio.entitlements && portfolio.entitlements.jointAccount) {
        investAndJointAccountList.push(portfolio);
      }
      isInvestAndJointAccountHolder = investAndJointAccountList.length > 0 ? true : false;
    });
    return isInvestAndJointAccountHolder;
  }
}
