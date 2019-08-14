import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ENGAGEMENT_JOURNEY_ROUTES } from './engagement-journey-routes.constants';
import { GetStartedStep1Component } from './get-started-step1/get-started-step1.component';
import { GetStartedStep2Component } from './get-started-step2/get-started-step2.component';
import { EngagementJourneyGuardService as EngagementJourneyGuard } from './engagement-journey-guard.service';
import { InvestmentPeriodComponent } from './investment-period/investment-period.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { PortfolioExistComponent } from './portfolio-exist/portfolio-exist.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { RiskWillingnessComponent } from './risk-willingness/risk-willingness.component';
import { StartJourneyComponent } from './start-journey/start-journey.component';
import { YourFinancialsComponent } from './your-financials/your-financials.component';

const routes: Routes = [
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.ROOT,
    redirectTo: ENGAGEMENT_JOURNEY_ROUTES.START,
    pathMatch: 'full',
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.GET_STARTED_STEP1,
    component: GetStartedStep1Component,
    canActivate: [EngagementJourneyGuard]
  },
  { path: ENGAGEMENT_JOURNEY_ROUTES.PORTFOLIO_EXIST, component: PortfolioExistComponent },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.PERSONAL_INFO,
    component: InvestmentPeriodComponent,
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.MY_FINANCIALS,
    component: YourFinancialsComponent,
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.GET_STARTED_STEP2,
    component: GetStartedStep2Component,
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.RISK_ASSESSMENT,
    redirectTo: ENGAGEMENT_JOURNEY_ROUTES.RISK_ASSESSMENT + '/1',
    pathMatch: 'full',
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.RISK_ASSESSMENT + '/:id',
    component: RiskWillingnessComponent,
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.RISK_PROFILE,
    component: RecommendationComponent,
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.PORTFOLIO_RECOMMENDATION,
    component: PortfolioDetailsComponent,
    canActivate: [EngagementJourneyGuard]
  },
  {
    path: ENGAGEMENT_JOURNEY_ROUTES.START,
    component: StartJourneyComponent,
    canActivate: [EngagementJourneyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class EngagementJourneyRoutingModule {}
