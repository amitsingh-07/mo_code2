
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { InvestmentCommonService } from './../investment-common/investment-common.service';
import { INVESTMENT_COMMON_CONSTANTS } from './investment-common.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { INVESTMENT_COMMON_ROUTES } from './investment-common-routes.constants';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentCommonGuardService implements CanActivate {
  constructor(
    private route: Router,
    private investmentCommonService: InvestmentCommonService,
    private authService: AuthenticationService,
    private signUpService: SignUpService,
    private appService: AppService
  ) { }
  canActivate(activeRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isSignedUser()) {
      return this.investmentCommonService.getAccountCreationActions().pipe(map((data) => {
        if (data && INVESTMENT_COMMON_CONSTANTS.INVESTMENT_COMMON_GUARD.indexOf(data.accountCreationState) >= 0) {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          return false;
        } else {
          return true;
        }
      }));
    } else {
      if (state.url.indexOf(INVESTMENT_COMMON_ROUTES.ACCEPT_JA_HOLDER) >= 0) {
        this.signUpService.setRedirectUrl(state.url);
      }
      if (this.appService.getCorporateDetails().organisationEnabled) {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: {orgID: this.appService.getCorporateDetails().uuid}});
      } else {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      }
      return false;
    }
  }
}
