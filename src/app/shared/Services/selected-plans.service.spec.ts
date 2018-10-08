import { TestBed, inject } from '@angular/core/testing';

import { SelectedPlansService } from './selected-plans.service';

describe('SelectedPlansService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedPlansService]
    });
  });

  it('should be created', inject([SelectedPlansService], (service: SelectedPlansService) => {
    expect(service).toBeTruthy();
  }));
});
