import { inject, TestBed } from '@angular/core/testing';

import { GuideMeService } from './guide-me.service';

describe('GuideMeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuideMeService]
    });
  });

  it('should be created', inject([GuideMeService], (service: GuideMeService) => {
    expect(service).toBeTruthy();
  }));
});
