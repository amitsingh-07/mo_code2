import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from './../shared/http/api.service';
import { IMyAssets } from './assets/my-assets.interface';
import { IMyExpenses } from './expenses/expenses.interface';
import { FormError } from './get-started/get-started-form/form-error';
import { UserInfo } from './get-started/get-started-form/user-info';
import { GuideMeFormData } from './guide-me-form-data';
import { IMyIncome } from './income/income.interface';
import { Profile } from './profile/profile';
import { ProtectionNeeds } from './protection-needs/protection-needs';

@Injectable({
  providedIn: 'root'
})
export class GuideMeService {
  private guideMeFormData: GuideMeFormData = new GuideMeFormData();
  private formError: any = new FormError();
  private isProfileFormValid = false;
  private isProtectionNeedFormValid = false;
  isMyIncomeFormValid = false;
  isMyExpensesFormValid = false;

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getProfile(): Profile {
    const myProfile: Profile = {
      myProfile: this.guideMeFormData.myProfile
    };
    return myProfile;
  }

  setProfile(data: Profile) {
    this.isProfileFormValid = true;
    this.guideMeFormData.myProfile = data.myProfile;
  }

  getUserInfo(): UserInfo {
    const userInfoForm: UserInfo = {
      gender: this.guideMeFormData.gender,
      dob: this.guideMeFormData.dob,
      customDob: this.guideMeFormData.customDob,
      smoker: this.guideMeFormData.smoker,
      dependent: this.guideMeFormData.dependent
    };
    return userInfoForm;
  }

  setUserInfo(data: UserInfo) {
    this.isProfileFormValid = true;
    this.guideMeFormData.gender = data.gender;
    this.guideMeFormData.dob = data.dob;
    this.guideMeFormData.smoker = data.smoker;
    this.guideMeFormData.customDob = data.customDob;
    this.guideMeFormData.dependent = data.dependent;
  }

  getGuideMeFormData(): GuideMeFormData {
    // Return the entire GuideMe Form Data
    return this.guideMeFormData;
  }

  getProfileList() {
    return this.apiService.getProfileList();
  }

  getProtectionNeeds(): ProtectionNeeds {
    const protectionNeedData: ProtectionNeeds = {
      protectionNeedData: this.guideMeFormData.protectionNeedData
    };
    return protectionNeedData;
  }

  setProtectionNeeds(data) {
    this.isProtectionNeedFormValid = true;
    this.guideMeFormData.protectionNeedData = data;
  }

  getProtectionNeedsList() {
    const userInfoForm: any = {
      profileId: this.guideMeFormData.myProfile,
      birthDate: this.guideMeFormData.customDob
    };
    return this.apiService.getProtectionNeedsList(userInfoForm);
  }

  /* FinancialAssessment - Income, Expenses, Assets & Liabilities */
  getMyIncome(): IMyIncome {
    const myIncomeForm: IMyIncome = {
      monthlySalary: this.guideMeFormData.monthlySalary,
      annualBonus: this.guideMeFormData.annualBonus,
      otherIncome: this.guideMeFormData.otherIncome
    };
    return myIncomeForm;
  }

  setMyIncome(data: IMyIncome) {
    this.isMyIncomeFormValid = true;
    this.guideMeFormData.monthlySalary = data.monthlySalary;
    this.guideMeFormData.annualBonus = data.annualBonus;
    this.guideMeFormData.otherIncome = data.otherIncome;
  }

  getMyExpenses(): IMyExpenses {
    const myExpensesForm: IMyExpenses = {
      monthlyInstallment: this.guideMeFormData.monthlyInstallment,
      otherExpenses: this.guideMeFormData.otherExpenses
    };
    return myExpensesForm;
  }

  setMyExpenses(data: IMyExpenses) {
    this.isMyExpensesFormValid = true;
    this.guideMeFormData.monthlyInstallment = data.monthlyInstallment;
    this.guideMeFormData.otherExpenses = data.otherExpenses;
  }

  getMyAssets(): IMyAssets {
    const myAssetsForm: IMyAssets = {
      cash: this.guideMeFormData.cash,
      cpf: this.guideMeFormData.cpf,
      homeProperty: this.guideMeFormData.homeProperty,
      investmentProperties: this.guideMeFormData.investmentProperties,
      investments: this.guideMeFormData.investments,
      others: this.guideMeFormData.others,
    };
    return myAssetsForm;
  }

  setMyAssets(data: IMyAssets) {
    this.isMyExpensesFormValid = true;
    this.guideMeFormData.cash = data.cash;
    this.guideMeFormData.cpf = data.cpf;
    this.guideMeFormData.homeProperty = data.homeProperty;
    this.guideMeFormData.investmentProperties = data.investmentProperties;
    this.guideMeFormData.investments = data.investments;
    this.guideMeFormData.others = data.others;
  }

  /*Additions of currency Values */
  additionOfCurrency(formValues) {
    let sum: any = 0;
    for (const i in formValues) {
      if (formValues[i] !== null && formValues[i] !== '' && !isNaN(formValues[i])) {
        if (i === 'annualBonus') {
          sum += formValues[i] !== 0 ? formValues[i] / 12 : 0;
        } else {
          sum += parseInt(formValues[i], 10);
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
}
