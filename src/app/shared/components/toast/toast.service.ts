import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  /* Header Params */
  private toastParams = new BehaviorSubject('');

  toastParamChange = this.toastParams.asObservable();

  constructor() { }

  showToast(param) {
    console.log('coming', param);
    this.toastParams.next(param);
  }
}
