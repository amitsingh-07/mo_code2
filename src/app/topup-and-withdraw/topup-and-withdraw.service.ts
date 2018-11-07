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
    this.getAllDropDownList();
    this.getTopUpFormData();
    this.getTopupInvestmentList();
  }
  private topUpAndWithdrawFormData: TopUpAndWithdrawFormData = new TopUpAndWithdrawFormData();
  private topUPFormError: any = new TopUPFormError();

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.topUpAndWithdrawFormData));
    }
  }

  // Return the entire Form Data
  getTopUpFormData() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.topUpAndWithdrawFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.topUpAndWithdrawFormData;
  }
  getAllDropDownList() {
    return this.apiService.getAllDropdownList();
  }

  getTopupInvestmentList() {
    return this.apiService.getTopupInvestmentList();

  }

  doFinancialValidations(form) {
    const invalid = [];
    // tslint:disable-next-line:triple-equals
    if (Number(form.value.oneTimeInvestmentAmount) <= 100 &&
      form.value.Investment === 'One-time Investment') {
      invalid.push(this.topUPFormError.formFieldErrors['topupValidations']['zero']);
      return this.topUPFormError.formFieldErrors['topupValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (Number(form.value.MonthlyInvestmentAmount) <= 50 &&
      form.value.Investment === 'Monthly Investment') {
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

  getTopUp() {
    return {
      portfolio: this.topUpAndWithdrawFormData.portfolio,
      oneTimeInvestmentAmount: this.topUpAndWithdrawFormData.oneTimeInvestmentAmount,
      MonthlyInvestmentAmount: this.topUpAndWithdrawFormData.MonthlyInvestmentAmount,
      Investment: this.topUpAndWithdrawFormData.Investment,
      topupportfolioamount: this.topUpAndWithdrawFormData.topupportfolioamount
    };
  }
  setTopUp(data) {
    this.topUpAndWithdrawFormData.portfolio = data.portfolio;
    this.topUpAndWithdrawFormData.oneTimeInvestmentAmount = data.oneTimeInvestmentAmount;
    this.topUpAndWithdrawFormData.MonthlyInvestmentAmount = data.MonthlyInvestmentAmount;
    this.topUpAndWithdrawFormData.Investment = data.Investment;
    this.topUpAndWithdrawFormData.topupportfolioamount = data.topupportfolioamount;
    this.commit();
  }
}
