import { Subject, BehaviorSubject } from 'rxjs';

import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TranslateService } from '@ngx-translate/core';
import { ConfigService, IConfig } from '../config/config.service';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import {
  UnsupportedDeviceModalComponent
} from '../shared/modal/unsupported-device-modal/unsupported-device-modal.component';
import { RegexConstants } from '../shared/utils/api.regex.constants';
import { CryptoService } from '../shared/utils/crypto';
import { CreateAccountFormError } from './create-account/create-account-form-error';
import { SignUpFormData } from './sign-up-form-data';
import { SIGN_UP_CONFIG } from './sign-up.constant';
import { InvestmentAccountService } from '../investment/investment-account/investment-account-service';
import { appConstants } from '../app.constants';
import { ManageInvestmentsService } from '../investment/manage-investments/manage-investments.service';
import { map } from 'rxjs/operators';

const SIGNUP_SESSION_STORAGE_KEY = 'app_signup_session_storage_key';
const CUSTOMER_REF_SESSION_STORAGE_KEY = 'app_customer_ref_session_storage_key';
const RESET_CODE_SESSION_STORAGE_KEY = 'app_reset_code_session_storage_key';
const REDIRECT_URL_KEY = 'app_redirect_url';
const IS_CAPTCHA_SHOWN = 'is_captcha';
const CAPTCHA_SESSION_ID = 'captcha_session_id';

const USER_MOBILE = 'user_mobile';
const FROM_LOGIN_PAGE = 'from_login_page';
const CAPTACHA_COUNT = 'captcha_count';
const EMAIL = 'email';
const FINLITENABLED = 'finlitenabled';
const USER_MOBILE_COUNTRY_CODE = 'user_mobile_country_code';
const NEW_UPDATES_MODAL_SHOWN = 'new_updates_modal_shown';

@Injectable({
  providedIn: 'root'
})

