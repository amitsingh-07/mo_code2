import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { HeaderService } from './header.service';

describe('HeaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderService, MockBackend,
        BaseRequestOptions,{
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }],
      imports: [
        HttpModule
      ]
    });
  });

  it('should be created', inject([HeaderService], (service: HeaderService) => {
    expect(service).toBeDefined();
  }));

  it('should construct', async(inject(
    [HeaderService, MockBackend], (service, mockBackend) => {
    expect(service).toBeDefined();
  })));

});
