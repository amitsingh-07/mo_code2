import { InvestmentEngagementJourneyRoutingModule } from './investment-engagement-journey-routing.module';

describe('InvestmentEngagementJourneyRoutingModule', () => {
  let investmentEngagementJourneyRoutingModule: InvestmentEngagementJourneyRoutingModule;

  beforeEach(() => {
    investmentEngagementJourneyRoutingModule = new InvestmentEngagementJourneyRoutingModule();
  });

  it('should create an instance', () => {
    expect(investmentEngagementJourneyRoutingModule).toBeTruthy();
  });
});
