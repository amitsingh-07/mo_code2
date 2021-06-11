import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { ConfigService, IConfig } from '../config/config.service';
import { GuideMeService } from '../guide-me/guide-me.service';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SelectedPlansService } from '../shared/Services/selected-plans.service';
import { CryptoService } from '../shared/utils/crypto';
import { IEmailRequestOTP, IResendEmail, ISignUp, IUpdateMobileNumber, IVerifyCode, IVerifyRequestOTP } from '../sign-up/signup-types';
import { WillWritingService } from '../will-writing/will-writing.service';
import { appConstants } from './../app.constants';
import { AppService } from './../app.service';
import { DirectService } from './../direct/direct.service';
import { SignUpFormData } from './sign-up-form-data';
import { SignUpService } from './sign-up.service';
import { Util } from '../shared/utils/util';
import { HubspotService } from '../shared/analytics/hubspot.service';
import { SIGN_UP_CONFIG } from './sign-up.constant';

@Injectable({
  providedIn: 'root'
})
export class SignUpApiService {
  private signUpFormData: SignUpFormData = new SignUpFormData();
  private emailVerifyUrl: String;

  constructor(
    private http: HttpClient, private configService: ConfigService, private hubspotService: HubspotService,
    private apiService: ApiService, private authService: AuthenticationService,
    private signUpService: SignUpService, private guideMeService: GuideMeService,
    private selectedPlansService: SelectedPlansService, public cryptoService: CryptoService,
    private directService: DirectService, private appService: AppService, private willWritingService: WillWritingService
  ) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.emailVerifyUrl = config.verifyEmailUrl;
    });
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
      this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_GUIDED) && ( (insuranceEnquiry.plans && insuranceEnquiry.plans.length > 0) 
      || (insuranceEnquiry.enquiryProtectionTypeData && insuranceEnquiry.enquiryProtectionTypeData.length > 0) )) {
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
    if (getAccountInfo.accountCreationType === SIGN_UP_CONFIG.SINGPASS) {
      return {
        customer: {
          countryCode: getAccountInfo.countryCode,
          mobileNumber: getAccountInfo.mobileNumber.toString(),
          uin: getAccountInfo.nricNumber,
          fullName: getAccountInfo.fullName,
          emailAddress: getAccountInfo.email,
          password: this.cryptoService.encrypt(pwd),
          acceptMarketingNotifications: getAccountInfo.marketingAcceptance
        },
        sessionId: this.authService.getSessionId(),
        captcha,
        journeyType,
        enquiryId,
        referralCode: getAccountInfo.referralCode,
        userType: getAccountInfo.userType,
        accountCreationType: getAccountInfo.accountCreationType
      };
    } else {
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
        enquiryId,
        referralCode: getAccountInfo.referralCode,
        userType: getAccountInfo.userType,
        accountCreationType: getAccountInfo.accountCreationType
      };
    }
  }

  /**
   * form create user account request.
   */
  updateAccountBodyRequest(data) {
    return {
      emailId: data.email,
      mobileNumber: data.mobileNumber,
      countryCode: data.countryCode,
      callbackUrl: environment.apiBaseUrl + this.emailVerifyUrl,
      notificationByEmail: true,
      notificationByPhone: true
    };
  }

  /**
   * form request new OTP request.
   * @returns IVerifyRequestOTP - VerifyRequest
   */
  requestNewOTPBodyRequest(editProf): IVerifyRequestOTP {
    const custRef = this.signUpService.getCustomerRef();
    return {
      customerRef: custRef,
      editProfile: editProf
    };
  }
   /**
   * request a new OTP though Email. 
     */
 requestEmailOTPBodyRequest(journeyType, getAccountInfo): IEmailRequestOTP {   
  return  {      
        emailAddress:  (getAccountInfo && getAccountInfo.userProfileInfo)? getAccountInfo.userProfileInfo.emailAddress  : getAccountInfo.email,
        actionType: journeyType   
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
    this.hubspotService.registerEmail(payload.customer.emailAddress);
    this.hubspotService.registerPhone(payload.customer.mobileNumber);
    const hsPayload = [
      {
        name: "email",
        value: payload.customer.emailAddress
      }, 
      {
        name: "phone",
        value: payload.customer.mobileNumber
      },
      {
        name: "firstname",
        value: payload.customer.firstName
      },
      {
        name: "lastname",
        value: payload.customer.lastName
      }];
    this.hubspotService.submitRegistration(hsPayload);
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
  requestNewOTP(editProfile?) {
    const payload = this.requestNewOTPBodyRequest(editProfile);
    return this.apiService.requestNewOTP(payload);
  }
    /**
     * request a new OTP though Email. 
     */
 requestEmailOTP(journeyType, getAccountInfo) {
    const payload = this.requestEmailOTPBodyRequest(journeyType, getAccountInfo);
    return this.apiService.requestEmailOTP(payload);
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
  verifyLogin(userEmail, userPassword, captcha, finlitEnabled, accessCode, loginType) {
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
      if (insuranceEnquiry && ( (insuranceEnquiry.plans && insuranceEnquiry.plans.length > 0) || (insuranceEnquiry.enquiryProtectionTypeData && insuranceEnquiry.enquiryProtectionTypeData.length > 0) )) {
        journeyType = (this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT) ?
        appConstants.INSURANCE_JOURNEY_TYPE.DIRECT : appConstants.INSURANCE_JOURNEY_TYPE.GUIDED;
        enqId = insuranceEnquiry.enquiryId;
      }
    }

    // If the journeyType is not set, default it to 'direct'
    if (Util.isEmptyOrNull(journeyType)) {
      journeyType = appConstants.JOURNEY_TYPE_DIRECT;
    }

    journeyType = journeyType.toLowerCase();

    return this.authService.login(userEmail, this.cryptoService.encrypt(userPassword), captcha, sessionId, enqId, journeyType, finlitEnabled, accessCode, loginType);
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
      callbackUrl: environment.apiBaseUrl + this.emailVerifyUrl,
      hostedServerName: window.location.hostname
    } as IResendEmail;
    return this.apiService.resendEmailVerification(payload);
  }
  sendWelcomeEmail(value: any, isEmail: boolean) {
    const payload = {
      mobileNumber: isEmail ? '' : value,
      emailAddress: isEmail ? value : '',
      callbackUrl: environment.apiBaseUrl + '/comprehensive',
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

  resetPassword(password, key) {
    const data = this.signUpService.constructResetPasswordInfo(this.cryptoService.encrypt(password), key);
    return this.apiService.requestResetPassword(data);
  }

  getPopupStatus(customerId, popupType) {
    const payload = {
      customer_id: customerId,
      track_code: popupType
    };
    return this.apiService.getPopupStatus(payload);
  }

  setPopupStatus(customerId, popupType) {
    const payload = {
      customer_id: customerId,
      check: true,
      track_code: popupType
    };
    return this.apiService.setPopupStatus(payload);
  }
}