export class SignUpService {
  disableAttributes = [];
  private userSubject = new Subject();
  userObservable$ = this.userSubject.asObservable();
  private signUpFormData: SignUpFormData = new SignUpFormData();
  private createAccountFormError: any = new CreateAccountFormError();
  private resetPasswordUrl: string;
  private resetPasswordCorpUrl: string;
  private mobileOptimized = new BehaviorSubject(false);
  mobileOptimizedObservable$ = this.mobileOptimized.asObservable();
  myInfoAttributes = SIGN_UP_CONFIG.MY_INFO_ATTRIBUTES;
  corpBizMyInfoAttributes = SIGN_UP_CONFIG.CORP_BIZ_MY_INFO_ATTRIBUTES; // Corp Biz attributes
  organisationName: string = '';
  constructor(
    private apiService: ApiService,
    public authService: AuthenticationService,
    public configService: ConfigService,
    public cryptoService: CryptoService,
    private datePipe: DatePipe,
    public modal: NgbModal,
    private translate: TranslateService,
    private investmentAccountService: InvestmentAccountService,
    private manageInvestmentsService: ManageInvestmentsService
  ) {
    this.getAccountInfo();
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.resetPasswordUrl = config.resetPasswordUrl;
      this.resetPasswordCorpUrl = config.resetPasswordCorpUrl;
    });
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
      if (controls[name].invalid && Object.keys(controls[name]['errors']) &&
        this.createAccountFormError.formFieldErrors[name][Object.keys(controls[name]['errors'])[0]].errorMessage) {
        errors.errorMessages.push(this.createAccountFormError.formFieldErrors[name][Object.keys(controls[name]['errors'])[0]].errorMessage);
      }
    }

    if (Object.keys(errors.errorMessages).length <= 0) {
      console.log('Error Key:', Object.keys(form.errors)[0]);
      if (form.invalid && this.createAccountFormError.formErrors[Object.keys(form.errors)[0]]) {
        if (this.createAccountFormError.formErrors[Object.keys(form.errors)[0]].errorTitle) {
          errors.title = this.createAccountFormError.formErrors[Object.keys(form.errors)[0]].errorTitle;
        }
        errors.errorMessages.push(this.createAccountFormError.formErrors[Object.keys(form.errors)[0]].errorMessage);
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
  setForgotPasswordInfo(email, captcha, profileType) {
    // API Call here
    const data = this.constructForgotPasswordInfo(email, captcha, profileType);
    return this.apiService.requestForgotPasswordLink(data);
  }

  /**
   * construct the json for forgot password.
   * @param data - email and redirect uri.
   */
  constructForgotPasswordInfo(data, captchaValue, profileType) {
    let resetUrl = (profileType == appConstants.USERTYPE.CORPORATE) ? this.resetPasswordCorpUrl : this.resetPasswordUrl;
    return {
      email: data,
      captcha: captchaValue,
      sessionId: this.authService.getSessionId(),
      profileType: profileType,
      redirectUrl: window.location.origin + resetUrl + '?token='
    };
  }
  setRestEmailInfo(email, captcha, oldEmail) {
    // API Call here
    const data = this.constructResetEmailInfo(email, captcha, oldEmail);
    return this.apiService.resetEmail(data);
  }

  /**
   * construct the json for forgot password.
   * @param data - email and redirect uri.
   */
  constructResetEmailInfo(data, captchaValue, oldLoginEmail) {
    return {
      oldEmail: (oldLoginEmail && this.authService.isUserNameEmail(oldLoginEmail)) ? oldLoginEmail : '',
      mobileNo: (oldLoginEmail && !this.authService.isUserNameEmail(oldLoginEmail)) ? oldLoginEmail : '',
      updatedEmail: data,
      captcha: captchaValue,
      sessionId: this.authService.getSessionId(),
      callbackUrl: window.location.origin + "/app/accounts/email-verification"
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
   * construct the json for reset password.
   * @param data - email and redirect uri.
   */
  constructResetPasswordInfo(pass, key, profileType) {
    return {
      password: pass,
      token: key,
      sessionId: this.authService.getSessionId(),
      profileType: profileType
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
  setEmail(data) {
    if (window.sessionStorage) {
      sessionStorage.setItem(EMAIL, data);
    }
  }
  getUserType() {
    return sessionStorage.getItem(FINLITENABLED);
  }
  setUserType(data) {
    if (window.sessionStorage) {
      sessionStorage.setItem(FINLITENABLED, data);
    }
  }
  getEmail() {
    return sessionStorage.getItem(EMAIL);
  }
  getEmailandFinlit() {
    return {
      email: this.signUpFormData.email,
      userType: this.signUpFormData.userType
    };
  }

  getModalShownStatus() {
    return sessionStorage.getItem(NEW_UPDATES_MODAL_SHOWN);
  }
  setModalShownStatus(status) {
    if (window.sessionStorage) {
      sessionStorage.setItem(NEW_UPDATES_MODAL_SHOWN, status);
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
    sessionStorage.removeItem(CAPTACHA_COUNT);
  }

  removeUserType() {
    sessionStorage.removeItem(FINLITENABLED);
  }

  getEditProfileInfo() {
    // API Call here
    return this.apiService.getEditProfileList();
  }

  constructEditPassword(oldpassword, newpassword) {
    return {
      oldPassword: oldpassword,
      newPassword: newpassword,
      sessionId: this.authService.getSessionId(),
    };
  }
  setEditPasswordInfo(oldPassword, newPassword) {
    // API Call here
    const data = this.constructEditPassword(this.cryptoService.encrypt(oldPassword), this.cryptoService.encrypt(newPassword));
    return this.apiService.requestEditPassword(data);
  }
  updateBankInfo(bank, fullName, accountNum, id) {
    // API Call here
    const data = this.constructUpdateBankPayload(bank, fullName, accountNum, id);
    return this.apiService.saveNewBank(data);
  }
  updateBankInfoProfile(bank, fullName, accountNum, id, customerPortfolioId, isJAAccount) {
    const data = this.constructUpdateBankPayload(bank, fullName, accountNum, id);
    // PASSING NULL VALUES IF EDIT BANK DETAILS IS CALLED FROM PROFILE TAB
    return this.apiService.saveNewBankProfile(data, customerPortfolioId, isJAAccount);
  }

  // tslint:disable-next-line:no-identical-functions
  constructUpdateBankPayload(bank, fullName, accountNum, id) {
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

  setMobileDetails(countryCode, mobileNumber) {
    this.signUpFormData.countryCode = countryCode;
    this.signUpFormData.mobileNumber = mobileNumber;
    this.commit();
  }

  setEmailDetails(email) {
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
      return messages.map((message) => message.messageId);
    }
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

  validateBankAccNo(control: AbstractControl) {
    const value = control.value;
    let isValid;
    if (control.value && control.parent) {
      const bankKey = control.parent.controls['bank'].value.key;
      switch (bankKey) {
        case SIGN_UP_CONFIG.BANK_KEYS.BANK_OF_CHINA:
          isValid = new RegExp(RegexConstants.BankAccountNumber.BANK_OF_CHINA).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.STANDARD_CHARTED_BANK:
          isValid = new RegExp(RegexConstants.BankAccountNumber.STANDARD_CHARTED_BANK).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.DBS:
          isValid = new RegExp(RegexConstants.BankAccountNumber.DBS).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.CITIBANK:
          isValid = new RegExp(RegexConstants.BankAccountNumber.CITIBANK).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.MAYBANK:
          isValid = new RegExp(RegexConstants.BankAccountNumber.MAYBANK).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.OCBC:
          isValid = new RegExp(RegexConstants.BankAccountNumber.OCBC).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.RHB_BANK:
          isValid = new RegExp(RegexConstants.BankAccountNumber.RHB_BANK).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.UOB:
          isValid = new RegExp(RegexConstants.BankAccountNumber.UOB).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.ANZ_BANK:
          isValid = new RegExp(RegexConstants.BankAccountNumber.ANZ_BANK).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.CIMB:
          isValid = new RegExp(RegexConstants.BankAccountNumber.CIMB).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.HSBC:
          isValid = new RegExp(RegexConstants.BankAccountNumber.HSBC).test(value);
          break;
        case SIGN_UP_CONFIG.BANK_KEYS.POSB:
          isValid = new RegExp(RegexConstants.BankAccountNumber.POSB).test(value);
          break;
        default:
          isValid = true;
          break;
      }
    }

    if (!isValid) {
      return { validAccountNo: true }
    } else {
      return null;
    }
  }

  isMobileDevice() {
    if (navigator.userAgent.match(/Android/i)
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
    this.mobileOptimized.next(true);
    this.signUpFormData.isUnsupportedNoteShown = true;
    this.commit();
  }

  getUnsupportedNoteShownFlag() {
    return this.signUpFormData.isUnsupportedNoteShown;
  }

  setUserMobileNo(mobile) {
    if (window.sessionStorage) {
      sessionStorage.setItem(USER_MOBILE, mobile);
    }
  }

  getUserMobileNo() {
    return sessionStorage.getItem(USER_MOBILE);
  }

  setUserMobileCountryCode(code) {
    if (window.sessionStorage) {
      sessionStorage.setItem(USER_MOBILE_COUNTRY_CODE, code);
    }
  }

  getUserMobileCountryCode() {
    return sessionStorage.getItem(USER_MOBILE_COUNTRY_CODE);
  }

  setFromLoginPage() {
    if (window.sessionStorage) {
      sessionStorage.setItem(FROM_LOGIN_PAGE, 'true');
    }
  }

  getFromLoginPage() {
    return sessionStorage.getItem(FROM_LOGIN_PAGE);
  }

  removeFromLoginPage() {
    sessionStorage.removeItem(FROM_LOGIN_PAGE);
  }

  removeFromMobileNumber() {
    sessionStorage.removeItem(USER_MOBILE);
  }

  removeFromMobileCountryCode() {
    sessionStorage.removeItem(USER_MOBILE_COUNTRY_CODE);
  }
  getCaptchaCount() {
    let captchaCount;
    if (window.sessionStorage && sessionStorage.getItem(CAPTACHA_COUNT)) {
      captchaCount = JSON.parse(sessionStorage.getItem(CAPTACHA_COUNT));
    } else {
      captchaCount = 0;
    }
    return Number(captchaCount);
  }

  setCaptchaCount() {
    if (window.sessionStorage) {
      const captchaCount = this.getCaptchaCount() + 1;
      sessionStorage.setItem(CAPTACHA_COUNT, captchaCount.toString());
    }
  }

  updateMobileNumber(countryCode, mobileNumber) {
    this.signUpFormData.countryCode = countryCode;
    this.signUpFormData.mobileNumber = mobileNumber;
    if (window.sessionStorage && sessionStorage.getItem(USER_MOBILE)) {
      this.setUserMobileNo(mobileNumber);
    }
    this.commit();
  }

  setByRequestFlag(buyRequestFlag) {
    this.signUpFormData.buyRequestFlag = buyRequestFlag;
    this.commit();
  }

  getByRequestFlag() {
    return this.signUpFormData.buyRequestFlag;
  }

  clearByRequestFlag() {
    this.signUpFormData.buyRequestFlag = false;
    this.commit();
  }

  //srs details
  setEditProfileSrsDetails(accountNumber, srsBankOperator, customerId) {
    this.signUpFormData.srsAccountNumber = accountNumber;
    this.signUpFormData.srsOperatorBank = srsBankOperator;
    this.signUpFormData.customerId = customerId;
    this.commit();
  }

  getSrsDetails() {
    return {
      srsAccountNumber: this.signUpFormData.srsAccountNumber,
      srsOperatorBank: this.signUpFormData.srsOperatorBank,
      customerId: this.signUpFormData.customerId
    };
  }

  validateReferralCode(referralCode) {
    // API Call here
    const data = { "referralCode": referralCode };
    return this.apiService.validateReferralCode(data);
  }

  // create account my_info details
  setCreateAccountMyInfoFormData(data) {
    if (data.name && data.name.value) {
      this.signUpFormData.fullName = data.name.value;
      this.disableAttributes.push('fullName');
    }
    if (data.uin) {
      this.signUpFormData.nricNumber = data.uin;
      this.disableAttributes.push('nricNumber');
    }
    if (data.email && data.email.value) {
      this.signUpFormData.email = data.email.value;
    }
    if (data.mobileno && data.mobileno.nbr) {
      this.signUpFormData.mobileNumber = data.mobileno.nbr;
    }if (data.dob.value) {
      this.signUpFormData.dob = this.investmentAccountService.dateFormat(data.dob.value);
      this.disableAttributes.push('dob');
    }
    if (data.sex.value === SIGN_UP_CONFIG.GENDER.MALE.VALUE) {
      this.signUpFormData.gender = SIGN_UP_CONFIG.GENDER.MALE.DESC;
      this.disableAttributes.push('gender');
    } else if (data.sex.value === SIGN_UP_CONFIG.GENDER.FEMALE.VALUE) {
      this.signUpFormData.gender = SIGN_UP_CONFIG.GENDER.FEMALE.DESC;
      this.disableAttributes.push('gender');
    }
    this.signUpFormData.isMyInfoEnabled = true;
    this.signUpFormData.disableAttributes = this.disableAttributes;
    this.commit();
  }
  isDisabled(fieldName): boolean {
    let disable: boolean;
    if (this.signUpFormData &&
      this.signUpFormData.isMyInfoEnabled && this.signUpFormData.disableAttributes &&
      this.signUpFormData.disableAttributes.indexOf(fieldName) >= 0
    ) {
      disable = true;
    } else {
      disable = false;
    }
    return disable;
  }

  setMyInfoStatus(status) {
    this.signUpFormData.isMyInfoEnabled = status;
    this.commit();
  }

  getReferralCodeData() {
    return this.apiService.getReferralCodeData();
  }
  getRefereeList() {
    // API Call here
    return this.apiService.getRefereeList();
  }

  emailDomainValidator(organisationEnabled = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isEnteredEmailId = isNaN(parseInt(control.value));
        if (organisationEnabled && isEnteredEmailId && appConstants.ORGANISATION_ROLES.ALLOWED_DOMAIN_CORP.filter(ele => control.value?.includes(ele)).length === 0) {
          return { invalidDomain: true };
        } else if (!organisationEnabled && isEnteredEmailId && appConstants.RESTRICTED_DOMAIN_PUBLIC.filter(ele => control.value?.includes(ele)).length > 0) {
          return { invalidDomain: true };
        }
      return null;
    }
  }
  
  // cpf
   setEditProfileCpfDetails(accountNumber, cpfBankOperator, customerId) {
    this.signUpFormData.cpfAccountNumber = accountNumber;
    this.signUpFormData.cpfOperatorBank = cpfBankOperator;
    this.signUpFormData.customerId = customerId;
    this.commit();
  }

  getCpfDetails() {
    return {
      cpfAccountNumber: this.signUpFormData.cpfAccountNumber,
      cpfOperatorBank: this.signUpFormData.cpfOperatorBank,
      customerId: this.signUpFormData.customerId
    };
  }

  // Corp Biz changes
  setCorpBizMyInfoStatus(status) {
    this.signUpFormData.isCorpBizMyInfoEnabled = status;
    this.commit();
  }
}
