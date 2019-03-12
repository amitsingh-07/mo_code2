import { Subject } from 'rxjs';

import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import {
    UnsupportedDeviceModalComponent
} from '../shared/modal/unsupported-device-modal/unsupported-device-modal.component';
import { CryptoService } from '../shared/utils/crypto';
import { CreateAccountFormError } from './create-account/create-account-form-error';
import { SignUpFormData } from './sign-up-form-data';
import { SIGN_UP_CONFIG } from './sign-up.constant';

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
    public cryptoService: CryptoService,
    private datePipe: DatePipe,
    public modal: NgbModal,
    private translate: TranslateService) {
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

  setEditContact(editContact, mobileUpdate, emailUpdate) {
    this.signUpFormData.editContact = editContact;
    this.signUpFormData.updateMobile = mobileUpdate;
    this.signUpFormData.updateEmail = emailUpdate;
    this.commit();
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

  getEditProfileInfo() {
    // API Call here
    return this.apiService.getEditProfileList();
  }
  constructEditPassword(oldpassword, newpassword) {
    return {
      oldPassword: oldpassword,
      newPassword: newpassword
    };
  }
  setEditPasswordInfo(oldPassword, newPassword) {
    // API Call here
    const data = this.constructEditPassword(this.cryptoService.encrypt(oldPassword), this.cryptoService.encrypt(newPassword));
    return this.apiService.requestEditPassword(data);
  }
  updateBankInfo(bank, fullName , accountNum , id) {
    // API Call here
    const data = this.constructUpdateBankPayload(bank, fullName , accountNum , id);
    return this.apiService.saveNewBank(data);
  }
  // tslint:disable-next-line:no-identical-functions
  constructUpdateBankPayload(bank , fullName , accountNum , id) {
    if (bank) {
      delete bank.accountNoMaxLength;
    }
    const request = {};
    request['id'] = id;
    request['bank'] = bank;
    request['accountName'] = fullName;
    request['accountNumber'] = accountNum;
    return request;
  }

  setContactDetails(countryCode, mobileNumber, email) {
    this.signUpFormData.countryCode = countryCode;
    this.signUpFormData.mobileNumber = mobileNumber;
    this.signUpFormData.email = email;
    this.commit();
  }

  setOldContactDetails(countryCode, mobileNumber, email) {
    this.setContactDetails(countryCode, mobileNumber, email);
    this.signUpFormData.OldCountryCode = countryCode;
    this.signUpFormData.OldMobileNumber = mobileNumber;
    this.signUpFormData.OldEmail = email;
    this.commit();
  }

  getRecentNotifications() {
    return this.apiService.getRecentNotifications();
  }

  getAllNotifications() {
    return this.apiService.getAllNotifications();
  }

  updateNotifications(messages, type) {
    const payload = this.constructPayloadUpdateNotifications(messages, type);
    console.log('payload');
    console.log(payload);
    return this.apiService.updateNotifications(payload);
  }

  constructPayloadUpdateNotifications(messages, type) {
    const messageIdList = this.getMessageIdsFromMessages(messages);
    return {
      messageStatus: type,
      messageIds: messageIdList
    };
  }

  getMessageIdsFromMessages(messages) {
    if (messages === null) {
      return null;
    } else {
      return messages.map( (message) =>  message.messageId);
    }
  }

  deleteNotifications(data) {
    return this.apiService.deleteNotifications(data);
  }

  // setNotificationList(data) {
  //   this.signUpFormData.notificationList = data;
  //   this.commit();
  // }

  getNotificationList() {
    return this.signUpFormData.notificationList;
  }

  getAllMessagesByNotifications(notifications) {
    const messages = [];
    notifications.map((notification) => {
      notification.messages.map((message) => {
        let messageDate;
        let messageMonth = '';
        if (message.time) {
          message.time = parseInt(message.time, 10);
          messageDate = new Date(message.time);
          messageMonth = this.datePipe.transform(messageDate, 'MMMM yyyy');
        }
        message.date = messageDate;
        message.month = messageMonth;
        messages.push(message);
      });
    });
    return messages;
  }

  getDetailedCustomerInfo() {
    // API Call here
    return this.apiService.getDetailedCustomerInfo();
  }

  getInvestmentStatus() {
    const userInfo = this.getUserProfileInfo();
    let investmentStatus = userInfo && userInfo.investementDetails
      && userInfo.investementDetails.account
      && userInfo.investementDetails.account.accountStatus ?
      userInfo.investementDetails.account.accountStatus.toUpperCase() : null;
    const portfoliosLength = userInfo && userInfo.investementDetails &&
      userInfo.investementDetails.portfolios ? userInfo.investementDetails.portfolios.length : 0;
    if ((investmentStatus === null || !investmentStatus) && portfoliosLength > 0) {
      investmentStatus = SIGN_UP_CONFIG.INVESTMENT.RECOMMENDED.toUpperCase();
    } else if ((investmentStatus === SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_CREATED ||
      investmentStatus === SIGN_UP_CONFIG.INVESTMENT.ACCOUNT_FUNDED) && portfoliosLength <= 0) {
      investmentStatus = SIGN_UP_CONFIG.INVESTMENT.START_INVESTING.toUpperCase();
    }
    return investmentStatus;
  }

  // tslint:disable-next-line:cognitive-complexity
  getFormErrorList(form) {
    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.createAccountFormError.formFieldErrors.errorTitle;
    for (const name in controls) {
      if (controls[name].invalid) {
        // HAS NESTED CONTROLS ?
        if (controls[name].controls) {
          const nestedControls = controls[name].controls;
          for (const nestedControlName in nestedControls) {
            if (nestedControls[nestedControlName].invalid) {
              // tslint:disable-next-line
              errors.errorMessages.push(
                this.createAccountFormError.formFieldErrors[nestedControlName][
                  Object.keys(nestedControls[nestedControlName]['errors'])[0]
                ].errorMessage
              );
            }
          }
        } else {
          // NO NESTED CONTROLS
          // tslint:disable-next-line
          errors.errorMessages.push(
            this.createAccountFormError.formFieldErrors[name][
              Object.keys(controls[name]['errors'])[0]
            ].errorMessage
          );
        }
      }
    }
    return errors;
  }

  addMaxLengthInfoForAccountNo(banks) {
    banks.forEach((bank) => {
      const maxLength = SIGN_UP_CONFIG.ACCOUNT_NUMBER_MAX_LENGTH_INFO[bank.key];
      bank.accountNoMaxLength = maxLength ? maxLength : null;
    });
    return banks;
  }

  validateAccNoMaxLength(control: AbstractControl) {
    const value = control.value;
    if (control.value) {
      const validAccountNo =
        (value.length === control.parent.controls['bank'].value.accountNoMaxLength);
      if (control.parent.controls['bank'].value.accountNoMaxLength && !validAccountNo) {
        return { validAccountNo: true };
      }
    }
    return null;
  }

  isMobileDevice() {
    if ( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true;
    } else {
      return false;
    }
  }

  showUnsupportedDeviceModal() {
      const ref = this.modal.open(UnsupportedDeviceModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.translate.instant('UNSUPPORTED_DEVICE_MODAL.TITLE');
      ref.componentInstance.errorMessage = this.translate.instant('UNSUPPORTED_DEVICE_MODAL.DESC');
      return false;
  }

  setUnsupportedNoteShownFlag() {
    this.signUpFormData.isUnsupportedNoteShown = true;
    this.commit();
  }

  getUnsupportedNoteShownFlag() {
    return this.signUpFormData.isUnsupportedNoteShown;
  }
}
