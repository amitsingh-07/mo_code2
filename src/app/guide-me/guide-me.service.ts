import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { CiAssessment } from './ci-assessment/ci-assessment';
import { IMyExpenses } from './expenses/expenses.interface';
import { FormError } from './get-started/get-started-form/form-error';
import { UserInfo } from './get-started/get-started-form/user-info';
import { GuideMeFormData } from './guide-me-form-data';
import { GUIDE_ME_ROUTE_PATHS } from './guide-me-routes.constants';
import { HospitalPlan } from './hospital-plan/hospital-plan';
import { IMyIncome } from './income/income.interface';
import { IMyLiabilities } from './liabilities/liabilities.interface';
import { LongTermCare } from './ltc-assessment/ltc-assessment';
import { IMyAssets } from './my-assets/my-assets.interface';
import { IMyOcpDisability } from './ocp-disability/ocp-disability.interface';
import { Profile } from './profile/profile';
import { ProtectionNeeds } from './protection-needs/protection-needs';

const LOCAL_STORAGE_KEY = 'app_local_storage_key';

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

  // Variables for Insurance Results Generation
  private result_title: string;
  private result_icon: string;
  private result_value;

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.getGuideMeFormData();
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.guideMeFormData));
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
    if (window.sessionStorage && sessionStorage.getItem(LOCAL_STORAGE_KEY)) {
      this.guideMeFormData = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_KEY));
    }
    return this.guideMeFormData;
  }

  getProfileList() {
    return this.apiService.getProfileList();
  }

  getProtectionNeeds(): ProtectionNeeds {
    return {
      protectionNeedData: this.guideMeFormData.protectionNeedData
    };
  }

  setProtectionNeeds(data) {
    this.isProtectionNeedFormValid = true;
    this.guideMeFormData.protectionNeedData = data;
    this.commit();
  }

  getProtectionNeedsList() {
    const userInfoForm: any = {
      profileId: this.guideMeFormData.myProfile,
      birthDate: this.guideMeFormData.customDob
    };
    return this.apiService.getProtectionNeedsList(userInfoForm);
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
      this.guideMeFormData.income = {
        monthlySalary: 0,
        annualBonus: 0,
        otherIncome: 0
      };
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
      this.guideMeFormData.expenses = {
        monthlyInstallments: 0,
        livingExpenses: 0,
        otherExpenses: 0
      };
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
      this.guideMeFormData.assets = {
        cash: 0,
        cpf: 0,
        homeProperty: 0,
        investmentProperties: 0,
        otherInvestments: 0,
        otherAssets: 0
      };
    }
    return this.guideMeFormData.assets;
  }

  setMyAssets(data: IMyAssets) {
    this.guideMeFormData.assets = data;
    this.commit();
  }

  getMyLiabilities(): IMyLiabilities {
    if (!this.guideMeFormData.liabilities) {
      this.guideMeFormData.liabilities = {
        propertyLoan: 0,
        carLoan: 0,
        otherLoan: 0
      };
    }
    return this.guideMeFormData.liabilities;
  }

  setMyLiabilities(data: IMyLiabilities) {
    this.isMyExpensesFormValid = true;
    this.guideMeFormData.liabilities = data;
    this.commit();
  }

  getCiAssessment(): CiAssessment {
    return {
      ciCoverageAmt: this.guideMeFormData.ciCoverageAmt,
      // annualSalary: this.guideMeFormData.monthlySalary * 12,
      annualSalary: 2200 * 12,
      ciMultiplier: this.guideMeFormData.ciMultiplier,
      untilRetirementAge: this.guideMeFormData.untilRetirementAge
    };
  }

  setCiAssessment(data: CiAssessment) {
    this.guideMeFormData.ciCoverageAmt = data.ciCoverageAmt;
    this.guideMeFormData.ciMultiplier = data.ciMultiplier;
    this.guideMeFormData.untilRetirementAge = data.untilRetirementAge;
    this.commit();
  }

  getMyOcpDisability(): IMyOcpDisability {
    return {
      coverageAmount: this.guideMeFormData.coverageAmount,
      sliderValue: this.guideMeFormData.sliderValue,
      retirementAge: this.guideMeFormData.retirementAge,
      selectedEmployee: this.guideMeFormData.selectedEmployee
    };
  }

  setMyOcpDisability(data: IMyOcpDisability) {
    this.isMyOcpDisabilityFormValid = true;
    this.guideMeFormData.coverageAmount = data.coverageAmount;
    this.guideMeFormData.sliderValue = data.sliderValue;
    this.guideMeFormData.retirementAge = data.retirementAge;
    this.guideMeFormData.selectedEmployee = data.selectedEmployee;
    this.commit();
  }

  getLongTermCare(): LongTermCare {
    return {
      longTermCareData: this.guideMeFormData.longTermCareData
    };
  }

  setLongTermCare(data) {
    this.isLongTermCareFormValid = true;
    this.guideMeFormData.longTermCareData = data;
    this.commit();
  }

  getLongTermCareList() {
    return this.apiService.getLongTermCareList();
  }

  getHospitalPlan(): HospitalPlan {
    return {
      hospitalPlanData: this.guideMeFormData.hospitalPlanData
    };
  }

  setHospitalPlan(data) {
    this.isHospitalPlanFormValid = true;
    this.guideMeFormData.hospitalPlanData = data;
    this.commit();
  }

  getHospitalPlanList() {
    return this.apiService.getHospitalPlanList();
  }

  /*Additions of currency Values */
  additionOfCurrency(formValues) {
    let sum: any = 0;
    for (const i in formValues) {
      if (formValues[i] !== null && formValues[i] !== '') {
        const Regexp = new RegExp('[,]', 'g');
        let thisValue: any = (formValues[i] + '').replace(Regexp, '');
        thisValue = parseInt(formValues, 10);
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

  getNextProtectionNeedsPage() {
    const selectedProtectionNeeds = [];
    const protectionNeeds = this.getProtectionNeeds().protectionNeedData;
    for (const thisNeed of protectionNeeds) {
      if (thisNeed.status) {
        switch (thisNeed.protectionTypeId) {
          case PROTECTION_NEEDS_LIFE_PROTECTION_ID:
            selectedProtectionNeeds.push(GUIDE_ME_ROUTE_PATHS.LIFE_PROTECTION);
            break;
          case PROTECTION_NEEDS_CRITICAL_ILLNESS_ID:
            selectedProtectionNeeds.push(GUIDE_ME_ROUTE_PATHS.CRITICAL_ILLNESS);
            break;
          case PROTECTION_NEEDS_OCCUPATIONAL_DISABILITY_ID:
            selectedProtectionNeeds.push(GUIDE_ME_ROUTE_PATHS.OCCUPATIONAL_DISABILITY);
            break;
          case PROTECTION_NEEDS_LIFE_HOSPITAL_PLAN_ID:
            selectedProtectionNeeds.push(GUIDE_ME_ROUTE_PATHS.HOSPITAL_PLAN);
            break;
          case PROTECTION_NEEDS_LIFE_LONG_TERM_CARE_ID:
            selectedProtectionNeeds.push(GUIDE_ME_ROUTE_PATHS.LONG_TERM_CARE);
            break;
        }
      }
    }

    if (this.protectionNeedsPageIndex < selectedProtectionNeeds.length) {
      return selectedProtectionNeeds[this.protectionNeedsPageIndex];
    } else {
      return GUIDE_ME_ROUTE_PATHS.INSURANCE_RESULTS;
    }
  }

  getProtectionNeedsResults() {
    console.log('get Protection Needs Triggered');
    let selectedProtectionNeeds = [];
    selectedProtectionNeeds = this.getProtectionNeeds().protectionNeedData;
    if (selectedProtectionNeeds) {
      selectedProtectionNeeds.forEach((protectionNeed) => {
        this.protectionNeedsArray.push(this.createProtectionNeedResult(protectionNeed));
      });
      return this.protectionNeedsArray;
    }
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

  constructRecommendationsRequest() {

  }
}
