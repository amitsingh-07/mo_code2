import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsureAssessmentRoutingModule } from './insure-assessment-routing.module';
import { StartPageComponent } from './start-page/start-page.component';

@NgModule({
  imports: [
    CommonModule,
    InsureAssessmentRoutingModule
  ],
  declarations: [StartPageComponent]
})
export class InsureAssessmentModule { }
