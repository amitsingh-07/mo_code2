import { TestBed, inject } from '@angular/core/testing';

import { GetInsuranceService } from './get-insurance.service';

describe('GetInsuranceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetInsuranceService]
    });
  });

  xit('should be created', inject([GetInsuranceService], (service: GetInsuranceService) => {
    expect(service).toBeTruthy();
  }));
});
