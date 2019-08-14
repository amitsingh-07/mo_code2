import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CurrencyInputPortfolioDirective } from '../../shared/directives/currency-input-p.directive';
import { SharedModule } from '../../shared/shared.module';
import { SignUpService } from '../../sign-up/sign-up.service';
import { EngagementJourneyRoutingModule } from './engagement-journey-routing.module';
import { GetStartedStep1Component } from './get-started-step1/get-started-step1.component';
import { GetStartedStep2Component } from './get-started-step2/get-started-step2.component';
import { IntroScreenComponent } from './intro-screen/intro-screen.component';
import { InvestmentPeriodComponent } from './investment-period/investment-period.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { PortfolioExistComponent } from './portfolio-exist/portfolio-exist.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { RiskWillingnessComponent } from './risk-willingness/risk-willingness.component';
import { StartJourneyComponent } from './start-journey/start-journey.component';
import { YourFinancialsComponent } from './your-financials/your-financials.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/app/', suffix: '.json' },
    { prefix: './assets/i18n/portfolio/', suffix: '.json' }
  ]);
}

@NgModule({
  imports: [
    CommonModule,
    EngagementJourneyRoutingModule,
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
    GetStartedStep1Component,
    InvestmentPeriodComponent,
    YourFinancialsComponent,
    RiskWillingnessComponent,
    RecommendationComponent,
    GetStartedStep2Component,
    IntroScreenComponent,
    PortfolioDetailsComponent,
    CurrencyInputPortfolioDirective,
    PortfolioExistComponent,
    StartJourneyComponent
  ],
  providers: [CurrencyPipe]
})

export class EngagementJourneyModule {
  constructor(private signUpService: SignUpService) {
  }
}
