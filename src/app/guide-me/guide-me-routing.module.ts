import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetStartedComponent } from './get-started/get-started.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';
import { IncomeComponent } from './income/income.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { AssetsComponent } from './assets/assets.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'getstarted', component: GetStartedComponent },
  { path: 'protectionneeds', component: ProtectionNeedsComponent },
  { path: 'income', component: IncomeComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'liabilities', component: LiabilitiesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule {}
