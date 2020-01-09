import { inject, TestBed } from '@angular/core/testing';

import { ManageInvestmentsService } from './manage-investments.service';

describe('GuideMeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageInvestmentsService]
    });
  });

  it('should be created', inject([ManageInvestmentsService], (service: ManageInvestmentsService) => {
    expect(service).toBeTruthy();
  }));
});
