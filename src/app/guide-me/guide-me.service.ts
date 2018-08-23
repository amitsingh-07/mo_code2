import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { CriticalIllnessData } from './ci-assessment/ci-assessment';
import { IMyExpenses } from './expenses/expenses.interface';
import { FormError } from './get-started/get-started-form/form-error';
import { UserInfo } from './get-started/get-started-form/user-info';
import { GuideMeFormData } from './guide-me-form-data';
import { GUIDE_ME_ROUTE_PATHS } from './guide-me-routes.constants';
import { HospitalPlan } from './hospital-plan/hospital-plan';
import { IMyIncome } from './income/income.interface';
import { IExistingCoverage } from './insurance-results/existing-coverage-modal/existing-coverage.interface';
import { IMyLiabilities } from './liabilities/liabilities.interface';
import { LongTermCare } from './ltc-assessment/ltc-assessment';
import { IMyAssets } from './my-assets/my-assets.interface';
import { IMyOcpDisability } from './ocp-disability/ocp-disability.interface';
import { Profile } from './profile/profile';
import { ProtectionNeeds } from './protection-needs/protection-needs';

const SESSION_STORAGE_KEY = 'app_session_storage_key';
const INSURANCE_RESULTS_COUNTER_KEY = 'insurance_results_counter';

const PROTECTION_NEEDS_LIFE_PROTECTION_ID = 1;
const PROTECTION_NEEDS_CRITICAL_ILLNESS_ID = 2;
const PROTECTION_NEEDS_OCCUPATIONAL_DISABILITY_ID = 3;
const PROTECTION_NEEDS_LIFE_HOSPITAL_PLAN_ID = 4;
const PROTECTION_NEEDS_LIFE_LONG_TERM_CARE_ID = 5;

@Injectable({
  providedIn: 'root'
})
export class GuideMeService {

  private guideMeFormData: GuideMeFormData = new GuideMeFormData();
  private formError: any = new FormError();
  private isProfileFormValid = false;
  private isProtectionNeedFormValid = false;
  private isLongTermCareFormValid = true;
  private isHospitalPlanFormValid = true;
  isMyIncomeFormValid = false;
  isMyExpensesFormValid = false;
  protectionNeedsPageIndex = 0;
  protectionNeedsArray: any;
  isMyOcpDisabilityFormValid = false;
  isExistingCoverAdded = false;

  // Variables for Insurance Results Generation
  private result_title: string;
  private result_icon: string;
  private result_value;

  constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.getGuideMeFormData();
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.guideMeFormData));
    }
  }

  clearData() {
    if (window.sessionStorage) {
      sessionStorage.clear();
    }
  }

  getProfile(): Profile {
    return {
      myProfile: this.guideMeFormData.myProfile
    };
  }

  setProfile(data: Profile) {
    this.isProfileFormValid = true;
    this.guideMeFormData.myProfile = data.myProfile;
    this.commit();
  }

  getUserInfo(): UserInfo {
    return {
      gender: this.guideMeFormData.gender,
      dob: this.guideMeFormData.dob,
      customDob: this.guideMeFormData.customDob,
      smoker: this.guideMeFormData.smoker,
      dependent: this.guideMeFormData.dependent
    };
  }

  setUserInfo(data: UserInfo) {
    this.isProfileFormValid = true;
    this.guideMeFormData.gender = data.gender;
    this.guideMeFormData.dob = data.dob;
    this.guideMeFormData.smoker = data.smoker;
    this.guideMeFormData.customDob = data.customDob;
    this.guideMeFormData.dependent = data.dependent;
    this.commit();
  }

  // Return the entire GuideMe Form Data
  getGuideMeFormData(): GuideMeFormData {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.guideMeFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.guideMeFormData;
  }

  getProtectionNeeds(): ProtectionNeeds[] {
    if (!this.guideMeFormData.protectionNeedData) {
      this.guideMeFormData.protectionNeedData = [{}] as ProtectionNeeds[];
    }
    return this.guideMeFormData.protectionNeedData;
  }

  setProtectionNeeds(data) {
    this.isProtectionNeedFormValid = true;
    this.guideMeFormData.protectionNeedData = data;
    this.commit();
  }

  getLifeProtection() {
    return {
      lifeProtectionData: this.guideMeFormData.lifeProtectionData
    };
  }

  setLifeProtection(data) {
    this.guideMeFormData.lifeProtectionData = data;
    this.commit();
  }

  /* FinancialAssessment - Income, Expenses, Assets & Liabilities */
  getMyIncome(): IMyIncome {
    if (!this.guideMeFormData.income) {
      this.guideMeFormData.income = {} as IMyIncome;
    }
    return this.guideMeFormData.income;
  }

  setMyIncome(data: IMyIncome) {
    this.isMyIncomeFormValid = true;
    this.guideMeFormData.income = data;
    this.commit();
  }

  getMyExpenses(): IMyExpenses {
    if (!this.guideMeFormData.expenses) {
      this.guideMeFormData.expenses = {} as IMyExpenses;
    }
    return this.guideMeFormData.expenses;
  }

  setMyExpenses(data: IMyExpenses) {
    this.isMyExpensesFormValid = true;
    this.guideMeFormData.expenses = data;
    this.commit();
  }

  getMyAssets(): IMyAssets {
    if (!this.guideMeFormData.assets) {
      this.guideMeFormData.assets = {} as IMyAssets;
    }
    return this.guideMeFormData.assets;
  }

  setMyAssets(data: IMyAssets) {
    this.guideMeFormData.assets = data;
    this.commit();
  }

  getMyLiabilities(): IMyLiabilities {
    if (!this.guideMeFormData.liabilities) {
      this.guideMeFormData.liabilities = {} as IMyLiabilities;
    }
    return this.guideMeFormData.liabilities;
  }

  setMyLiabilities(data: IMyLiabilities) {
    this.isMyExpensesFormValid = true;
    this.guideMeFormData.liabilities = data;
    this.commit();
  }

  getCiAssessment(): CriticalIllnessData {
    if (!this.guideMeFormData.criticalIllness) {
      this.guideMeFormData.criticalIllness = { coverageYears: 65 } as CriticalIllnessData;
    }
    return this.guideMeFormData.criticalIllness;
  }

  setCiAssessment(data: CriticalIllnessData) {
    this.guideMeFormData.criticalIllness = {
      coverageAmount: data.coverageAmount,
      coverageYears: data.coverageYears,
      isEarlyCriticalIllness: false,
      annualSalary: data.annualSalary,
      ciMultiplier: data.ciMultiplier
    } as CriticalIllnessData;
    this.commit();
  }

  getMyOcpDisability(): IMyOcpDisability {
    if (!this.guideMeFormData.occupationalDisability) {
      this.guideMeFormData.occupationalDisability = {} as IMyOcpDisability;
    }
    return this.guideMeFormData.occupationalDisability;
  }

  setMyOcpDisability(data: IMyOcpDisability) {
    this.isMyOcpDisabilityFormValid = true;
    this.guideMeFormData.occupationalDisability = data;
    this.commit();
  }

  getLongTermCare(): LongTermCare {
    if (!this.guideMeFormData.longTermCareData) {
      this.guideMeFormData.longTermCareData = {} as LongTermCare;
    }
    return this.guideMeFormData.longTermCareData;
  }

  setLongTermCare(data) {
    this.isLongTermCareFormValid = true;
    this.guideMeFormData.longTermCareData = data;
    this.commit();
  }

  getHospitalPlan(): HospitalPlan {
    if (!this.guideMeFormData.hospitalPlanData) {
      this.guideMeFormData.hospitalPlanData = {} as HospitalPlan;
    }
    return this.guideMeFormData.hospitalPlanData;
  }

  setHospitalPlan(data) {
    this.isHospitalPlanFormValid = true;
    this.guideMeFormData.hospitalPlanData = data;
    this.commit();
  }

  /*Additions of currency Values */
  additionOfCurrency(formValues) {
    let sum: any = 0;
    for (const i in formValues) {
      if (formValues[i] !== null && formValues[i] !== '') {
        const Regexp = new RegExp('[,]', 'g');
        let thisValue: any = (formValues[i] + '').replace(Regexp, '');
        thisValue = parseInt(formValues[i], 10);
        if (!isNaN(thisValue)) {
          if (i === 'annualBonus') {
            sum += thisValue !== 0 ? thisValue / 12 : 0;
          } else {
            sum += parseInt(thisValue, 10);
          }
        }
      }
    }
    return sum.toFixed();
  }

  currentFormError(form) {
    const invalid = [];
    const invalidFormat = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        invalidFormat.push(Object.keys(controls[name]['errors']));
      }
    }
    return this.getFormError(invalid[0], invalidFormat[0][0]);
  }

  getFormError(formCtrlName: string, validation: string): string {
    return this.formError.formFieldErrors[formCtrlName][validation];
  }

  getSelectedProtectionNeedsList() {
    const selectedProtectionNeeds = [];
    const protectionNeeds = this.getProtectionNeeds();
    for (const thisNeed of protectionNeeds) {
      if (thisNeed.status) {
        selectedProtectionNeeds.push(thisNeed);
      }
    }
    return selectedProtectionNeeds;
  }

  getNextProtectionNeedsPage() {
    const selectedProtectionNeedsPage = [];
    const protectionNeeds = this.getSelectedProtectionNeedsList();
    for (const thisNeed of protectionNeeds) {
      switch (thisNeed.protectionTypeId) {
        case PROTECTION_NEEDS_LIFE_PROTECTION_ID:
          selectedProtectionNeedsPage.push(GUIDE_ME_ROUTE_PATHS.LIFE_PROTECTION);
          break;
        case PROTECTION_NEEDS_CRITICAL_ILLNESS_ID:
          selectedProtectionNeedsPage.push(GUIDE_ME_ROUTE_PATHS.CRITICAL_ILLNESS);
          break;
        case PROTECTION_NEEDS_OCCUPATIONAL_DISABILITY_ID:
          selectedProtectionNeedsPage.push(GUIDE_ME_ROUTE_PATHS.OCCUPATIONAL_DISABILITY);
          break;
        case PROTECTION_NEEDS_LIFE_HOSPITAL_PLAN_ID:
          selectedProtectionNeedsPage.push(GUIDE_ME_ROUTE_PATHS.HOSPITAL_PLAN);
          break;
        case PROTECTION_NEEDS_LIFE_LONG_TERM_CARE_ID:
          selectedProtectionNeedsPage.push(GUIDE_ME_ROUTE_PATHS.LONG_TERM_CARE);
          break;
      }
    }

    if (this.protectionNeedsPageIndex < selectedProtectionNeedsPage.length) {
      return selectedProtectionNeedsPage[this.protectionNeedsPageIndex];
    } else {
      this.setInsuranceResultsModalCounter(0);
      return GUIDE_ME_ROUTE_PATHS.INSURANCE_RESULTS;
    }
  }

  clearProtectionNeedsData() {
    delete this.guideMeFormData.lifeProtectionData;
    delete this.guideMeFormData.criticalIllness;
    delete this.guideMeFormData.occupationalDisability;
    delete this.guideMeFormData.hospitalPlanData;
    delete this.guideMeFormData.longTermCareData;
    this.commit();
  }

  getProtectionNeedsResults() {
    console.log('get Protection Needs Triggered');
    let selectedProtectionNeeds = [];
    selectedProtectionNeeds = this.getProtectionNeeds();
    if (selectedProtectionNeeds) {
      selectedProtectionNeeds.forEach((protectionNeed) => {
        this.protectionNeedsArray.push(this.createProtectionNeedResult(protectionNeed));
      });
      return this.protectionNeedsArray;
    }
  }

  getExistingCoverage(): IExistingCoverage[] {
    return [{}] as IExistingCoverage[];
  }

  createProtectionNeedResult(data) {
    this.result_title = data.protectionType;
    this.result_icon = (data.protectionType.replaceAll(' ', '-')) + '-icon.svg';
    switch (data.protectionType) {
      case 'Life Protection':
        break;
      case 'Critical Illness':
        break;
      case 'Occupational Disability':
        break;
      case 'Long Term Care':
        break;
      case 'Hospital Plan':
        this.result_value = null;
        break;
    }
  }

  setInsuranceResultsModalCounter(value: number) {
    if (window.sessionStorage) {
      sessionStorage.setItem(INSURANCE_RESULTS_COUNTER_KEY, value.toString());
    }
  }

  getInsuranceResultsModalCounter() {
    return parseInt(sessionStorage.getItem(INSURANCE_RESULTS_COUNTER_KEY), 10);
  }
}
