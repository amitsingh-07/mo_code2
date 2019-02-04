import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';
import { PORTFOLIO_ROUTE_PATHS } from './portfolio-routes.constants';

@Injectable({
  providedIn: 'root'
})
export class EngagementGuardService implements CanActivate {
  constructor(
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
      this.route.navigate([PORTFOLIO_ROUTE_PATHS.PORTFOLIO_EXIST]);
      return false;
    }
    return true;
  }
}
