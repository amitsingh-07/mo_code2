import { inject, TestBed } from '@angular/core/testing';

import { MyInfoService } from './my-info.service';

describe('MyInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyInfoService]
    });
  });

  it('should be created', inject([MyInfoService], (service: MyInfoService) => {
    expect(service).toBeTruthy();
  }));
});
