import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService as AuthGuard } from '../sign-up/auth-guard.service';
import { AssetAllocationComponent } from './asset-allocation/asset-allocation.component';
import { FundYourAccountComponent } from './fund-your-account/fund-your-account.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { TopUpComponent } from './top-up/top-up.component';
import { TopupAndWithdrawGuardService as  TopupAndWithdrawGuard} from './topup-and-withdraw-guard.service';
import { TOPUP_AND_WITHDRAW_ROUTES } from './topup-and-withdraw-routes.constants';
import { TopupRequestComponent } from './topup-request/topup-request.component';
import { TransactionComponent } from './transaction/transaction.component';
import { WithdrawalPaymentMethodComponent } from './withdrawal-payment-method/withdrawal-payment-method.component';
import { WithdrawalSuccessComponent } from './withdrawal-success/withdrawal-success.component';
import { WithdrawalTypeComponent } from './withdrawal-type/withdrawal-type.component';
import { YourInvestmentComponent } from './your-investment/your-investment.component';
import { YourPortfolioComponent } from './your-portfolio/your-portfolio.component';

const routes: Routes = [
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.ROOT,
    redirectTo: TOPUP_AND_WITHDRAW_ROUTES.YOUR_INVESTMENT,
    pathMatch: 'full'
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.TOPUP,
    component: TopUpComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.TOPUP_REQUEST + '/:status',
    component: TopupRequestComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.FUND_YOUR_ACCOUNT,
    component: FundYourAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.YOUR_INVESTMENT,
    component: YourInvestmentComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.YOUR_PORTFOLIO,
    component: YourPortfolioComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.WITHDRAWAL,
    component: WithdrawalTypeComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.WITHDRAWAL_PAYMENT_METHOD,
    component: WithdrawalPaymentMethodComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.WITHDRAWAL_SUCCESS,
    component: WithdrawalSuccessComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.TRANSACTION,
    component: TransactionComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.HOLDINGS,
    component: HoldingsComponent,
    canActivate: [TopupAndWithdrawGuard]
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.ASSET_ALLOCATION,
    component: AssetAllocationComponent,
    canActivate: [TopupAndWithdrawGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class TopupAndWithdrawRoutingModule {}
