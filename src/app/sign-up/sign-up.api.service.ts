import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../shared/http/api.service';

import { GuideMeService } from '../guide-me/guide-me.service';
import { SelectedPlansService } from '../shared/Services/selected-plans.service';
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
                private selectedPlansService: SelectedPlansService
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
    const getAccountInfo = this.signUpService.getAccountInfo();
    const selectedPlanData = this.selectedPlansService.getSelectedPlan();
    const selectedPlan = [];
    for (const plan of selectedPlanData.plans) {
      selectedPlan.push({typeId: plan.typeId, productName: plan.productName});
    }
    return {
      customer : {
        isSmoker: (getGuideMeFormData.smoker === 'non-smoker') ? false : true,
        givenName: getAccountInfo.firstName,
        surName: getAccountInfo.lastName,
        email: getAccountInfo.email,
        mobileNumber: getAccountInfo.mobileNumber,
        notificationByEmail: getAccountInfo.marketingAcceptance,
        password: getAccountInfo.password,
        countryCode: getAccountInfo.countryCode,
        notificationByPhone: false,
        crmId: 0,
        isIdentityVerified: false,
        dateOfBirth: getGuideMeFormData.customDob
      },
      enquiryId : selectedPlanData.enquiryId,
      selectedProducts: selectedPlan
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
