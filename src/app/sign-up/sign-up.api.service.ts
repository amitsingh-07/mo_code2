import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { GuideMeService } from '../guide-me/guide-me.service';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SelectedPlansService } from '../shared/Services/selected-plans.service';
import { CryptoService } from '../shared/utils/crypto';
import { ISignUp, IResendEmail, IVerifyCode, IVerifyRequestOTP, IUpdateMobileNumber } from '../sign-up/signup-types';
import { WillWritingService } from '../will-writing/will-writing.service';
import { appConstants } from './../app.constants';
import { AppService } from './../app.service';
import { DirectService } from './../direct/direct.service';
import { SignUpFormData } from './sign-up-form-data';
import { SignUpService } from './sign-up.service';
import { Util } from '../shared/utils/util';

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
    private directService: DirectService, private appService: AppService, private willWritingService: WillWritingService
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
  createAccountBodyRequest(captcha: string, pwd: string): ISignUp {
    const getAccountInfo = this.signUpService.getAccountInfo();
    const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
    let journeyType = this.appService.getJourneyType();
    let enquiryId = -1;

    if ((this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT ||
      this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_GUIDED) && (insuranceEnquiry &&
        insuranceEnquiry.plans && insuranceEnquiry.plans.length > 0)) {
      enquiryId = insuranceEnquiry.enquiryId;
    } else if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_WILL_WRITING &&
      this.willWritingService.getWillCreatedPrelogin()) {
      enquiryId = this.willWritingService.getEnquiryId();
    } else if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_INVESTMENT) {
      enquiryId = Number(this.authService.getEnquiryId());
    }

    // If the journeyType is not set, default it to 'signup'
    if (Util.isEmptyOrNull(journeyType)) {
      journeyType = 'signup';
    }

    journeyType = journeyType.toLowerCase();

    return {
      customer: {
        countryCode: getAccountInfo.countryCode,
        mobileNumber: getAccountInfo.mobileNumber.toString(),
        firstName: getAccountInfo.firstName,
        lastName: getAccountInfo.lastName,
        emailAddress: getAccountInfo.email,
        password: this.cryptoService.encrypt(pwd),
        acceptMarketingNotifications: getAccountInfo.marketingAcceptance
      },
      sessionId: this.authService.getSessionId(),
      captcha,
      journeyType,
      enquiryId
    };
  }

  /**
   * form create user account request.
   */
  updateAccountBodyRequest(data) {
    return {
      emailId: data.email,
      mobileNumber: data.mobileNumber,
      countryCode: data.countryCode,
      callbackUrl: environment.apiBaseUrl + '/#/account/email-verification',
      notificationByEmail: true,
      notificationByPhone: true
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
  verifyOTPBodyRequest(code, editProf): IVerifyRequestOTP {
    const custRef = this.signUpService.getCustomerRef();
    return {
      customerRef: custRef,
      otp: code,
      editProfile: editProf
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
  createAccount(captcha: string, pwd: string) {
    const payload = this.createAccountBodyRequest(captcha, pwd);
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
  verifyOTP(otp, editProfile?) {
    const payload = this.verifyOTPBodyRequest(otp, editProfile);
    return this.apiService.verifyOTP(payload);
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
    let enqId = -1;
    let journeyType = this.appService.getJourneyType();
    const sessionId = this.authService.getSessionId();
    if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_WILL_WRITING &&
      this.willWritingService.getWillCreatedPrelogin()) {
      enqId = this.willWritingService.getEnquiryId();
    } else if (this.authService.getEnquiryId()) {
      enqId = Number(this.authService.getEnquiryId());
    } else if (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT ||
      this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_GUIDED) {
      const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
      if (insuranceEnquiry && insuranceEnquiry.plans && insuranceEnquiry.plans.length > 0) {
        journeyType = (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT) ?
          'insurance-direct' : 'insurance-guided';
        enqId = insuranceEnquiry.enquiryId;
      }
    }

    // If the journeyType is not set, default it to 'direct'
    if (Util.isEmptyOrNull(journeyType)) {
      journeyType = 'direct';
    }

    journeyType = journeyType.toLowerCase();

    return this.authService.login(userEmail, this.cryptoService.encrypt(userPassword), captcha, sessionId, enqId, journeyType);
  }

  logout() {
    return this.authService.logout();
  }

  getUserProfileInfo() {
    return this.apiService.getUserProfileInfo();
  }

  checkEmailValidity(payload) {
    return this.apiService.emailValidityCheck(payload);
  }

  resendEmailVerification(value: any, isEmail: boolean) {
    const payload = {
      mobileNumber: isEmail ? '' : value,
      emailAddress: isEmail ? value : '',
      callbackUrl: environment.apiBaseUrl + '/#/account/email-verification',
      hostedServerName: window.location.hostname
    } as IResendEmail;
    return this.apiService.resendEmailVerification(payload);
  }
  sendWelcomeEmail(value: any, isEmail: boolean) {
    const payload = {
      mobileNumber: isEmail ? '' : value,
      emailAddress: isEmail ? value : '',
      callbackUrl: environment.apiBaseUrl + '/#/comprehensive',
      hostedServerName: window.location.hostname
    } as IResendEmail;
    return this.apiService.sendWelcomeEmail(payload);
  }

  editMobileNumber(mobileNo) {
    const payload = {
      customerRef: this.signUpService.getCustomerRef(),
      mobileNumber: mobileNo.toString(),
      countryCode: this.signUpService.getMobileNumber().code,
    } as IUpdateMobileNumber;
    return this.apiService.editMobileNumber(payload);
  }
}
