import { TestBed, inject } from '@angular/core/testing';

import { SeoServiceService } from './seo-service.service';

describe('SeoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeoServiceService]
    });
  });

  it('should be created', inject([SeoServiceService], (service: SeoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
