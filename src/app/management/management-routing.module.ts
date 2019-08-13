import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../sign-up/auth-guard.service';
import { AssetAllocationComponent } from './asset-allocation/asset-allocation.component';
import { FundingInstructionsComponent } from './funding-instructions/funding-instructions.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { TopUpComponent } from './top-up/top-up.component';
import { ManagementGuardService as  ManagementGuard} from './management-guard.service';
import { MANAGEMENT_ROUTES } from './management-routes.constants';
import { TopupStatusComponent } from './topup-status/topup-status.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { WithdrawalBankAccountComponent } from './withdrawal-bank-account/withdrawal-bank-account.component';
import { WithdrawalStatusComponent } from './withdrawal-status/withdrawal-status.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { InvestmentOverviewComponent } from './investment-overview/investment-overview.component';
import { YourPortfolioComponent } from './your-portfolio/your-portfolio.component';

const routes: Routes = [
  {
    path: MANAGEMENT_ROUTES.ROOT,
    redirectTo: MANAGEMENT_ROUTES.YOUR_INVESTMENT,
    pathMatch: 'full'
  },
  {
    path: MANAGEMENT_ROUTES.TOPUP,
    component: TopUpComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.TOPUP_STATUS + '/:status',
    component: TopupStatusComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.FUNDING_INSTRUCTIONS,
    component: FundingInstructionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: MANAGEMENT_ROUTES.YOUR_INVESTMENT,
    component: InvestmentOverviewComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.YOUR_PORTFOLIO,
    component: YourPortfolioComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.WITHDRAWAL,
    component: WithdrawalComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.WITHDRAWAL_PAYMENT_METHOD,
    component: WithdrawalBankAccountComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.WITHDRAWAL_SUCCESS,
    component: WithdrawalStatusComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.TRANSACTION,
    component: TransactionsComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.HOLDINGS,
    component: HoldingsComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.ASSET_ALLOCATION,
    component: AssetAllocationComponent,
    canActivate: [ManagementGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class ManagementRoutingModule {}
