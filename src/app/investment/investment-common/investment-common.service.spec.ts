import { inject, TestBed } from '@angular/core/testing';

import { InvestmentCommonService } from './investment-common.service';

describe('GuideMeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestmentCommonService]
    });
  });

  it('should be created', inject([InvestmentCommonService], (service: InvestmentCommonService) => {
    expect(service).toBeTruthy();
  }));
});
