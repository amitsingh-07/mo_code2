import { Injectable } from '@angular/core';

import { CreateAccountFormError } from './create-account/create-account-form-error';
import { SignUpFormData } from './sign-up-form-data';

const SESSION_STORAGE_KEY = 'app_signup_local_storage_key';

@Injectable({
  providedIn: 'root'
})

export class SignUpService {

  private signUpFormData: SignUpFormData = new SignUpFormData();
  private createAccountFormError: any = new CreateAccountFormError();
  otpRequested: boolean;

  constructor() {
    this.getAccountInfo();
  }

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
   * set user account details.
   * @param data - user account details.
   */
  setPassword(data: string) {
    this.signUpFormData.password = data;
    this.commit();
  }

  /**
   * get user account details.
   * @returns user account details.
   */
  getAccountInfo(): SignUpFormData {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.signUpFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.signUpFormData;
  }

  /**
   * get user mobile number.
   * @returns user mobile number with country code.
   */
  getMobileNumber() {
    return {
      number : this.signUpFormData.mobileNumber,
      code: this.signUpFormData.countryCode
    };
  }

  /**
   * get form errors.
   * @param form - form details.
   * @returns first error of the form.
   */
  currentFormError(form) {
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        return this.createAccountFormError.formFieldErrors[name][Object.keys(controls[name]['errors'])[0]];
      }
    }
  }
}
