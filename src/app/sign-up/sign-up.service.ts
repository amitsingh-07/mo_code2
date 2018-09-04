import { Injectable } from '@angular/core';

import { GuideMeService } from '../guide-me/guide-me.service';
import { ApiService } from './../shared/http/api.service';
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

  constructor(private apiService: ApiService, private guideMeService: GuideMeService) {
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
  verifyOneTimePassword(otp) {
    return this.apiService.requestOneTimePassword(otp);
  }

  /**
   * create user account.
   * @param code - verification code.
   */
  formCreateAccountRequest() {
    const getGuideMeFormData = this.guideMeService.getGuideMeFormData();
    const getAccountInfo = this.getAccountInfo();
    return {
      customer : {
        isSmoker: getGuideMeFormData.smoker,
        givenName: getAccountInfo.firstName,
        surName: getAccountInfo.lastName,
        email: getAccountInfo.emailAddress,
        mobileNumber: getAccountInfo.mobileNumber,
        notificationByEmail: getAccountInfo.marketingAcceptance,
        password: getAccountInfo.password,
        countryCode: getAccountInfo.countryCode,
        notificationByPhone: false,
        crmId: 0,
        isIdentityVerified: false
      },
      enquiryId : 3,
      selectedProducts: [
        {
          productName: 'MyProtector Level Plus with CI',
          typeId: 1
        },
        {
          productName: '3G (I)',
          typeId: 14
        }
      ]
    };
  }

  /**
   * create user account.
   * @param code - verification code.
   */
  createAccount() {
    const data = this.formCreateAccountRequest();
    return this.apiService.createAccount(data);
  }

  /**
   * verify email.
   * @param code - verification code.
   */
  verifyEmail(code) {
    return this.apiService.verifyEmail(code);
  }
}
