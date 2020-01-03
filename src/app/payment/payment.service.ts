import { Injectable } from '@angular/core';
import { ApiService } from '../shared/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private apiService: ApiService
  ) { }

  getRequestSignature(amt) {
    const payload = {
      transactionAmount: amt
    };
    return this.apiService.getRequestSignature(payload);
  }
}
