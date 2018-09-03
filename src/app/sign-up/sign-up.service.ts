import { Injectable } from '@angular/core';

import { ApiService } from './../shared/http/api.service';
import { CreateAccountFormError } from './create-account/create-account-form-error';
import { SignUpFormData } from './sign-up-form-data';
import { VerifyMobileFormError } from './verify-mobile/verify-mobile-form-error';

const SESSION_STORAGE_KEY = 'app_signup_local_storage_key';

@Injectable({
  providedIn: 'root'
})

export class SignUpService {

  private signUpFormData: SignUpFormData = new SignUpFormData();
  private createAccountFormError: any = new CreateAccountFormError();
  private verifyMobileFormError: any = new VerifyMobileFormError();
  private OTP: number;

  constructor(private apiService: ApiService) { }

  /**
   * save data in session storage.
   */
  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.signUpFormData));
    }
  }

  /**
   * clear session storage data.
   */
  clearData() {
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
  }

  /**
   * set user account details.
   * @param data - user account details.
   */
  setAccountInfo(data: SignUpFormData) {
    this.signUpFormData = data;
    this.commit();
  }

  /**
   * get user account details.
   * @returns user account details.
   */
  getAccountInfo(): SignUpFormData {
    if (!this.signUpFormData) {
      this.signUpFormData = { } as SignUpFormData;
    }
    return this.signUpFormData;
  }

  /**
   * get user mobile number.
   * @returns user mobile number.
   */
  getMobileNumber() {
    return this.signUpFormData.mobileNumber;
  }

  /**
   * get user country code.
   * @returns user country code.
   */
  getCountryCode() {
    return this.signUpFormData.countryCode;
  }

  /**
   * get form errors.
   * @param form - form details.
   * @returns first error of the form.
   */
  currentFormError(form) {
    const formError = (form.name === 'createAccountForm') ? this.createAccountFormError : this.verifyMobileFormError;
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        const field = (form.name === 'createAccountForm') ? name : 'otp';
        return formError.formFieldErrors[field][Object.keys(controls[name]['errors'])[0]];
      }
    }
  }

  /**
   * get countries code.
   * @returns array of countries code.
   */
  getCountryCodeList() {
    return this.apiService.getCountryCodeList();
  }

  /**
   * get one time password.
   * @returns OTP code.
   */
  requestOneTimePassword() {
    return this.apiService.requestOneTimePassword(this.signUpFormData.mobileNumber);
  }

  /**
   * verify one time password.
   * @param code - one time password.
   */
  verifyOneTimePassword(code) {
    return this.apiService.requestOneTimePassword(code);
  }

  /**
   * verify email.
   * @param code - verification code.
   */
  verifyEmail(code) {
    return this.apiService.verifyEmail(code);
  }
}
