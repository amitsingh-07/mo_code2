import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    InvestmentAccountGuardService as InvestmentAccountGuard
} from '../investment-account/investment-account-guard.service';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { AddPortfolioStatusComponent } from './add-portfolio-status/add-portfolio-status.component';
import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import {
    FundingInstructionsComponent
} from './funding-instructions/funding-instructions.component';
import { INVESTMENT_COMMON_ROUTES } from './investment-common-routes.constants';
import { PortfolioNamingComponent } from './portfolio-naming/portfolio-naming.component';

const routes: Routes = [
  {
    path: INVESTMENT_COMMON_ROUTES.ACKNOWLEDGEMENT,
    component: AcknowledgementComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_COMMON_ROUTES.CONFIRM_PORTFOLIO,
    component: ConfirmPortfolioComponent,
    canActivate: [InvestmentAccountGuard]
  },
  {
    path: INVESTMENT_COMMON_ROUTES.FUNDING_INSTRUCTIONS,
    component: FundingInstructionsComponent,
    canActivate: []
  },
  {
    path: INVESTMENT_COMMON_ROUTES.PORTFOLIO_NAMING,
    component: PortfolioNamingComponent,
    canActivate: []
  },
  {
    path: INVESTMENT_COMMON_ROUTES.ADD_PORTFOLIO_STATUS,
    component: AddPortfolioStatusComponent,
    canActivate: []
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class InvestmentCommonRoutingModule {}
