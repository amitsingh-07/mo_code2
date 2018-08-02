import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CiAssessmentComponent } from './ci-assessment/ci-assessment.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { GUIDE_ME_ROUTES } from './guide-me-routes.constants';
import { IncomeComponent } from './income/income.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';

const routes: Routes = [
  { path: GUIDE_ME_ROUTES.ROOT, component: ProfileComponent },
  { path: GUIDE_ME_ROUTES.PROFILE, component: ProfileComponent },
  { path: GUIDE_ME_ROUTES.GET_STARTED, component: GetStartedComponent },
  { path: GUIDE_ME_ROUTES.FINANCIAL_ASSESSMENT, component: FinAssessmentComponent },
  { path: GUIDE_ME_ROUTES.INSURE_ASSESSMENT, component: InsureAssessmentComponent},
  { path: GUIDE_ME_ROUTES.PROTECTION_NEEDS, component: ProtectionNeedsComponent },
  { path: GUIDE_ME_ROUTES.INCOME, component: IncomeComponent },
  { path: GUIDE_ME_ROUTES.EXPENSES, component: ExpensesComponent },
  { path: GUIDE_ME_ROUTES.ASSETS, component: MyAssetsComponent },
  { path: GUIDE_ME_ROUTES.LIABILITIES, component: LiabilitiesComponent },
  { path: GUIDE_ME_ROUTES.CRITICAL_ILLNESS, component: CiAssessmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule {}
