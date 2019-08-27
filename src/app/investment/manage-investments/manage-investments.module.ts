import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';
import { SignUpService } from '../../sign-up/sign-up.service';
import { AddBankModalComponent } from './withdrawal-bank-account/add-bank-modal/add-bank-modal.component';
import { AssetAllocationComponent } from './asset-allocation/asset-allocation.component';
import {
    ConfirmWithdrawalModalComponent
} from './withdrawal/confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import {
    ForwardPricingModalComponent
} from './withdrawal/forward-pricing-modal/forward-pricing-modal.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { TopUpComponent } from './top-up/top-up.component';
import { ManageInvestmentsRoutingModule } from './manage-investments-routing.module';
import { TopupStatusComponent } from './topup-status/topup-status.component';
import { TransactionsComponent } from './transactions/transactions.component';
import {
    WithdrawalBankAccountComponent
} from './withdrawal-bank-account/withdrawal-bank-account.component';
import { WithdrawalStatusComponent } from './withdrawal-status/withdrawal-status.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { InvestmentOverviewComponent } from './investment-overview/investment-overview.component';
import { YourPortfolioComponent } from './your-portfolio/your-portfolio.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/app/', suffix: '.json' },
    { prefix: './assets/i18n/manage-investments/', suffix: '.json' }
  ]);
}

@NgModule({
  imports: [
    CommonModule,
    ManageInvestmentsRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    NouisliderModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    RouterModule
  ],
  declarations: [
    TopUpComponent,
    TopupStatusComponent,
    InvestmentOverviewComponent,
    YourPortfolioComponent,
    TopupStatusComponent,
    ConfirmWithdrawalModalComponent,
    ForwardPricingModalComponent,
    AddBankModalComponent,
    WithdrawalComponent,
    WithdrawalStatusComponent,
    WithdrawalBankAccountComponent,
    TransactionsComponent,
    HoldingsComponent,
    AssetAllocationComponent
  ],
  entryComponents: [ConfirmWithdrawalModalComponent, AddBankModalComponent, ForwardPricingModalComponent],
  providers: [CurrencyPipe]
})
export class ManageInvestmentsModule {

  constructor() {
    console.log("Manage Investments module loaded");
  }
}
