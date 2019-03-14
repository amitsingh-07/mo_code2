import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GetStartedStep1Component } from './get-started-step1/get-started-step1.component';
import { GetStartedStep2Component } from './get-started-step2/get-started-step2.component';
import { EngagementGuardService as EngagementGuard } from './investment-guard.service';
import { MyFinancialsComponent } from './my-financials/my-financials.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PortfolioExistComponent } from './portfolio-exist/portfolio-exist.component';
import { PortfolioRecommendationComponent } from './portfolio-recommendation/portfolio-recommendation.component';
import { PORTFOLIO_ROUTES } from './portfolio-routes.constants';
import { RiskAssessmentComponent } from './risk-assessment/risk-assessment.component';
import { RiskProfileComponent } from './risk-profile/risk-profile.component';
import { StartJourneyComponent } from './start-journey/start-journey.component';

const routes: Routes = [
  {
    path: PORTFOLIO_ROUTES.ROOT,
    redirectTo: PORTFOLIO_ROUTES.START,
    pathMatch: 'full',
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.GET_STARTED_STEP1,
    component: GetStartedStep1Component,
    canActivate: [EngagementGuard]
  },
  { path: PORTFOLIO_ROUTES.PORTFOLIO_EXIST, component: PortfolioExistComponent },
  {
    path: PORTFOLIO_ROUTES.PERSONAL_INFO,
    component: PersonalInfoComponent,
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.MY_FINANCIALS,
    component: MyFinancialsComponent,
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.GET_STARTED_STEP2,
    component: GetStartedStep2Component,
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.RISK_ASSESSMENT,
    redirectTo: PORTFOLIO_ROUTES.RISK_ASSESSMENT + '/1',
    pathMatch: 'full',
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.RISK_ASSESSMENT + '/:id',
    component: RiskAssessmentComponent,
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.RISK_PROFILE,
    component: RiskProfileComponent,
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.PORTFOLIO_RECOMMENDATION,
    component: PortfolioRecommendationComponent,
    canActivate: [EngagementGuard]
  },
  {
    path: PORTFOLIO_ROUTES.START,
    component: StartJourneyComponent,
    canActivate: [EngagementGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class PortfolioRoutingModule {}
