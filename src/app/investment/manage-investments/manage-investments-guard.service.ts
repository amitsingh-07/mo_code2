import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { InvestmentCommonService } from '../investment-common/investment-common.service';
import { MANAGE_INVESTMENTS_CONSTANTS } from './manage-investments.constants';

@Injectable({
  providedIn: 'root'
})
export class ManageInvestmentsGuardService implements CanActivate {
  constructor(
    private investmentCommonService: InvestmentCommonService,
    private route: Router,
    private authService: AuthenticationService
  ) {}
  canActivate(): boolean {
    // const investmentStatus = this.investmentCommonService.getInvestmentStatus();
    // if (!this.authService.isSignedUser()) {
    //   this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    //   return false;
    // } else if (MANAGE_INVESTMENTS_CONSTANTS.ALLOW_TOPUP_WITHDRAW_GUARD.indexOf(investmentStatus) < 0 ) {
    //   this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    //   return false;
    // }
    return true;
  }
}
