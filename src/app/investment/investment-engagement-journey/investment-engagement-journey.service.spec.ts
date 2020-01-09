import { inject, TestBed } from '@angular/core/testing';

import { InvestmentEngagementJourneyService } from './investment-engagement-journey.service';

describe('InvestmentEngagementJourneyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestmentEngagementJourneyService]
    });
  });

  it('should be created', inject([InvestmentEngagementJourneyService], (service: InvestmentEngagementJourneyService) => {
    expect(service).toBeTruthy();
  }));
});
