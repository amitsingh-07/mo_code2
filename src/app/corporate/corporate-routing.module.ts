import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FinancialLiteracyTeamComponent } from './financial-literacy-team/financial-literacy-team.component';
import { FinancialWellnessProgrammeComponent } from './financial-wellness-programme/financial-wellness-programme.component';

const routes: Routes = [
  { path: 'financial-wellness-programme', component: FinancialWellnessProgrammeComponent },
  { path: 'financial-literacy-team', component: FinancialLiteracyTeamComponent },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporateRoutingModule { }
