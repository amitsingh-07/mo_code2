import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RETIREMENT_PLANNING_ROUTES } from './retirement-planning-routes.constants';

import { GetStartedComponent } from './get-started/get-started.component';
import { RetirementNeedsComponent } from "./retirement-needs/retirement-needs.component";
import { PersonalizeYourRetirementComponent } from './personalize-your-retirement/personalize-your-retirement.component';
import { EnquirySuccessComponent } from './enquiry-success/enquiry-success.component';

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
    path: RETIREMENT_PLANNING_ROUTES.RETIREMENT_NEEDS,
    component: RetirementNeedsComponent
  },
  {
    path: RETIREMENT_PLANNING_ROUTES.PERSONALIZE_YOUR_RETIREMENT,
    component: PersonalizeYourRetirementComponent
  },
  {
    path: RETIREMENT_PLANNING_ROUTES.ENQUIRY_SUCCESS,
    component: EnquirySuccessComponent
  },
  {
    path: '**',
    redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class RetirementPlanningRoutingModule { }
