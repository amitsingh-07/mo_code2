
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { InvestmentCommonService } from './../investment-common/investment-common.service';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentAccountGuardService implements CanActivate {
  constructor(
    private route: Router,
    private investmentCommonService: InvestmentCommonService,
    private authService: AuthenticationService,
    private appService: AppService
  ) { }
  canActivate() {
    if (this.authService.isSignedUser()) {
      return this.investmentCommonService.getAccountCreationActions().pipe(map((data) => {
        if (data && data.showInvestmentAccountCreationForm) {
          return true;
        } else {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          return false;
        }
      }));
    } else {
      if (this.appService.getCorporateDetails().organisationEnabled) {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: {orgID: this.appService.getCorporateDetails().uuid}});
      } else {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      }
      return false;
    }
  }
}
