import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CurrencyInputPortfolioDirective } from '../shared/directives/currency-input-p.directive';
import { SharedModule } from '../shared/shared.module';

import { TopupAndWithdrawRoutingModule } from './topup-and-withdraw-routing.module';

import { TopUpComponent } from './top-up/top-up.component';
import { TopupRequestComponent } from './topup-request/topup-request.component';

import { YourInvestmentComponent } from './your-investment/your-investment.component';
import { YourPortfolioComponent } from './your-portfolio/your-portfolio.component';


export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
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
    SharedModule
  ],

  declarations: [
   TopUpComponent,
   TopupRequestComponent,
   YourInvestmentComponent,
   YourPortfolioComponent
   
  ],
  providers: [CurrencyPipe]
})
export class TopupAndWithdrawModule { }
