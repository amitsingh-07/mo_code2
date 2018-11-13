import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { GuideMeService } from '../guide-me/guide-me.service';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SelectedPlansService } from '../shared/Services/selected-plans.service';
import { CryptoService } from '../shared/utils/crypto';
import { IPlan, ISetPassword, ISignUp, IVerifyCode, IVerifyRequestOTP } from '../sign-up/signup-types';
import { appConstants } from './../app.constants';
import { AppService } from './../app.service';
import { DirectService } from './../direct/direct.service';
import { UserInfo } from './../guide-me/get-started/get-started-form/user-info';
import { SignUpFormData } from './sign-up-form-data';
import { SignUpService } from './sign-up.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpApiService {
  private signUpFormData: SignUpFormData = new SignUpFormData();

  constructor(
    private http: HttpClient,
    private apiService: ApiService, private authService: AuthenticationService,
    private signUpService: SignUpService, private guideMeService: GuideMeService,
    private selectedPlansService: SelectedPlansService, public cryptoService: CryptoService,
    private directService: DirectService, private appService: AppService
  ) {
  }

  /**
   * get countries code.
   * @returns array of countries code.
   */
  getCountryCodeList() {
    return this.apiService.getCountryCodeList();
  }

  /**
   * form create user account request.
   */
  createAccountBodyRequest(captchaValue): ISignUp {
    const selectedPlan: IPlan[] = [];
    let userInfo: UserInfo;
    if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT) {
      userInfo = this.directService.getUserInfo();
    } else {
      userInfo = this.guideMeService.getUserInfo();
    }
    const getAccountInfo = this.signUpService.getAccountInfo();
    const selectedPlanData = this.selectedPlansService.getSelectedPlan();
    const formatDob = userInfo.dob;
    const customDob = formatDob.year + '-' + formatDob.month + '-' + formatDob.day;
    const investmentEnqId = this.authService.getEnquiryId(); // Investment Enquiry ID
    return {
      customer: {
        id: 0,
        isSmoker: (userInfo.smoker === 'non-smoker') ? false : true,
        givenName: getAccountInfo.firstName,
        surName: getAccountInfo.lastName,
        email: getAccountInfo.email,
        mobileNumber: getAccountInfo.mobileNumber,
        notificationByEmail: true,
        countryCode: getAccountInfo.countryCode,
        notificationByPhone: true,
        dateOfBirth: customDob,
        gender: userInfo.gender,
        acceptMarketEmails: getAccountInfo.marketingAcceptance
      },
      enquiryId: selectedPlanData.enquiryId ? selectedPlanData.enquiryId : investmentEnqId,
      selectedProducts: selectedPlanData.plans,
      sessionId: this.authService.getSessionId(),
      captcha: captchaValue
    };
  }

  /**
   * form create user account request.
   */
  updateAccountBodyRequest(data) {
    return {
      customer: {
        email: data.email,
        mobileNumber: data.mobileNumber,
        notificationByEmail: true,
        countryCode: data.countryCode,
        notificationByPhone: true
      },
      sessionId: this.authService.getSessionId()
    };
  }

  /**
   * form request new OTP request.
   * @returns IVerifyRequestOTP - VerifyRequest
   */
  requestNewOTPBodyRequest(): IVerifyRequestOTP {
    const custRef = this.signUpService.getCustomerRef();
    return {
      customerRef: custRef
    };
  }

  /**
   * form verify OTP request.
   */
  verifyOTPBodyRequest(code): IVerifyRequestOTP {
    const custRef = this.signUpService.getCustomerRef();
    return {
      customerRef: custRef,
      otp: code
    };
  }

  /**
   * form set password request.
   */
  setPasswordBodyRequest(pwd: string): ISetPassword {
    const custRef = this.signUpService.getCustomerRef();
    const resCode = this.signUpService.getResetCode();
    const selectedPlanData = this.selectedPlansService.getSelectedPlan();
    return {
      customerRef: custRef,
      password: this.cryptoService.encrypt(pwd),
      callbackUrl: environment.apiBaseUrl + '/#/account/email-verification',
      resetType: 'New',
      selectedProducts: selectedPlanData.plans,
      resetCode: resCode
    };
  }

  /**
   * form verify email request.
   */
  verifyEmailBodyRequest(verifyCode): IVerifyCode {
    return {
      code: verifyCode
    };
  }

  /**
   * create user account.
   * @param code - verification code.
   */
  createAccount(captcha) {
    const payload = this.createAccountBodyRequest(captcha);
    return this.apiService.createAccount(payload);
  }

  /**
   * update user account.
   * @param data - Country code, Mobile number and Email address.
   */
  updateAccount(data) {
    const payload = this.updateAccountBodyRequest(data);
    return this.apiService.updateAccount(payload);
  }

  /**
   * request new one time password.
   */
  requestNewOTP() {
    const payload = this.requestNewOTPBodyRequest();
    return this.apiService.requestNewOTP(payload);
  }

  /**
   * verify one time password.
   * @param otp - one time password.
   */
  verifyOTP(otp) {
    const payload = this.verifyOTPBodyRequest(otp);
    return this.apiService.verifyOTP(payload);
  }

  /**
   * set password.
   * @param pwd - password.
   */
  setPassword(pwd) {
    const payload = this.setPasswordBodyRequest(pwd);
    return this.apiService.setPassword(payload);
  }

  /**
   * verify email.
   * @param verifyCode - confirmation token.
   */
  verifyEmail(verifyCode) {
    const payload = this.verifyEmailBodyRequest(verifyCode);
    return this.apiService.verifyEmail(payload);
  }

  /**
   * verify email.
   * @param verifyCode - confirmation token.
   */
  requestPassword(data) {
    const payload = this.setRequestPasswordPayload(data);
    return this.apiService.requestForgotPasswordLink(payload);
  }

  /**
   * Payload for forgot password request .
   */
  setRequestPasswordPayload(data) {
    return {
      email: data
    };
  }

  /**
   * verify credentials .
   * @param username - email / mobile no.
   * @param password - password.
   */
  verifyLogin(userEmail, userPassword, captcha) {
    const sessionId = this.authService.getSessionId();
    const invEnqId = this.authService.getEnquiryId();
    return this.authService.login(userEmail, this.cryptoService.encrypt(userPassword), captcha, sessionId, invEnqId);
  }

  getUserProfileInfo() {
    return this.apiService.getUserProfileInfo();
  }

}
