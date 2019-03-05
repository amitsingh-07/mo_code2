import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BadMoodFundComponent } from './bad-mood-fund/bad-mood-fund.component';
import { ComprehensiveEnableGuard } from './comprehensive-enable-guard';
import { COMPREHENSIVE_ROUTES } from './comprehensive-routes.constants';
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
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ComprehensiveEnableGuard],
    children: [
      { path: COMPREHENSIVE_ROUTES.ROOT, component: ComprehensiveComponent },
      { path: COMPREHENSIVE_ROUTES.ROOT, redirectTo: '/comprehensive/getting-started', pathMatch: 'full' },
      { path: COMPREHENSIVE_ROUTES.GETTING_STARTED, component: MyProfileComponent },
      { path: COMPREHENSIVE_ROUTES.DEPENDANT_SELECTION, component: DependantSelectionComponent },
      { path: COMPREHENSIVE_ROUTES.DEPENDANT_DETAILS, component: DependantsDetailsComponent },
      { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION, component: DependantEducationComponent },
      { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_LIST, component: DependantEducationListComponent },
      { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_PREFERENCE, component: EducationPreferenceComponent },
      { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_SELECTION, component: DependantEducationSelectionComponent },
      { path: COMPREHENSIVE_ROUTES.MY_EARNINGS, component: MyEarningsComponent },
      { path: COMPREHENSIVE_ROUTES.MY_SPENDINGS, component: MySpendingsComponent },
      { path: COMPREHENSIVE_ROUTES.REGULAR_SAVING_PLAN, component: RegularSavingPlanComponent },
      { path: COMPREHENSIVE_ROUTES.MY_ASSETS, component: MyAssetsComponent },
      { path: COMPREHENSIVE_ROUTES.MY_LIABILITIES, component: MyLiabilitiesComponent },
      { path: COMPREHENSIVE_ROUTES.STEPS + '/:stepNo', component: ComprehensiveStepsComponent },
      { path: COMPREHENSIVE_ROUTES.FIRST_REPORT, component: FirstReportDependantComponent},
      { path: COMPREHENSIVE_ROUTES.BAD_MOOD_FUND, component: BadMoodFundComponent },
      { path: COMPREHENSIVE_ROUTES.PROGRESS_TRACKER, component: ProgressTrackerComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprehensiveRoutingModule { }
