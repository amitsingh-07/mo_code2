import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ConfigService } from '../config/config.service';
import { COMPREHENSIVE_CONST } from './../comprehensive/comprehensive-config.constants';
import { PROMO_CODE_PAYMENT_BYPASS } from './payment.constants';
import { PaymentService } from './payment.service';

@Injectable()
export class PaymentResolver implements Resolve<any> {
  paymentEnabled = false;
  constructor(private paymentService: PaymentService, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: any) => {
      this.paymentEnabled = config.paymentEnabled;
    });
  }

  resolve(): Observable<any> {
    // Get customer's promo code base on the product type
    if (this.paymentEnabled) {
      return this.paymentService.getCustPromoCodeByCategory(COMPREHENSIVE_CONST.PROMO_CODE.TYPE).map((res) => {
        if (res.objectList) {
          let byPass = false;
          for (let i = 0; i < PROMO_CODE_PAYMENT_BYPASS.length; i++) {
            // If promo code matches with the list of promo code
            if (PROMO_CODE_PAYMENT_BYPASS[i].CODE === res.objectList[0].code) {
              // If payment not bypassing
              byPass = PROMO_CODE_PAYMENT_BYPASS[i].PAYMENT_BYPASS;
            }
          }
          return byPass;
        } else {
          return null;
        }
      }, (error) => {
        return null;
      });
    } else {
      return null;
    }
  }

}
