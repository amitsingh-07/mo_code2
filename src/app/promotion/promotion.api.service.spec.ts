import { TestBed, inject } from '@angular/core/testing';

import { Promotion.ApiService } from './promotion.api.service';

describe('Promotion.ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Promotion.ApiService]
    });
  });

  it('should be created', inject([Promotion.ApiService], (service: Promotion.ApiService) => {
    expect(service).toBeTruthy();
  }));
});
