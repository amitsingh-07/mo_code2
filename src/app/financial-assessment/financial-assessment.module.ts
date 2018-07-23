import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialAssessmentRoutingModule } from './financial-assessment-routing.module';
import { StartPageComponent } from './start-page/start-page.component';

@NgModule({
  imports: [
    CommonModule,
    FinancialAssessmentRoutingModule
  ],
  declarations: [StartPageComponent]
})
export class FinancialAssessmentModule { }
