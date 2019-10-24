import { Injectable } from '@angular/core';

import { ApiService } from './../shared/http/api.service';
import { IBundleEnquiry } from './promotion.interface';
import { padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable({
  providedIn: 'root'
})
export class PromotionApiService {
  constructor(private apiService: ApiService) { }

  getPromoList() {
    return this.apiService.getPromoList();
  }

  getPromoCategory() {
    return this.apiService.getPromoCategory();
  }

  getPromoDetail(id: number) {
    return this.apiService.getPromoDetail(id);
  }

  getPromoContent(id: number) {
    return this.apiService.getPromoContent(id);
  }

  getPromoTnc(id: number) {
    return this.apiService.getPromoTnc(id);
  }

  bundleEnquiryRequest(payload): IBundleEnquiry {
    return {
      firstName: payload.firstName,
      lastName: payload.lastName,
      emailAddress: payload.emailAddress,
      contactNumber: payload.contactNumber,
      dateOfBirth: payload.dateOfBirth['year'] + '-' + padNumber(payload.dateOfBirth['month']) + '-' + padNumber(payload.dateOfBirth['day']),
      gender: payload.gender,
      enquiryType: payload.enquiryType,
      receiveMarketingEmails: payload.receiveMarketingEmails
    };
  }

  sendBundleEnquiry(request) {
    const payload = this.bundleEnquiryRequest(request);
    return this.apiService.sendBundleEnquiry(payload);
  }
}
