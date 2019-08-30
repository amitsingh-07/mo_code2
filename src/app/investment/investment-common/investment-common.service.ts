import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from '../../shared/http/api.service';
import { InvestmentAccountFormData } from '../investment-account/investment-account-form-data';

import {
    InvestmentEngagementJourneyService
} from '../investment-engagement-journey/investment-engagement-journey.service';




import { InvestmentCommonFormData, IAccountCreationStatusInfo } from './investment-common-form-data';
import { InvestmentApiService } from '../investment-api.service';
import { InvestmentAccountService } from '../investment-account/investment-account-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SIGN_UP_ROUTE_PATHS } from 'src/app/sign-up/sign-up.routes.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from './investment-common-routes.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account/investment-account-routes.constants';

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

  setInvAccountStatusInfoToSession(accountCreationStatusInfo: IAccountCreationStatusInfo) {
    this.investmentCommonFormData.accountCreationStatusInfo = accountCreationStatusInfo;
    this.commit();
  }

  clearInvAccountStatusInfo() {
    this.investmentCommonFormData.accountCreationStatusInfo = null;
    this.commit();
  }

  getAccountCreationStatusInfo(): Observable<IAccountCreationStatusInfo> {
    const accStatusInfoFromSession = this.getInvestmentCommonFormData().accountCreationStatusInfo;
    if (accStatusInfoFromSession) {
      return Observable.of(accStatusInfoFromSession);
    } else {
      return this.getFirstInvAccountCreationStatus().map((data: any) => {
        if (data && data.objectList) {
          this.setInvAccountStatusInfoToSession(data.objectList);
          return {
            allowEngagementJourney: data.objectList.allowEngagementJourney,
            portfolioLimitExceeded: data.objectList.portfolioLimitExceeded,
            investmentAccountExists: data.objectList.investmentAccountExists
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
    this.getAccountCreationStatusInfo().subscribe((data: any) => {
      //data = {"exception":null,"objectList":{"allowEngagementJourney":false,"portfolioLimitExceeded":true,"investmentAccountExists":true},"responseMessage":{"responseCode":6000,"responseDescription":"Successful response"}};
      if (data && data.responseMessage && data.responseMessage.responseCode < 6000) {
        this.investmentAccountService.showGenericErrorModal();
      } else {
        if (data.investmentAccountExists) { // SECOND PORTFOLIO
          if (data.portfolioLimitExceeded) { // HAVE LESS THAN 20 PORTFOLIOS?
            const dashboardMessage = {
              show: true,
              title: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.TITLE'),
              desc: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.MAX_PORTFOLIO_LIMIT_ERROR')
            };
            this.investmentAccountService.setInitialMessageToShowDashboard(dashboardMessage);
            this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          } else {
            this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.ACKNOWLEDGEMENT]);
          }
        } else { // FIRST PORTFOLIO
          if (data.allowEngagementJourney) { // ACCOUNT CREATION NOT PENDING ?
            this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.START]);
          } else {
            const dashboardMessage = {
              show: true,
              title: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.TITLE'),
              desc: this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_ERROR')
            };
            this.investmentAccountService.setInitialMessageToShowDashboard(dashboardMessage);
            this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          }
        }
      }
    });
  }

}
