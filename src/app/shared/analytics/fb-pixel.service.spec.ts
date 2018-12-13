import { TestBed, inject } from '@angular/core/testing';

import { FBPixelService } from './fb-pixel.service';

describe('FBPixelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FBPixelService]
    });
  });

  it('should be created', inject([FBPixelService], (service: FBPixelService) => {
    expect(service).toBeTruthy();
  }));
});
