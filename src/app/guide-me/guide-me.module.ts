import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GuideMeRoutingModule } from './/guide-me-routing.module';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedFormComponent } from './get-started/get-started-form/get-started-form.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [CommonModule, GuideMeRoutingModule, ReactiveFormsModule, NgbModule.forRoot() ],
  declarations: [
      ProfileComponent,
      GetStartedComponent,
      GetStartedFormComponent,
      FinAssessmentComponent,
    ]
})
export class GuideMeModule {}
