import { TestBed, inject } from '@angular/core/testing';

import { PromotionApiService } from './promotion.api.service';

describe('Promotion.ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromotionApiService]
    });
  });

  it('should be created', inject([PromotionApiService], (service: PromotionApiService) => {
    expect(service).toBeTruthy();
  }));
});
