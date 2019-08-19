import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES } from './investment-engagement-journey-routes.constants';
import { GetStartedStep1Component } from './get-started-step1/get-started-step1.component';
import { GetStartedStep2Component } from './get-started-step2/get-started-step2.component';
import { InvestmentEngagementJourneyGuardService as InvestmentEngagementJourneyGuard } from './investment-engagement-journey-guard.service';
import { InvestmentPeriodComponent } from './investment-period/investment-period.component';
import { PortfolioDetailsComponent } from './portfolio-details/portfolio-details.component';
import { PortfolioExistComponent } from './portfolio-exist/portfolio-exist.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { RiskWillingnessComponent } from './risk-willingness/risk-willingness.component';
import { StartJourneyComponent } from './start-journey/start-journey.component';
import { YourFinancialsComponent } from './your-financials/your-financials.component';

const routes: Routes = [
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.ROOT,
    redirectTo: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.START,
    pathMatch: 'full',
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.GET_STARTED_STEP1,
    component: GetStartedStep1Component,
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  { path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.PORTFOLIO_EXIST, component: PortfolioExistComponent },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.PERSONAL_INFO,
    component: InvestmentPeriodComponent,
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.MY_FINANCIALS,
    component: YourFinancialsComponent,
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.GET_STARTED_STEP2,
    component: GetStartedStep2Component,
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.RISK_ASSESSMENT,
    redirectTo: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.RISK_ASSESSMENT + '/1',
    pathMatch: 'full',
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.RISK_ASSESSMENT + '/:id',
    component: RiskWillingnessComponent,
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.RISK_PROFILE,
    component: RecommendationComponent,
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.PORTFOLIO_RECOMMENDATION,
    component: PortfolioDetailsComponent,
    canActivate: [InvestmentEngagementJourneyGuard]
  },
  {
    path: INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.START,
    component: StartJourneyComponent,
    canActivate: [InvestmentEngagementJourneyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class InvestmentEngagementJourneyRoutingModule {}
