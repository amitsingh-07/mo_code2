import { inject, TestBed } from '@angular/core/testing';

import { ComprehensiveApiService } from './comprehensive-api.service';

describe('ComprehensiveApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComprehensiveApiService]
    });
  });

  it('should be created', inject([ComprehensiveApiService], (service: ComprehensiveApiService) => {
    expect(service).toBeTruthy();
  }));
});
