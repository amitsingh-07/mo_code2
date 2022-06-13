import { TestBed } from '@angular/core/testing';

import { TellAboutYouService } from './tell-about-you.service';

describe('TellAboutYouService', () => {
  let service: TellAboutYouService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TellAboutYouService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
