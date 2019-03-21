import { inject, TestBed } from '@angular/core/testing';

import { ComprehensiveService } from './comprehensive.service';

describe('ComprehensiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComprehensiveService]
    });
  });

  it('should be created', inject([ComprehensiveService], (service: ComprehensiveService) => {
    expect(service).toBeTruthy();
  }));
});
