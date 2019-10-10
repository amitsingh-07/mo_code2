import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../../sign-up/auth-guard.service';
import { FundingIntroComponent } from '../investment-common/funding-intro/funding-intro.component';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { AddPortfolioNameComponent } from './add-portfolio-name/add-portfolio-name.component';
import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import {
    FundingInstructionsComponent
} from './funding-instructions/funding-instructions.component';
import { InvestmentCommonGuardService } from './investment-common-guard.service';
import { INVESTMENT_COMMON_ROUTES } from './investment-common-routes.constants';

const routes: Routes = [
  {
    path: INVESTMENT_COMMON_ROUTES.ACKNOWLEDGEMENT,
    component: AcknowledgementComponent,
    canActivate: [InvestmentCommonGuardService]
  },
  {
    path: INVESTMENT_COMMON_ROUTES.CONFIRM_PORTFOLIO,
    component: ConfirmPortfolioComponent,
    canActivate: [InvestmentCommonGuardService]
  },
  {
    path: INVESTMENT_COMMON_ROUTES.ADD_PORTFOLIO_NAME,
    component: AddPortfolioNameComponent,
    canActivate: [InvestmentCommonGuardService]
  },
  {
    path: INVESTMENT_COMMON_ROUTES.FUND_INTRO,
    component: FundingIntroComponent,
    canActivate: [AuthGuard]
  },
  {
    path: INVESTMENT_COMMON_ROUTES.FUNDING_INSTRUCTIONS,
    component: FundingInstructionsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class InvestmentCommonRoutingModule {}
