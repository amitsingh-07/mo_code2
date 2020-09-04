import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CorporateRoutingModule } from './corporate-routing.module';
import { FinancialLiteracyTeamComponent } from './financial-literacy-team/financial-literacy-team.component';
import { FinancialWellnessProgrammeComponent } from './financial-wellness-programme/financial-wellness-programme.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/corporate/financial-literacy-team/', suffix: '.json' },
      { prefix: './assets/i18n/error/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    CorporateRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    FinancialWellnessProgrammeComponent,
    FinancialLiteracyTeamComponent
  ]
})
export class CorporateModule { }
