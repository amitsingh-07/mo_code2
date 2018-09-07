import { TestBed, inject } from '@angular/core/testing';

import { GuideMeCalculateService } from './guide-me-calculate.service';

describe('GuideMeCalculateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuideMeCalculateService]
    });
  });

  it('should be created', inject([GuideMeCalculateService], (service: GuideMeCalculateService) => {
    expect(service).toBeTruthy();
  }));
});
