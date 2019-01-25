import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PORTFOLIO_ROUTES } from './portfolio-routes.constants';

import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';

@Injectable({
  providedIn: 'root'
})
export class EngagementGuardService implements CanActivate {
  constructor(private signUpService: SignUpService,
              private route: Router,
              private authService: AuthenticationService
  ) {
  }
  canActivate(): boolean {
    const userInfo = this.signUpService.getUserProfileInfo();
    if (this.authService.isSignedUser() &&
    userInfo.investementDetails && userInfo.investementDetails.portfolios &&
    userInfo.investementDetails.portfolios.length > 0) {
      this.route.navigate([PORTFOLIO_ROUTES.PORTFOLIO_EXIST]);
      return false;
    }
    return true;
  }
}
