import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CiAssessmentComponent } from './ci-assessment/ci-assessment.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IncomeComponent } from './income/income.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { OcpDisabilityComponent } from './ocp-disability/ocp-disability.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'getstarted', component: GetStartedComponent },
  { path: 'financial-assessment', component: FinAssessmentComponent },
  { path: 'insure-assessment', component: InsureAssessmentComponent},
  { path: 'protectionneeds', component: ProtectionNeedsComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'assets', component: MyAssetsComponent },
  { path: 'liabilities', component: LiabilitiesComponent },
  { path: 'ci-assessment', component: CiAssessmentComponent},
  { path: 'occupational-disability', component: OcpDisabilityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule {}
