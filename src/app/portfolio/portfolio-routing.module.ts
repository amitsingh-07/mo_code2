
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PORTFOLIO_ROUTES } from './portfolio-routes.constants';
import { GetStartedStep1Component } from './get-started-step1/get-started-step1.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { MyFinancialsComponent } from './my-financials/my-financials.component';
import { GetStartedStep2Component } from './get-started-step2/get-started-step2.component';
import { RiskAssessmentComponent } from './risk-assessment/risk-assessment.component';
import { RiskProfileComponent } from './risk-profile/risk-profile.component';

const routes: Routes = [
  { path: PORTFOLIO_ROUTES.ROOT, redirectTo: PORTFOLIO_ROUTES.GET_STARTED_STEP1, pathMatch: 'full' },
  { path: PORTFOLIO_ROUTES.GET_STARTED_STEP1, component: GetStartedStep1Component },
  { path: PORTFOLIO_ROUTES.PERSONAL_INFO, component: PersonalInfoComponent },
  { path: PORTFOLIO_ROUTES.MY_FINANCIALS, component: MyFinancialsComponent },
  { path: PORTFOLIO_ROUTES.GET_STARTED_STEP2, component: GetStartedStep2Component },
  { path: PORTFOLIO_ROUTES.RISK_ASSESSMENT, redirectTo: PORTFOLIO_ROUTES.RISK_ASSESSMENT + "/1", pathMatch: 'full' },
  { path: PORTFOLIO_ROUTES.RISK_ASSESSMENT + "/:id", component: RiskAssessmentComponent },
  { path: PORTFOLIO_ROUTES.RISK_PROFILE, component: RiskProfileComponent }
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  declarations: []  
}) 
export class PortfolioRoutingModule {}
