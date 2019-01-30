import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedUserService } from '../sign-up/auth-guard.service';
import { ComprehensiveStepsComponent } from './comprehensive-steps/comprehensive-steps.component';
import { ComprehensiveComponent } from './comprehensive/comprehensive.component';
import { DependantEducationListComponent } from './dependant-education-list/dependant-education-list.component';
import { DependantEducationSelectionComponent } from './dependant-education-selection/dependant-education-selection.component';
import { DependantEducationComponent } from './dependant-education/dependant-education.component';
import { DependantSelectionComponent } from './dependant-selection/dependant-selection.component';
import { DependantsDetailsComponent } from './dependants-details/dependants-details.component';
import { EducationPreferenceComponent } from './education-preference/education-preference.component';
import { MyEarningsComponent } from './my-earnings/my-earnings.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
const routes: Routes = [
  {
    path: '', canActivate: [LoggedUserService], children: [
      { path: '', component: ComprehensiveComponent },
      { path: 'steps', component: ComprehensiveStepsComponent },
      { path: 'dependant-selection', component: DependantSelectionComponent },
      { path: 'dependant-details', component: DependantsDetailsComponent },
      { path: 'dependant-education', component: DependantEducationComponent },
      { path: 'dependant-education-list', component: DependantEducationListComponent },
      { path: 'dependant-education-preference', component : EducationPreferenceComponent},
       {path: 'dependant-education-selection', component : DependantEducationSelectionComponent},
      { path: 'my-earnings', component: MyEarningsComponent},
      { path: 'getting-started', component: MyProfileComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprehensiveRoutingModule { }
