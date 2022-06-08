import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { CorpBizWelcomeflowRoutingModule } from './corpbiz-welcome-flow-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DownloadReportComponent } from './download-report/download-report.component';
import { WelcomeflowComponent } from './welcome-flow-start/welcome-flow.component';
import { WelcomeflowTellAboutYouComponent } from './welcome-flow-tell-about-you/welcome-flow-tell-about-you.component';
import { WelcomeflowCpfLifePayoutComponent } from './welcome-flow-cpf-life-payout/welcome-flow-cpf-life-payout.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/comprehensive/', suffix: '.json' },
      { prefix: './assets/i18n/welcome-journey/', suffix: '.json' }
    ]);
}

@NgModule({
  declarations: [DownloadReportComponent, WelcomeflowComponent, WelcomeflowTellAboutYouComponent, WelcomeflowCpfLifePayoutComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NouisliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    CorpBizWelcomeflowRoutingModule,
    NgbModule,
    SharedModule
  ]
})
export class CorpBizWelcomeFlowModule { }
