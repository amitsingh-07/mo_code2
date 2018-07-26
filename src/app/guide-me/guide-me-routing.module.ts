
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssetsComponent } from './assets/assets.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IncomeComponent } from './income/income.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
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
  { path: 'assets', component: AssetsComponent },
  { path: 'liabilities', component: LiabilitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule {}
