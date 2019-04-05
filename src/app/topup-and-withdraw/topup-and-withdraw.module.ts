import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { SignUpService } from '../sign-up/sign-up.service';
import { AddBankModalComponent } from './add-bank-modal/add-bank-modal.component';
import { AssetAllocationComponent } from './asset-allocation/asset-allocation.component';
import {
    ConfirmWithdrawalModalComponent
} from './confirm-withdrawal-modal/confirm-withdrawal-modal.component';
import { FundYourAccountComponent } from './fund-your-account/fund-your-account.component';
import { HoldingsComponent } from './holdings/holdings.component';
import { TopUpComponent } from './top-up/top-up.component';
import { TopupAndWithdrawRoutingModule } from './topup-and-withdraw-routing.module';
import { TopupRequestComponent } from './topup-request/topup-request.component';
import { TransactionComponent } from './transaction/transaction.component';
import {
    WithdrawalPaymentMethodComponent
} from './withdrawal-payment-method/withdrawal-payment-method.component';
import { WithdrawalSuccessComponent } from './withdrawal-success/withdrawal-success.component';
import { WithdrawalTypeComponent } from './withdrawal-type/withdrawal-type.component';
import { YourInvestmentComponent } from './your-investment/your-investment.component';
import { YourPortfolioComponent } from './your-portfolio/your-portfolio.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/app/', suffix: '.json' },
    { prefix: './assets/i18n/topup-and-withdraw/', suffix: '.json' }
  ]);
}

@NgModule({
  imports: [
    CommonModule,
    TopupAndWithdrawRoutingModule,
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
    TopupRequestComponent,
    YourInvestmentComponent,
    YourPortfolioComponent,
    FundYourAccountComponent,
    TopupRequestComponent,
    ConfirmWithdrawalModalComponent,
    AddBankModalComponent,
    WithdrawalTypeComponent,
    WithdrawalSuccessComponent,
    WithdrawalPaymentMethodComponent,
    TransactionComponent,
    HoldingsComponent,
    AssetAllocationComponent
  ],
  entryComponents: [ConfirmWithdrawalModalComponent, AddBankModalComponent],
  providers: [CurrencyPipe]
})
export class TopupAndWithdrawModule {

  constructor(private signUpService: SignUpService) {
    const isUnsupportedNoteShown = this.signUpService.getUnsupportedNoteShownFlag();
    if (!this.signUpService.isMobileDevice() && !isUnsupportedNoteShown) {
      this.signUpService.showUnsupportedDeviceModal();
      this.signUpService.setUnsupportedNoteShownFlag();
    }
  }
}
