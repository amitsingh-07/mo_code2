import { Injectable } from '@angular/core';
import { ApiService } from '../http/api.service';
import { Formatter } from '../utils/formatter.util';
import { SignUpService } from './../../sign-up/sign-up.service';
import { IEnquiryUpdate } from './../../sign-up/signup-types';
export const SESSION_STORAGE_KEY = 'app_selected_plan_session_storage_key';

@Injectable({
  providedIn: 'root'
})
export class SelectedPlansService {
  selectedPlanData: any;
  enquiryId;
  constructor(private apiService: ApiService, private signUpService: SignUpService) { }

  commit(data) {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    }
  }

  /**
   * clear session storage data.
   */
  clearData() {
    if (window.sessionStorage) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  setSelectedPlan(plans, enquiryId) {
    this.selectedPlanData = plans;
    this.enquiryId = enquiryId;
    const data = { enquiryId: this.enquiryId, plans: this.selectedPlanData };
    this.commit(data);
  }

  getSelectedPlan() {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.selectedPlanData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    } else {
      this.selectedPlanData = {};
    }
    return this.selectedPlanData;
  }

  updateInsuranceEnquiry() {
    const insuranceEnquiry = this.getSelectedPlan();
    const payload: IEnquiryUpdate = {
      customerId: this.signUpService.getCustomerRef(),
      enquiryId: Formatter.getIntValue(insuranceEnquiry.enquiryId),
      selectedProducts: insuranceEnquiry.plans
    };
    return this.apiService.updateInsuranceEnquiry(payload);
  }
}
