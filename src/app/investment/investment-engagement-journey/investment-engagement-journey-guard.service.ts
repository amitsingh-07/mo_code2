import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { InvestmentAccountService } from '../investment-account/investment-account-service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';
import { ManageInvestmentsService } from '../manage-investments/manage-investments.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from './investment-engagement-journey-routes.constants';
import { TranslateService } from '@ngx-translate/core';
import { InvestmentCommonService } from '../investment-common/investment-common.service';

@Injectable({
  providedIn: 'root'
})
export class InvestmentEngagementJourneyGuardService implements CanActivate {
  constructor(
    private investmentAccountService: InvestmentAccountService,
    private signUpService: SignUpService,
    private route: Router,
    private authService: AuthenticationService,
    private router: Router,
    private manageInvestmentsService: ManageInvestmentsService,
    private translate: TranslateService,
    private investmentCommonService: InvestmentCommonService
  ) {}
  canActivate() {
    if (this.authService.isSignedUser()) {
      return this.investmentCommonService.getAccountCreationActions().map((data) => {
        if (data && data.allowEngagementJourney) {
          return true;
        } else {
          const dashboardMessage = {
            show: true,
            title: data.portfolioLimitExceeded
                  ? this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.MAX_PORTFOLIO_LIMIT_TITLE')
                  : this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_TITLE'),
            desc: data.portfolioLimitExceeded
                  ? this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.MAX_PORTFOLIO_LIMIT_ERROR')
                  : this.translate.instant('INVESTMENT_ADD_PORTFOLIO_ERROR.ACCOUNT_CREATION_PENDING_ERROR')
          };
          this.investmentAccountService.setDashboardInitialMessage(dashboardMessage);
          this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          return false;
        }
      });
    } else {
      return true;
    }
  }
}
