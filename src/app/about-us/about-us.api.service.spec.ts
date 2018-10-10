import { TestBed, inject } from '@angular/core/testing';

import { AboutUsApiService } from './about-us.api.service';

describe('AboutUsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AboutUsApiService]
    });
  });

  it('should be created', inject([AboutUsApiService], (service: AboutUsApiService) => {
    expect(service).toBeTruthy();
  }));
});
