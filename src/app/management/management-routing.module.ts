import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../sign-up/auth-guard.service';
import { AssetAllocationComponent } from './asset-allocation/asset-allocation.component';
import { FundYourAccountComponent } from './fund-your-account/fund-your-account.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { TopUpComponent } from './top-up/top-up.component';
import { ManagementGuardService as  ManagementGuard} from './management-guard.service';
import { MANAGEMENT_ROUTES } from './management-routes.constants';
import { TopupRequestComponent } from './topup-request/topup-request.component';
import { TransactionComponent } from './transaction/transaction.component';
import { WithdrawalPaymentMethodComponent } from './withdrawal-payment-method/withdrawal-payment-method.component';
import { WithdrawalSuccessComponent } from './withdrawal-success/withdrawal-success.component';
import { WithdrawalTypeComponent } from './withdrawal-type/withdrawal-type.component';
import { YourInvestmentComponent } from './your-investment/your-investment.component';
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
    path: MANAGEMENT_ROUTES.TOPUP_REQUEST + '/:status',
    component: TopupRequestComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.FUND_YOUR_ACCOUNT,
    component: FundYourAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: MANAGEMENT_ROUTES.YOUR_INVESTMENT,
    component: YourInvestmentComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.YOUR_PORTFOLIO,
    component: YourPortfolioComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.WITHDRAWAL,
    component: WithdrawalTypeComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.WITHDRAWAL_PAYMENT_METHOD,
    component: WithdrawalPaymentMethodComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.WITHDRAWAL_SUCCESS,
    component: WithdrawalSuccessComponent,
    canActivate: [ManagementGuard]
  },
  {
    path: MANAGEMENT_ROUTES.TRANSACTION,
    component: TransactionComponent,
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
