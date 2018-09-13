import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { GuideMeService } from '../guide-me/guide-me.service';
import { ApiService } from '../shared/http/api.service';
import { SelectedPlansService } from '../shared/Services/selected-plans.service';
import { IPlan, ISetPassword, ISignUp, IVerifyRequestOTP } from '../sign-up/signup-types';
import { SignUpFormData } from './sign-up-form-data';
import { SignUpService } from './sign-up.service';

@Injectable({
    providedIn: 'root'
})
export class SignUpApiService {
    private signUpFormData: SignUpFormData = new SignUpFormData();

    constructor(private http: HttpClient,
                private apiService: ApiService,
                private signUpService: SignUpService,
                private guideMeService: GuideMeService,
                private selectedPlansService: SelectedPlansService,
                public datepipe: DatePipe
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
    const dob = this.datepipe.transform(getGuideMeFormData.customDob, 'yyyy-MM-dd').toString() + 'T00:00:00';
    for (const plan of selectedPlanData.plans) {
      selectedPlan.push(
        {
          typeId: plan.typeId,
          productName: plan.productName
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
        dateOfBirth: dob,
        gender: getGuideMeFormData.gender,
        acceptMarketEmails: getAccountInfo.marketingAcceptance
      },
      enquiryId : selectedPlanData.enquiryId,
      selectedProducts: selectedPlan
    };
  }

  /**
   * form create user account request.
   */
  requestNewOTPBodyRequest(): IVerifyRequestOTP {
    const custRef = this.signUpService.getCustomerRef();
    return {
        customerRef: custRef
    };
  }

  /**
   * form create user account request.
   */
  verifyOTPBodyRequest(code): IVerifyRequestOTP {
    const custRef = this.signUpService.getCustomerRef();
    return {
        customerRef: custRef,
        otp: code
    };
  }

  /**
   * form create user account request.
   */
  setPasswordBodyRequest(pwd: string): ISetPassword {
    const custRef = this.signUpService.getCustomerRef();
    const resCode = this.signUpService.getResetCode();
    return {
        customerRef: custRef,
        password: pwd,
        callbackUrl: environment.apiBaseUrl + '/#/signup/email-verification',
        resetType: 'New',
        resetCode: resCode
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
   * verify one time password.
   * @param code - one time password.
   */
  requestNewOTP() {
    const payload = this.requestNewOTPBodyRequest();
    return this.apiService.requestNewOTP(payload);
  }

  /**
   * verify one time password.
   * @param code - one time password.
   */
  verifyOTP(otp) {
    const payload = this.verifyOTPBodyRequest(otp);
    return this.apiService.verifyOTP(payload);
  }

  /**
   * verify one time password.
   * @param code - one time password.
   */
  setPassword(pwd) {
    const payload = this.setPasswordBodyRequest(pwd);
    return this.apiService.setPassword(payload);
  }

  /**
   * verify email.
   * @param code - verification code.
   */
  verifyEmail(verificationCode) {
    return this.apiService.verifyEmail(verificationCode);
  }
}
