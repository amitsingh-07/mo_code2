import { InvestmentEngagementJourneyModule } from './investment-engagement-journey.module';

describe('InvestmentEngagementJourneyModule', () => {
  let investmentEngagementJourneyModule: InvestmentEngagementJourneyModule;

  beforeEach(() => {
    investmentEngagementJourneyModule = new InvestmentEngagementJourneyModule();
  });

  it('should create an instance', () => {
    expect(investmentEngagementJourneyModule).toBeTruthy();
  });
});
