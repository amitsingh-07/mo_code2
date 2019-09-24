import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { InvestmentCommonService } from './../investment-common/investment-common.service';
import { INVESTMENT_COMMON_CONSTANTS } from './investment-common.constants';

@Injectable({
  providedIn: 'root'
})
export class InvestmentCommonGuardService implements CanActivate {
  constructor(
    private route: Router,
    private investmentCommonService: InvestmentCommonService,
    private authService: AuthenticationService
  ) {}
  canActivate() {
    if (this.authService.isSignedUser()) {
      return this.investmentCommonService.getAccountCreationActions().map((data) => {
        if (data && INVESTMENT_COMMON_CONSTANTS.INVESTMENT_COMMON_GUARD.indexOf(data.accountCreationState) >= 0) {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          return false;
        } else {
          return true;
        }
      });
    } else {
      this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    }
  }
}


if (MANAGE_INVESTMENTS_CONSTANTS.ALLOW_MANAGE_INVESTMENTS_GUARD.indexOf(investmentStatus) < 0 )