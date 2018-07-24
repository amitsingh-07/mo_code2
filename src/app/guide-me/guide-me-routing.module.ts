
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetStartedComponent } from './get-started/get-started.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'getstarted', component: GetStartedComponent },
  { path: 'insure-assessment', component: InsureAssessmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule {}
