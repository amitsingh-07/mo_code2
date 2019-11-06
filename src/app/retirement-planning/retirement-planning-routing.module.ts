import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RETIREMENT_PLANNING_ROUTES } from './retirement-planning-routes.constants';

import { GetStartedComponent } from './get-started/get-started.component';
import { RetirementPlanStep1Component } from './retirement-plan-step1/retirement-plan-step1.component';
import { RetirementPlanStep2Component } from './retirement-plan-step2/retirement-plan-step2.component';

const routes: Routes = [
  {
    path: RETIREMENT_PLANNING_ROUTES.ROOT,
    pathMatch: 'full',
    redirectTo: RETIREMENT_PLANNING_ROUTES.GET_STARTED
  },
  {
    path: RETIREMENT_PLANNING_ROUTES.GET_STARTED,
    component: GetStartedComponent
  },
  {
    path: RETIREMENT_PLANNING_ROUTES.STEP_1,
    component: RetirementPlanStep1Component,
    canActivate: []
  },
  {
    path: RETIREMENT_PLANNING_ROUTES.STEP_2,
    component: RetirementPlanStep2Component,
    canActivate: []
  },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class RetirementPlanningRoutingModule { }
