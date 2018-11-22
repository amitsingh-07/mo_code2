import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundYourAccountComponent } from './fund-your-account/fund-your-account.component';
import { TopUpComponent } from './top-up/top-up.component';
import { TOPUP_AND_WITHDRAW_ROUTES } from './topup-and-withdraw-routes.constants';
import { TopupRequestComponent } from './topup-request/topup-request.component';
import {
    WithdrawalPaymentMethodComponent
} from './withdrawal-payment-method/withdrawal-payment-method.component';
import { WithdrawalSuccessComponent } from './withdrawal-success/withdrawal-success.component';
import { WithdrawalTypeComponent } from './withdrawal-type/withdrawal-type.component';

import { YourInvestmentComponent } from './your-investment/your-investment.component';
import { YourPortfolioComponent } from './your-portfolio/your-portfolio.component';

import { AssetAllocationComponent } from './asset-allocation/asset-allocation.component';

const routes: Routes = [
  {
   path: TOPUP_AND_WITHDRAW_ROUTES.ROOT,
    redirectTo: TOPUP_AND_WITHDRAW_ROUTES.TOPUP,
    pathMatch: 'full',

  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.TOPUP,
    component: TopUpComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.TOPUP_REQUEST + '/:status',
    component: TopupRequestComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.FUND_YOUR_ACCOUNT,
    component: FundYourAccountComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.YOUR_INVESY_TMENT,
    component: YourInvestmentComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.YOUR_PORTFOLIO,
    component: YourPortfolioComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.ASSET_ALLOCATION,
    component: AssetAllocationComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.WITHDRAWAL,
    component: WithdrawalTypeComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.WITHDRAWAL_PAYMENT_METHOD,
    component: WithdrawalPaymentMethodComponent
  },
  {
    path: TOPUP_AND_WITHDRAW_ROUTES.WITHDRAWAL_SUCCESS,
    component: WithdrawalSuccessComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class TopupAndWithdrawRoutingModule { }
