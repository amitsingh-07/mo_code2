import { TestBed, inject } from '@angular/core/testing';

import { DirectService } from './direct.service';

describe('DirectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectService]
    });
  });

  it('should be created', inject([DirectService], (service: DirectService) => {
    expect(service).toBeTruthy();
  }));
});
