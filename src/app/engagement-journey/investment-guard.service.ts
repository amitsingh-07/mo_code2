import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AccountCreationService } from '../account-creation/account-creation-service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import { SignUpService } from '../sign-up/sign-up.service';

@Injectable({
  providedIn: 'root'
})
export class EngagementGuardService implements CanActivate {
  constructor(
    private accountCreationService: AccountCreationService,
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
      this.accountCreationService.setUserPortfolioExistStatus(true);
      this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      return false;
    }
    return true;
  }
}
