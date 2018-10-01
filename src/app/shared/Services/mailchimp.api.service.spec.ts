import { inject, TestBed } from '@angular/core/testing';

import { MailchimpApiService } from './mailchimp.api.service';

describe('Mailchimp.APIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailchimpApiService]
    });
  });

  it('should be created', inject([MailchimpApiService], (service: MailchimpApiService) => {
    expect(service).toBeTruthy();
  }));
});
