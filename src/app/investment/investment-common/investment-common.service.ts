import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account/investment-account-service';
import { InvestmentApiService } from '../investment-api.service';
import { SIGN_UP_ROUTE_PATHS } from './../../sign-up/sign-up.routes.constants';
import { IAccountCreationActions, InvestmentCommonFormData } from './investment-common-form-data';
import { INVESTMENT_COMMON_ROUTE_PATHS } from './investment-common-routes.constants';
import { MANAGE_INVESTMENTS_CONSTANTS } from '../manage-investments/manage-investments.constants';

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
    private router: Router
  ) {
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

  setInvAccountStatusInfoToSession(accountCreationStatusInfo: IAccountCreationActions) {
    this.investmentCommonFormData.accountCreationStatusInfo = accountCreationStatusInfo;
    this.commit();
  }

  clearInvAccountStatusInfo() {
    this.investmentCommonFormData.accountCreationStatusInfo = null;
    this.commit();
  }

  getAccountCreationActions(): Observable<IAccountCreationActions> {
    const accStatusInfoFromSession = this.getInvestmentCommonFormData().accountCreationStatusInfo;
    if (accStatusInfoFromSession) {
      return Observable.of(accStatusInfoFromSession);
    } else {
      return this.getFirstInvAccountCreationStatus().map((data: any) => {
        if (data && data.objectList) {
          this.setInvAccountStatusInfoToSession(data.objectList);
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
      if (this.isUsersFirstPortfolio(data)) {// FIRST PORTFOLIO
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
      const dashboardMessage = {
        show: true,
        title: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.TITLE'),
        desc: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_ERROR')
      };
      this.investmentAccountService.setDashboardInitialMessage(dashboardMessage);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    }
  }

  goToAdditionalAccountCreation(data) {
    if (data.portfolioLimitExceeded) { // HAVE LESS THAN 20 PORTFOLIOS?
      const dashboardMessage = {
        show: true,
        title: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.TITLE'),
        desc: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.MAX_PORTFOLIO_LIMIT_ERROR')
      };
      this.investmentAccountService.setDashboardInitialMessage(dashboardMessage);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    } else if (!data.allowEngagementJourney) { // ACCOUNT CREATION PENDING ?
      const dashboardMessage = {
        show: true,
        title: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.TITLE'),
        desc: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_ERROR')
      };
      this.investmentAccountService.setDashboardInitialMessage(dashboardMessage);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
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

  isUsersFirstPortfolio(data: IAccountCreationActions) {
    if (data.showInvestmentAccountCreationForm
        && MANAGE_INVESTMENTS_CONSTANTS.ALLOW_TOPUP_WITHDRAW_GUARD.indexOf(data.accountCreationState) < 0) {
          return true;
    }
    return false;
  }
}
