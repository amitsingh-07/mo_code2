import { Injectable } from '@angular/core';
import { ApiService } from '../shared/http/api.service';
import { PAYMENT_REQUEST } from './payment.constants';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private requestId: string;

  constructor(
    private apiService: ApiService
  ) { }

  setRequestId(reqId: string) {
    this.requestId = reqId;
  }

  getRequestId() {
    return this.requestId;
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
