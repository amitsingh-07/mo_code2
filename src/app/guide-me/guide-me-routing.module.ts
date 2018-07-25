import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssetsComponent } from './assets/assets.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinancialAssessmentComponent } from './financial-assessment/financial-assessment.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IncomeComponent } from './income/income.component';
import { InsuranceAssessmentComponent } from './insurance-assessment/insurance-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'getstarted', component: GetStartedComponent },
  { path: 'protectionneeds', component: ProtectionNeedsComponent },
  { path: 'financialassessment', component: FinancialAssessmentComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'liabilities', component: LiabilitiesComponent },
  { path: 'assuranceassessment', component: InsuranceAssessmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule {}
