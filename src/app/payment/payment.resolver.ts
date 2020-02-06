import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentResolver implements Resolve<any> {
  constructor(private paymentService: PaymentService) {}

  resolve() {
    return this.paymentService.getLastSuccessfulSubmittedTs().map((res) => {
      if (res) {
        return res['last_submit_ts'];
      } else {
        return null;
      }
    }, (error) => {
      return null;
    });
  }
}
