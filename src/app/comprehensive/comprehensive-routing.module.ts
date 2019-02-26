import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BadMoodFundComponent } from './bad-mood-fund/bad-mood-fund.component';
import { ComprehensiveEnableGuard } from './comprehensive-enable-guard';
import { ComprehensiveStepsComponent } from './comprehensive-steps/comprehensive-steps.component';
import { ComprehensiveComponent } from './comprehensive/comprehensive.component';
import { DependantEducationListComponent } from './dependant-education-list/dependant-education-list.component';
import { DependantEducationSelectionComponent } from './dependant-education-selection/dependant-education-selection.component';
import { DependantEducationComponent } from './dependant-education/dependant-education.component';
import { DependantSelectionComponent } from './dependant-selection/dependant-selection.component';
import { DependantsDetailsComponent } from './dependants-details/dependants-details.component';
import { EducationPreferenceComponent } from './education-preference/education-preference.component';
import { FirstReportDependantComponent } from './first-report-dependant/first-report-dependant.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { MyEarningsComponent } from './my-earnings/my-earnings.component';
import { MyLiabilitiesComponent } from './my-liabilities/my-liabilities.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MySpendingsComponent } from './my-spendings/my-spendings.component';
import { RegularSavingPlanComponent } from './regular-saving-plan/regular-saving-plan.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ComprehensiveEnableGuard],
    children: [
      { path: '', component: ComprehensiveComponent },
      { path: '', redirectTo: '/comprehensive/getting-started', pathMatch: 'full' },
      { path: 'getting-started', component: MyProfileComponent },
      { path: 'dependant-selection', component: DependantSelectionComponent },
      { path: 'dependant-details', component: DependantsDetailsComponent },
      { path: 'dependant-education', component: DependantEducationComponent },
      { path: 'dependant-education-list', component: DependantEducationListComponent },
      { path: 'dependant-education-preference', component: EducationPreferenceComponent },
      { path: 'dependant-education-selection', component: DependantEducationSelectionComponent },
      { path: 'my-earnings', component: MyEarningsComponent },
      { path: 'my-spendings', component: MySpendingsComponent },
      { path: 'regular-saving-plan', component: RegularSavingPlanComponent },
      { path: 'my-assets', component: MyAssetsComponent },
      { path: 'my-liabilities', component: MyLiabilitiesComponent },
      { path: 'steps/:stepNo', component: ComprehensiveStepsComponent },
      { path: 'first-report', component: FirstReportDependantComponent},
      { path: 'bad-mood-fund', component: BadMoodFundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprehensiveRoutingModule { }
