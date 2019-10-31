import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account/investment-account-service';
import { InvestmentApiService } from '../investment-api.service';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey/investment-engagement-journey.service';
import { IAccountCreationActions, InvestmentCommonFormData } from './investment-common-form-data';
import { INVESTMENT_COMMON_ROUTE_PATHS } from './investment-common-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from './investment-common.constants';

const SESSION_STORAGE_KEY = 'app_inv_common_session';
@Injectable({
  providedIn: 'root'
})
export class InvestmentCommonService {

  constructor(
    private investmentCommonFormData: InvestmentCommonFormData,
    private investmentApiService: InvestmentApiService,
    private investmentAccountService: InvestmentAccountService,
    private translate: TranslateService,
    private router: Router,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService
  ) {
    this.getInvestmentCommonFormData();
  }
  savePortfolioName(data) {
    return this.investmentApiService.savePortfolioName(data);
  }

  confirmPortfolio(customerPortfolioId) {
    return this.investmentApiService.confirmPortfolio(customerPortfolioId);
  }
  // Return the entire Form Data
  getInvestmentCommonFormData() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.investmentCommonFormData = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE_KEY)
      );
    }
    return this.investmentCommonFormData;
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(this.investmentCommonFormData)
      );
    }
  }

  clearData() {
    this.clearInvestmentCommonFormData();
    if (window.sessionStorage) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  clearInvestmentCommonFormData() {
    this.investmentCommonFormData = new InvestmentCommonFormData();
    this.commit();
  }

  setAccountCreationActionsToSession(accountCreationActions: IAccountCreationActions) {
    this.investmentCommonFormData.accountCreationActions = accountCreationActions;
    this.commit();
  }

  clearAccountCreationActions() {
    this.investmentCommonFormData.accountCreationActions = null;
    this.commit();
  }

  getAccountCreationActions(): Observable<IAccountCreationActions> {
    const accStatusInfoFromSession = this.getInvestmentCommonFormData().accountCreationActions;
    if (accStatusInfoFromSession) {
      return Observable.of(accStatusInfoFromSession);
    } else {
      return this.getFirstInvAccountCreationStatus().map((data: any) => {
        if (data && data.objectList) {
          this.setAccountCreationActionsToSession(data.objectList);
          return {
            accountCreationState: data.objectList.accountCreationState,
            allowEngagementJourney: data.objectList.allowEngagementJourney,
            portfolioLimitExceeded: data.objectList.portfolioLimitExceeded,
            showInvestmentAccountCreationForm: data.objectList.showInvestmentAccountCreationForm
          };
        } else {
          this.investmentAccountService.showGenericErrorModal();
        }
      },
        (err) => {
          this.investmentAccountService.showGenericErrorModal();
        });
    }
  }

  getFirstInvAccountCreationStatus() {
    return this.investmentApiService.getFirstInvAccountCreationStatus();
  }

  /* Login Redirection Logic */
  redirectToInvestmentFromLogin() {
    this.getAccountCreationActions().subscribe((data: IAccountCreationActions) => {
      if (this.isUserNotAllowed(data)) {
        this.goToDashboard();
      } else if (this.isUsersFirstPortfolio(data)) {// FIRST PORTFOLIO
        this.goToFirstAccountCreation(data);
      } else { // SECOND PORTFOLIO
        this.goToAdditionalAccountCreation(data);
      }
    });
  }

  goToFirstAccountCreation(data) {
    if (data.allowEngagementJourney) { // ACCOUNT CREATION NOT PENDING ?
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.START]);
    } else {
      this.goToDashboard('INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_TITLE',
        'INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_ERROR');
    }
  }

  goToAdditionalAccountCreation(data) {
    if (data.portfolioLimitExceeded) { // HAVE LESS THAN 20 PORTFOLIOS?
      this.goToDashboard('INVESTMENT_ADD_PORTFOLIO_ERROR.MAX_PORTFOLIO_LIMIT_TITLE',
        'INVESTMENT_ADD_PORTFOLIO_ERROR.MAX_PORTFOLIO_LIMIT_ERROR');
    } else if (!data.allowEngagementJourney) { // ACCOUNT CREATION PENDING ?
      this.goToDashboard('INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_TITLE',
        'INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_ERROR');
    } else {
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ACKNOWLEDGEMENT]);
    }
  }

  setInvestmentsSummary(investmentsSummary) {
    this.investmentCommonFormData.investmentsSummary = investmentsSummary;
    this.commit();
  }

  getInvestmentStatus() {
    const investmentsSummary = this.investmentCommonFormData.investmentsSummary;
    const investmentStatus = investmentsSummary && investmentsSummary.investmentAccountStatus &&
      investmentsSummary.investmentAccountStatus.accountCreationState ?
      investmentsSummary.investmentAccountStatus.accountCreationState.toUpperCase() : null;
    return investmentStatus;
  }

  setConfirmPortfolioName(data) {
    this.investmentCommonFormData.portfolioName = data;
    this.commit();
  }

  getConfirmPortfolioName() {
    return this.investmentCommonFormData.portfolioName;
  }

  clearConfirmPortfolioName() {
    this.investmentCommonFormData.portfolioName = null;
    this.commit();
  }

  isUsersFirstPortfolio(data: IAccountCreationActions) {
    if (data.showInvestmentAccountCreationForm
      && INVESTMENT_COMMON_CONSTANTS.FIRST_PORTFOLIO_GUARD.indexOf(data.accountCreationState) < 0) {
      return true;
    }
    return false;
  }

  isUserNotAllowed(data: IAccountCreationActions) {
    if (INVESTMENT_COMMON_CONSTANTS.NOT_ALLOW_USER_GUARD.indexOf(data.accountCreationState) >= 0) {
      return true;
    }
    return false;
  }

  clearJourneyData() {
    this.investmentEngagementJourneyService.clearData();
    this.clearAccountCreationActions();
  }

  goToDashboard(title?, error?) {
    if (title && error) {
      const dashboardMessage = {
        show: true,
        title: this.translate.instant(title),
        desc: this.translate.instant(error)
      };
      this.investmentAccountService.setDashboardInitialMessage(dashboardMessage);
    }
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
  }
  getInitialFundingMethod() {
    return {
    initialFundingMethodId: this.investmentCommonFormData.initialFundingMethodId
    };
  }
  setInitialFundingMethod(data) {
    this.investmentCommonFormData.initialFundingMethodId = data.initialFundingMethodId;
    this.commit();
  }
  setConfirmedFundingMethod(data) {
    this.investmentCommonFormData.confirmedFundingMethodId = data.confirmedFundingMethodId;
    this.commit();
  }
  getConfirmedFundingMethodName() {
    return this.investmentCommonFormData.fundingType;
  }
  clearConfirmedFundingMethod() {
    this.investmentCommonFormData.confirmedFundingMethodId = null;
    this.commit();
  }
  // tslint:disable-next-line:no-identical-functions
  getFundingAccountDetails() {
    return {
      fundingAccountMethod: this.investmentCommonFormData.confirmedFundingMethodId,
      srsOperatorBank: this.investmentCommonFormData.srsOperatorBank,
      srsAccountNumber: this.investmentCommonFormData.srsAccountNumber
    };
  }
  setFundingAccountDetails(data, fundingType) {
    this.investmentCommonFormData.fundingType = fundingType;
    this.investmentCommonFormData.confirmedFundingMethodId = data.confirmedFundingMethodId;
    this.investmentCommonFormData.srsOperatorBank = data.srsFundingDetails ? data.srsFundingDetails.srsOperatorBank : null;
    this.investmentCommonFormData.srsAccountNumber = data.srsFundingDetails ? data.srsFundingDetails.srsAccountNumber : null;
    this.commit();
  }

  //  saving Funding data
  saveFundingMethodDetails() {
    const data = this.constructFundingMethodSaveRequest();
    return this.investmentApiService.saveFundingMethodDetails(data);
  }
 
  constructFundingMethodSaveRequest() {
    const formData = this.getFundingAccountDetails();
    return {
      fundTypeId : formData.fundingAccountMethod,
      srsDetails: {
        srsOperatorBank: formData.srsOperatorBank,
        accountNumber: formData.srsAccountNumber,
      },
    };
  }

  saveSrsAccountDetails(params, customerPortfolioId) {
    return this.investmentApiService.saveSrsAccountDetails(params, customerPortfolioId);
  }

}
