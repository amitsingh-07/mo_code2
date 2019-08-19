import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { InvestmentAccountService } from '../investment-account/investment-account-service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';

@Injectable({
  providedIn: 'root'
})
export class EngagementJourneyGuardService implements CanActivate {
  constructor(
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    private route: Router,
    private authService: AuthenticationService
  ) {}
  canActivate(): boolean {
    const userInfo = this.signUpService.getUserProfileInfo();
    if (
      this.authService.isSignedUser() &&
      userInfo.investementDetails &&
      userInfo.investementDetails.portfolios &&
      userInfo.investementDetails.portfolios.length > 0
    ) {
      this.investmentAccountService.setUserPortfolioExistStatus(true);
      this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      return false;
    }
    return true;
  }
}
