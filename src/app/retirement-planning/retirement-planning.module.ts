import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { RetirementPlanningRoutingModule } from './retirement-planning-routing.module';
import { SharedModule } from './../shared/shared.module';

import { GetStartedComponent } from './get-started/get-started.component';
import { RetirementPlanStep1Component } from './retirement-plan-step1/retirement-plan-step1.component';
import { RetirementPlanStep2Component } from './retirement-plan-step2/retirement-plan-step2.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/retirement-planning/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RetirementPlanningRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, 
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    GetStartedComponent,
    RetirementPlanStep1Component,
    RetirementPlanStep2Component,
    ConfirmationComponent
  ]
})

export class RetirementPlanningModule { }
