import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';
import { InvestmentCommonRoutingModule } from './investment-common-routing.module';


import { ConfirmPortfolioComponent } from './confirm-portfolio/confirm-portfolio.component';
import { AcknowledgementComponent } from './acknowledgement/acknowledgement.component';
import { FundingInstructionsComponent } from './funding-instructions/funding-instructions.component';

import {
  AccountCreationErrorModalComponent
} from './confirm-portfolio/account-creation-error-modal/account-creation-error-modal.component';
import { PortfolioNamingComponent } from './portfolio-naming/portfolio-naming.component';
import { AddPortfolioStatusComponent } from './add-portfolio-status/add-portfolio-status.component';
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/app/', suffix: '.json' },
    { prefix: './assets/i18n/investment-common/', suffix: '.json' }
  ]);
}

@NgModule({
  imports: [
    CommonModule,
    InvestmentCommonRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
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
    ConfirmPortfolioComponent,
    AcknowledgementComponent,
    FundingInstructionsComponent,
    AccountCreationErrorModalComponent,
    PortfolioNamingComponent,
    AddPortfolioStatusComponent
  ],
  entryComponents: [AccountCreationErrorModalComponent],
  providers: [CurrencyPipe]
})
export class InvestmentCommonModule {

  constructor() {
    console.log("Common module loaded");
  }
}
