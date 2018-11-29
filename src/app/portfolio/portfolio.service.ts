import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { IMyFinancials } from './my-financials/my-financials.interface';
import { PersonalFormError } from './personal-info/personal-form-error';
import { PersonalInfo } from './personal-info/personal-info';
import { PortfolioFormData } from './portfolio-form-data';
import { RiskProfile } from './risk-profile/riskprofile';
const PORTFOLIO_RECOMMENDATION_COUNTER_KEY = 'portfolio_recommendation-counter';
const SESSION_STORAGE_KEY = 'app_engage_journey_session';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private portfolioFormData: PortfolioFormData = new PortfolioFormData();
  private personalFormError: any = new PersonalFormError();
  constructor(private http: HttpClient, private apiService: ApiService, public authService: AuthenticationService) {
    this.getPortfolioFormData();
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.portfolioFormData));
    }
  }

  getPortfolioFormData(): PortfolioFormData {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.portfolioFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.portfolioFormData;
  }

  // GET PERSONAL INFO
  getPersonalInfo() {
    return {
      dob: this.portfolioFormData.dob,
      investmentPeriod: this.portfolioFormData.investmentPeriod
    };
  }

  // Risk Profile
  getRiskProfile() {
    return {
      riskProfileId: this.portfolioFormData.riskProfileId,
      riskProfileName: this.portfolioFormData.riskProfileName,
      htmlDescription: this.portfolioFormData.htmlDescription
    };
  }

  setRiskProfile(data) {
    this.portfolioFormData.riskProfileId = data.id;
    this.portfolioFormData.riskProfileName = data.type;
    this.portfolioFormData.htmlDescription = data.htmlDesc;
    this.commit();
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
    return this.personalFormError.formFieldErrors[formCtrlName][validation];
  }

  doFinancialValidations(form) {
    const invalid = [];
    // tslint:disable-next-line:triple-equals
    if (Number(this.removeCommas(form.value.initialInvestment)) == 0 && Number(this.removeCommas(form.value.monthlyInvestment)) == 0) {
      invalid.push(this.personalFormError.formFieldErrors['financialValidations']['zero']);
      return this.personalFormError.formFieldErrors['financialValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (Number(this.removeCommas(form.value.initialInvestment)) <= 100 && Number(this.removeCommas(form.value.monthlyInvestment)) <= 50) {
      invalid.push(this.personalFormError.formFieldErrors['financialValidations']['more']);
      return this.personalFormError.formFieldErrors['financialValidations']['more'];
      // tslint:disable-next-line:max-line-length
    } else if (Number(this.removeCommas(form.value.initialInvestment)) > Number(this.removeCommas(form.value.totalAssets)) && Number(this.removeCommas(form.value.monthlyInvestment)) > Number(this.removeCommas(form.value.percentageOfSaving)) * Number(this.removeCommas(form.value.monthlyIncome))) {
      invalid.push(this.personalFormError.formFieldErrors['financialValidations']['moreassetandinvestment']);
      return this.personalFormError.formFieldErrors['financialValidations']['moreassetandinvestment'];
    } else if (Number(this.removeCommas(form.value.initialInvestment)) > Number(this.removeCommas(form.value.totalAssets))) {
      invalid.push(this.personalFormError.formFieldErrors['financialValidations']['moreasset']);
      return this.personalFormError.formFieldErrors['financialValidations']['moreasset'];
      // tslint:disable-next-line:max-line-length
    } else if (Number(this.removeCommas(form.value.monthlyInvestment)) > Number(this.removeCommas(form.value.percentageOfSaving)) * Number(this.removeCommas(form.value.monthlyIncome))) {
      invalid.push(this.personalFormError.formFieldErrors['financialValidations']['moreinvestment']);
      return this.personalFormError.formFieldErrors['financialValidations']['moreinvestment'];
    } else {
      return false;
    }
  }

  removeCommas(str) {
  if(str.lenght>3)
  {
    while (str.search(',') >= 0) {
      str = (str + '').replace(',', '');
    }
  }
    return str;
  }

  setPersonalInfo(data: PersonalInfo) {
    this.portfolioFormData.dob = data.dob;
    this.portfolioFormData.investmentPeriod = data.investmentPeriod;
    this.commit();
  }

  // RISK ASSESSMENT
  getQuestionsList() {
    return this.apiService.getQuestionsList();
  }
  constructGetQuestionsRequest() {
  }

  getSelectedOptionByIndex(index) {
    return this.portfolioFormData['riskAssessQuest' + index];
  }
  setRiskAssessment(data, questionIndex) {
    this.portfolioFormData['riskAssessQuest' + questionIndex] = data;
    this.commit();
  }

  // SAVE FOR STEP 2
  saveRiskAssessment() {
    const data = this.constructRiskAssessmentSaveRequest();
    return this.apiService.saveRiskAssessment(data);
  }
  constructRiskAssessmentSaveRequest() {
    const formData = this.getPortfolioFormData();
    const selAnswers = [{
      questionOptionId: formData.riskAssessQuest1
    },
    {
      questionOptionId: formData.riskAssessQuest2
    },
    {
      questionOptionId: formData.riskAssessQuest3
    },
    {
      questionOptionId: formData.riskAssessQuest4
    },
    {
      questionOptionId: formData.riskAssessQuest5
    }];
    return {
      enquiryId: this.authService.getEnquiryId(),
      answers: selAnswers
    };
  }

  // MY FINANCIALS
  getMyFinancials(): IMyFinancials {
    return {
      monthlyIncome: this.portfolioFormData.monthlyIncome,
      percentageOfSaving: this.portfolioFormData.percentageOfSaving,
      totalAssets: this.portfolioFormData.totalAssets,
      totalLiabilities: this.portfolioFormData.totalLiabilities,
      initialInvestment: this.portfolioFormData.initialInvestment,
      monthlyInvestment: this.portfolioFormData.monthlyInvestment,
      suffEmergencyFund: this.portfolioFormData.suffEmergencyFund
    };
  }
  setMyFinancials(formData) {
    this.portfolioFormData.monthlyIncome = formData.monthlyIncome;
    this.portfolioFormData.percentageOfSaving = formData.percentageOfSaving;
    this.portfolioFormData.totalAssets = formData.totalAssets;
    this.portfolioFormData.totalLiabilities = formData.totalLiabilities;
    this.portfolioFormData.initialInvestment = formData.initialInvestment;
    this.portfolioFormData.monthlyInvestment = formData.monthlyInvestment;
    this.portfolioFormData.suffEmergencyFund = formData.suffEmergencyFund;
    this.commit();
  }

  // SAVE FOR STEP 1
  savePersonalInfo() {
    const payload = this.constructInvObjectiveRequest();
    return this.apiService.savePersonalInfo(payload);
  }
  constructInvObjectiveRequest() {
    const formData = this.getPortfolioFormData();
    return {
      investmentPeriod: formData.investmentPeriod,
      monthlyIncome: formData.monthlyIncome,
      initialInvestment: formData.initialInvestment,
      monthlyInvestment: formData.monthlyInvestment,
      dateOfBirth: formData.dob.day + '-' + formData.dob.month + '-' + formData.dob.year,
      percentageOfSaving: formData.percentageOfSaving,
      totalAssets: formData.totalAssets,
      totalLiabilities: formData.totalLiabilities
    };
  }

  setPortfolioSplashModalCounter(value: number) {
    if (window.sessionStorage) {
      sessionStorage.setItem(PORTFOLIO_RECOMMENDATION_COUNTER_KEY, value.toString());
    }
  }

  getPortfolioRecommendationModalCounter() {
    return parseInt(sessionStorage.getItem(PORTFOLIO_RECOMMENDATION_COUNTER_KEY), 10);
  }
  getPortfolioAllocationDetails(params) {
    const urlParams = this.constructQueryParams(params);
    return this.apiService.getPortfolioAllocationDetails(urlParams);
  }

  constructQueryParams(options) {
    const objectKeys = Object.keys(options);
    const params = new URLSearchParams();
    Object.keys(objectKeys).map((e) => {
      params.set(objectKeys[e], options[objectKeys[e]]);
    });
    return '?' + params.toString();
  }

  setFund(fund) {
    this.portfolioFormData.selectedFund = fund;
    this.commit();
  }
  getSelectedFund() {
    return this.portfolioFormData.selectedFund;
  }
  getAllTransactions() {
      return this.apiService.getAllTransactions();
  }
}
