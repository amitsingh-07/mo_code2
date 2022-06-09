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
import { GetStartedComponent } from './get-start/get-start.component';
import { TellAboutYouComponent } from './tell-about-you/tell-about-you.component';
import { CpfLifePayoutComponent } from './cpf-life-payout/cpf-life-payout.component';

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
  declarations: [DownloadReportComponent, GetStartedComponent, TellAboutYouComponent, CpfLifePayoutComponent],
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
