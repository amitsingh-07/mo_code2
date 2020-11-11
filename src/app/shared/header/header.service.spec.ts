import { async, inject, TestBed } from '@angular/core/testing';
import { HeaderService } from './header.service';

describe('HeaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderService],
      imports: []
    });
  });

  it('should be created', inject([HeaderService], (service: HeaderService) => {
    expect(service).toBeDefined();
  }));

  it('should construct', async(inject(
    [HeaderService, ], (service, mockBackend) => {
    expect(service).toBeDefined();
  })));

});
