import { Injectable } from '@angular/core';
import { ApiService } from '../shared/http/api.service';

const SESSION_STORAGE_KEY = 'promo_code_session';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {

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

  useSelectedPromo(promo) {
    console.log('SELECTED PROMO IS =', promo)
  }

  setAppliedPromo(promo) {
    console.log('SETTING APPLIED PROMO =', promo)
  }

  removeAppliedPromo(promo) {
    console.log('REMOVING APPLIED PROMO =', promo)
  }

}
