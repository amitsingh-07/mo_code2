import { TextMaskModule } from 'angular2-text-mask';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { FormatCurrencyPipe } from '../../shared/Pipes/format-currency.pipe';
import { SharedModule } from '../../shared/shared.module';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { AddPortfolioNameComponent } from './add-portfolio-name/add-portfolio-name.component';
import {
  AccountCreationErrorModalComponent
} from './confirm-portfolio/account-creation-error-modal/account-creation-error-modal.component';
import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import {
  FundingAccountDetailsComponent
} from './funding-account-details/funding-account-details.component';
import {
  FundingInstructionsComponent
} from './funding-instructions/funding-instructions.component';
import { FundingIntroComponent } from './funding-intro/funding-intro.component';
import { InvestmentCommonRoutingModule } from './investment-common-routing.module';
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/app/', suffix: '.json' },
    { prefix: './assets/i18n/investment-common/', suffix: '.json' },
    { prefix: './assets/i18n/promo-code/', suffix: '.json' }
  ]);
}
import { PromoCodeModule } from './../../promo-code/promo-code.module';
import { ConfirmWithdrawalComponent } from './confirm-withdrawal/confirm-withdrawal.component';
import { PortfolioSummaryComponent } from './portfolio-summary/portfolio-summary.component';
import { CkaMethodQnaComponent } from './cka-method-qna/cka-method-qna.component';
import { CpfPrerequisitesComponent } from './cpf-prerequisites/cpf-prerequisites.component';
import { CpfiaTooltipComponent } from './cpf-prerequisites/cpfia-tooltip/cpfia-tooltip.component';

@NgModule({
  imports: [
    CommonModule,
    InvestmentCommonRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    TextMaskModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    RouterModule,
    PromoCodeModule
  ],
  declarations: [
    ConfirmPortfolioComponent,
    AcknowledgementComponent,
    FundingInstructionsComponent,
    AccountCreationErrorModalComponent,
    AddPortfolioNameComponent,
    FundingIntroComponent,
    FundingAccountDetailsComponent,
    ConfirmWithdrawalComponent,
    PortfolioSummaryComponent,
    CkaMethodQnaComponent,
    CpfPrerequisitesComponent,
    CpfiaTooltipComponent
  ],
  entryComponents: [AccountCreationErrorModalComponent],
  providers: [CurrencyPipe, FormatCurrencyPipe]
})
export class InvestmentCommonModule {

  constructor() {
    console.log("Common module loaded");
  }
}
