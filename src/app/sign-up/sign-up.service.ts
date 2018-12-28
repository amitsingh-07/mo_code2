import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { CryptoService } from '../shared/utils/crypto';
import { CreateAccountFormError } from './create-account/create-account-form-error';
import { SignUpFormData } from './sign-up-form-data';

const SIGNUP_SESSION_STORAGE_KEY = 'app_signup_session_storage_key';
const CUSTOMER_REF_SESSION_STORAGE_KEY = 'app_customer_ref_session_storage_key';
const RESET_CODE_SESSION_STORAGE_KEY = 'app_reset_code_session_storage_key';
const REDIRECT_URL_KEY = 'app_redirect_url';
const IS_CAPTCHA_SHOWN = 'is_captcha';
const CAPTCHA_SESSION_ID = 'captcha_session_id';

@Injectable({
  providedIn: 'root'
})

export class SignUpService {
  private userSubject = new Subject();
  userObservable$ = this.userSubject.asObservable();
  private signUpFormData: SignUpFormData = new SignUpFormData();
  private createAccountFormError: any = new CreateAccountFormError();
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    public authService: AuthenticationService,
    public cryptoService: CryptoService) {
    this.getAccountInfo();
  }

  /**
   * save data in session storage.
   */
  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SIGNUP_SESSION_STORAGE_KEY, JSON.stringify(this.signUpFormData));
    }
  }

  /**
   * save data for the given KEY in session storage.
   */
  save(key: string, value: any) {
    if (window.sessionStorage) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * clear session storage data.
   */
  clearData() {
    this.signUpFormData = new SignUpFormData();
    if (window.sessionStorage) {
      sessionStorage.removeItem(SIGNUP_SESSION_STORAGE_KEY);
      sessionStorage.removeItem(CUSTOMER_REF_SESSION_STORAGE_KEY);
      sessionStorage.removeItem(RESET_CODE_SESSION_STORAGE_KEY);
    }
  }

  /**
   * set customer reference code.
   */
  setCustomerRef(customerRef) {
    if (window.sessionStorage) {
      sessionStorage.setItem(CUSTOMER_REF_SESSION_STORAGE_KEY, JSON.stringify(customerRef));
    }
  }

  /**
   * get customer reference code.
   * @returns reference code.
   */
  getCustomerRef() {
    if (window.sessionStorage && sessionStorage.getItem(CUSTOMER_REF_SESSION_STORAGE_KEY)) {
      return JSON.parse(sessionStorage.getItem(CUSTOMER_REF_SESSION_STORAGE_KEY));
    }
  }

  /**
   * set reset code.
   */
  setResetCode(code) {
    if (window.sessionStorage) {
      sessionStorage.setItem(RESET_CODE_SESSION_STORAGE_KEY, JSON.stringify(code));
    }
  }

  /**
   * get reset code.
   * @returns reset code.
   */
  getResetCode() {
    if (window.sessionStorage && sessionStorage.getItem(RESET_CODE_SESSION_STORAGE_KEY)) {
      return JSON.parse(sessionStorage.getItem(RESET_CODE_SESSION_STORAGE_KEY));
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
    if (window.sessionStorage && sessionStorage.getItem(SIGNUP_SESSION_STORAGE_KEY)) {
      this.signUpFormData = JSON.parse(sessionStorage.getItem(SIGNUP_SESSION_STORAGE_KEY));
    }
    return this.signUpFormData;
  }

  /**
   * get user mobile number.
   * @returns user mobile number with country code.
   */
  getMobileNumber() {
    return {
      number: this.signUpFormData.mobileNumber,
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
   * get form errors.
   * @param form - form details.
   * @returns first error of the form.
   */
  getSignupFormError(form) {
    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.createAccountFormError.formFieldErrors.errorTitle;
    for (const name in controls) {
      if (controls[name].invalid) {
        errors.errorMessages.push(this.createAccountFormError.formFieldErrors[name][Object.keys(controls[name]['errors'])[0]].errorMessage);
      }
    }
    return errors;
  }

  /**
   * get user mobile number.
   * @returns user mobile number with country code.
   */
  getForgotPasswordInfo() {
    return {
      email: this.signUpFormData.forgotPassEmail
    };
  }

  /**
   * set user account details.
   * @param data - user account details.
   */
  setForgotPasswordInfo(email, captcha) {
    // API Call here
    const data = this.constructForgotPasswordInfo(email, captcha);
    return this.apiService.requestForgotPasswordLink(data);
  }

  /**
   * construct the json for forgot password.
   * @param data - email and redirect uri.
   */
  constructForgotPasswordInfo(data, captchaValue) {
    return {
      email: data,
      captcha: captchaValue,
      sessionId: this.authService.getSessionId(),
      redirectUrl: window.location.origin + '/#/account/reset-password' + '?key='
    };
  }
  /**
   * get login info.
   * @param data - user account details.
   */
  getLoginInfo() {
    return {
      loginUsername: this.signUpFormData.loginUsername,
      loginPassword: this.signUpFormData.loginPassword
    };
  }

  /**
   * set login info.
   * @param data - user account details.
   */
  setLoginInfo(data: SignUpFormData) {
    this.signUpFormData = data;
  }

  /**
   * get reset password info.
   * @param data - user account details.
   */
  getResetPasswordInfo() {
    return {
      resetPassword1: this.signUpFormData.resetPassword1,
      confirmPassword: this.signUpFormData.confirmPassword
    };
  }

  /**
   * set reset password info.
   * @param data - user account details.
   */
  // tslint:disable-next-line:no-identical-functions
  setResetPasswordInfo(password, key) {
    // API Call here
    const data = this.constructResetPasswordInfo(this.cryptoService.encrypt(password), key);
    return this.apiService.requestResetPassword(data);
  }
  /**
   * construct the json for reset password.
   * @param data - email and redirect uri.
   */
  constructResetPasswordInfo(pass, key) {
    return {
      password: pass,
      resetKey: key
    };
  }

  getUserProfileInfo() {
    if (window.sessionStorage && sessionStorage.getItem(SIGNUP_SESSION_STORAGE_KEY)) {
      this.signUpFormData = JSON.parse(sessionStorage.getItem(SIGNUP_SESSION_STORAGE_KEY));
    }
    return this.signUpFormData.userProfileInfo;
  }

  setUserProfileInfo(userInfo) {
    this.userSubject.next(userInfo);
    this.signUpFormData.userProfileInfo = userInfo;
    this.commit();
  }

  logoutUser() {
    this.userSubject.next('LOGGED_OUT');
  }

  setRedirectUrl(url) {
    if (window.sessionStorage) {
      sessionStorage.setItem(REDIRECT_URL_KEY, url);
    }
  }

  clearRedirectUrl() {
    sessionStorage.removeItem(REDIRECT_URL_KEY);
  }

  getRedirectUrl() {
    return sessionStorage.getItem(REDIRECT_URL_KEY);
  }

  setCaptchaShown() {
    if (window.sessionStorage) {
      sessionStorage.setItem(IS_CAPTCHA_SHOWN, 'true');
    }
  }

  getCaptchaShown() {
    return sessionStorage.getItem(IS_CAPTCHA_SHOWN);
  }

  setCaptchaSessionId(sessionId) {
    if (window.sessionStorage) {
      sessionStorage.setItem(CAPTCHA_SESSION_ID, sessionId);
    }
  }

  getCaptchaSessionId() {
    return sessionStorage.getItem(CAPTCHA_SESSION_ID);
  }

  removeCaptchaSessionId() {
    sessionStorage.removeItem(CAPTCHA_SESSION_ID);
    sessionStorage.removeItem(IS_CAPTCHA_SHOWN);
  }
}
