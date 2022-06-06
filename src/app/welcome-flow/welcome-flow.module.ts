import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NouisliderModule } from 'ng2-nouislider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { WelcomeStaticPageComponent } from './welcome-static-page/welcome-static-page.component';
import { WelcomeflowRoutingModule } from './welcomeflow-routing.module';
import { SharedModule } from '../shared/shared.module';
import { WelcomeStepOneComponent } from './welcome-step-one/welcome-step-one.component';
import { WelcomeStepTwoComponent } from './welcome-step-two/welcome-step-two.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { StartPlanningComponent } from './start-planning/start-planning.component';

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
  declarations: [WelcomeStaticPageComponent, WelcomeStepOneComponent, WelcomeStepTwoComponent, DownloadReportComponent, StartPlanningComponent],
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
    WelcomeflowRoutingModule,
    NgbModule,
    SharedModule
  ]
})
export class WelcomeFlowModule { }
