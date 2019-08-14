import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { ACCOUNT_CREATION_CONSTANTS } from './account-creation.constant';

@Injectable({
  providedIn: 'root'
})
export class AccountCreationGuardService implements CanActivate {
  constructor(
    private signUpService: SignUpService,
    private route: Router,
    private authService: AuthenticationService
  ) {}
  canActivate(): boolean {
    const investmentStatus = this.signUpService.getInvestmentStatus();
    if (!this.authService.isSignedUser()) {
      this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    } else if (
      ACCOUNT_CREATION_CONSTANTS.INVESTMENT_ACCOUNT_GUARD_STATUS.indexOf(investmentStatus) >= 0
    ) {
      this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      return false;
    }
    return true;
  }
}
