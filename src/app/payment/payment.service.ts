import { Injectable } from '@angular/core';
import { ApiService } from '../shared/http/api.service';
import { PAYMENT_REQUEST } from './payment.constants';

const SESSION_STORAGE_KEY = 'payment_session';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private requestId: string;

  constructor(
    private apiService: ApiService
  ) { }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.requestId));
    }
  }

  setRequestId(reqId: string) {
    this.requestId = reqId;
    this.commit();
  }

  getRequestId() {
    let reqId = '';
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      reqId = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return reqId;
  }

  getRequestSignature(enquiryId: number, amt: string, source: string) {
    const payload = {
      enquiryId,
      source,
      transactionAmount: amt,
      transactionType: PAYMENT_REQUEST.transactionType
    };
    return this.apiService.getRequestSignature(payload);
  }

  cancelPayment(requestId: string) {
    const payload = {
      requestId
    };
    return this.apiService.cancelPayment(payload);
  }
}
