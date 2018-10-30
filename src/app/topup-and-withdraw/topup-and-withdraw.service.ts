import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { TopUpAndWithdrawFormData } from './topup-and-withdraw-form-data';

import { TopUPFormError } from './top-up/top-up-form-error';

const SESSION_STORAGE_KEY = 'app_inv_account_session';
@Injectable({
  providedIn: 'root'
})

export class TopupAndWithDrawService {
  constructor(private http: HttpClient, private apiService: ApiService, public authService: AuthenticationService) {
    this.getTopupInvestmentList();
    this.getTopUpFormData();
  }
  private investmentAccountFormData: TopUpAndWithdrawFormData = new TopUpAndWithdrawFormData();
  private topUPFormError: any = new TopUPFormError();

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.investmentAccountFormData));
    }
  }

  // Return the entire Form Data
  getTopUpFormData() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.investmentAccountFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.investmentAccountFormData;
  }
  getTopupInvestmentList() {
    return this.apiService.getTopupInvestmentList();
  }

  doFinancialValidations(form) {
    const invalid = [];
    // tslint:disable-next-line:triple-equals
    if (Number(form.value.oneTimeInvestmentAmount) <= 100 &&
     form.value.investment === 'One-time Investment') {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['zero']);
      return this.topUPFormError.formFieldErrors['topupValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (Number(form.value.MonthlyInvestmentAmount) <= 50 &&
      form.value.investment === 'Monthly Investment') {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['more']);
      return this.topUPFormError.formFieldErrors['topupValidations']['more'];
      // tslint:disable-next-line:max-line-length
    } else {
      return false;
    }
  }

  // removeCommas(str) {
  // if(str.lenght>3)
  // {
  //   while (str.search(',') >= 0) {
  //     str = (str + '').replace(',', '');
  //   }
  // }
  //   return str;
  // }

}
