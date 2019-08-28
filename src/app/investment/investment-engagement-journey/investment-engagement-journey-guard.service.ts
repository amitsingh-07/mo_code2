import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { InvestmentAccountService } from '../investment-account/investment-account-service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { ManageInvestmentsService } from '../manage-investments/manage-investments.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from './investment-engagement-journey-routes.constants';


@Injectable({
  providedIn: 'root'
})
export class InvestmentEngagementJourneyGuardService implements CanActivate {
  constructor(
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    private route: Router,
    private authService: AuthenticationService,
    private router: Router,
    private manageInvestmentsService: ManageInvestmentsService
  ) {}
  canActivate() {
    // const userInfo = this.signUpService.getUserProfileInfo();
    // if (
    //   this.authService.isSignedUser() &&
    //   userInfo.investementDetails &&
    //   userInfo.investementDetails.portfolios &&
    //   userInfo.investementDetails.portfolios.length > 0
    // ) {
    //   this.investmentAccountService.setUserPortfolioExistStatus(true);
    //   this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    //   return false;
    // }
    if (this.authService.isSignedUser()) {
      return this.manageInvestmentsService.getAddPortfolioEntitlements().map((data: any) => {
        data = {
          "exception": null,
          "objectList": {
            "canProceedEngagementJourney": true,
            "hasInvestmentAccount": false
          },
          "responseMessage": {
            "responseCode": 6000,
            "responseDescription": "Successful response"
          }
        };
        if (data && data.responseMessage && data.responseMessage.responseCode < 6000) {
          this.investmentAccountService.setUserPortfolioExistStatus(true);
          this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          return false;
        } else { // Api Success
          this.manageInvestmentsService.setAddPortfolioEntitlementsFormData(data.objectList);
          if (data.objectList && data.objectList.canProceedEngagementJourney) {
            return true;
          } else {
            this.investmentAccountService.setUserPortfolioExistStatus(true);
            this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
            return false;
          }
        }
      },
      (err) => {
        this.investmentAccountService.setUserPortfolioExistStatus(true);
        this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
        return false;
      });
    } else {
      return true;
    }
  }
}
