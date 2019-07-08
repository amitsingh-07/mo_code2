import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import { SignUpService } from '../sign-up/sign-up.service';
import { TOPUPANDWITHDRAW_CONFIG } from './topup-and-withdraw.constants';

@Injectable({
  providedIn: 'root'
})
export class TopupAndWithdrawGuardService implements CanActivate {
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
    } else if (TOPUPANDWITHDRAW_CONFIG.ALLOW_TOPUP_WITHDRAW_GUARD.indexOf(investmentStatus) < 0 ) {
      this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      return false;
    }
    return true;
  }
}
