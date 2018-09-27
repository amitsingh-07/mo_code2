import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { GuideMeService } from '../guide-me/guide-me.service';
import { ApiService } from '../shared/http/api.service';
import { SelectedPlansService } from '../shared/Services/selected-plans.service';
import { CtyptoService} from '../shared/utils/crypto';
import { IPlan, ISetPassword, ISignUp, IVerifyCode, IVerifyRequestOTP } from '../sign-up/signup-types';
import { SignUpFormData } from './sign-up-form-data';
import { SignUpService } from './sign-up.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class SignUpApiService {
    private signUpFormData: SignUpFormData = new SignUpFormData();

    constructor(private http: HttpClient,
                private apiService: ApiService,
                private authService: AuthenticationService,
                private signUpService: SignUpService,
                private guideMeService: GuideMeService,
                private selectedPlansService: SelectedPlansService,
                public ctyptoService: CtyptoService
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
  createAccountBodyRequest(): ISignUp {
    const selectedPlan: IPlan[] = [];
    const getGuideMeFormData = this.guideMeService.getGuideMeFormData();
    const getAccountInfo = this.signUpService.getAccountInfo();
    const selectedPlanData = this.selectedPlansService.getSelectedPlan();
    const formatDob = getGuideMeFormData.customDob.split(/\//g);
    const customDob = formatDob[2] + '-' + formatDob[1] + '-' + formatDob[0];
    for (const plan of selectedPlanData.plans) {
      selectedPlan.push(
        {
          typeId: plan.typeId,
          productName: plan.productName,
          premium : {
            premiumAmount: plan.premium.premiumAmount,
            premiumFrequency: plan.premium.premiumFrequency
          }
        }
      );
    }
    return {
      customer: {
        id: 0,
        isSmoker: (getGuideMeFormData.smoker === 'non-smoker') ? false : true,
        givenName: getAccountInfo.firstName,
        surName: getAccountInfo.lastName,
        email: getAccountInfo.email,
        mobileNumber: getAccountInfo.mobileNumber,
        notificationByEmail: true,
        countryCode: getAccountInfo.countryCode,
        notificationByPhone: true,
        dateOfBirth: customDob,
        gender: getGuideMeFormData.gender,
        acceptMarketEmails: getAccountInfo.marketingAcceptance
      },
      enquiryId : selectedPlanData.enquiryId,
      selectedProducts: selectedPlan
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
    return {
        customerRef: custRef,
        password: this.ctyptoService.encrypt(pwd),
        callbackUrl: environment.apiBaseUrl + '/#/account/email-verification',
        resetType: 'New',
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
  createAccount() {
    const payload = this.createAccountBodyRequest();
    return this.apiService.createAccount(payload);
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
  verifyLogin(userEmail, userPassword) {
    return this.authService.authenticate(userEmail, this.ctyptoService.encrypt(userPassword));
  }

}
