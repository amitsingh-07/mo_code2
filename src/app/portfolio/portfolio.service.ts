import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { PortfolioFormData } from './portfolio-form-data';
import {PersonalFormError} from './personal-info/Personal-form-error';
import { PersonalInfo } from './personal-info/personal-info';

import { IMyFinancials } from './my-financials/my-financials.interface';
import {MyFinanacialFormError} from './my-financials/my-financials-form-error';

const PROTECTION_NEEDS_LIFE_PROTECTION_ID = 1;
const PROTECTION_NEEDS_CRITICAL_ILLNESS_ID = 2;
const PROTECTION_NEEDS_OCCUPATIONAL_DISABILITY_ID = 3;
const PROTECTION_NEEDS_LIFE_HOSPITAL_PLAN_ID = 4;
const PROTECTION_NEEDS_LIFE_LONG_TERM_CARE_ID = 5;

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private portfolioFormData: PortfolioFormData = new PortfolioFormData();
  private personalFormError: any = new PersonalFormError();
  private myFinanacialFormError : any = new MyFinanacialFormError ();

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getPortfolioFormData(): PortfolioFormData {
    return this.portfolioFormData;
  }


  //PERSONAL INFO
  getPersonalInfo() {
    return {
      dob: this.portfolioFormData.dob,
      investmentPeriod:this.portfolioFormData.investmentPeriod
    };
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
    //return this.personalFormError.formFieldErrors[formCtrlName][validation];
    return this.myFinanacialFormError.formFieldErrors[formCtrlName][validation];
  }
  setUserInfo(data:PersonalInfo) {
    this.portfolioFormData.dob = data.dob;
    this.portfolioFormData.investmentPeriod=data.investmentPeriod;
  }

  //RISK ASSESSMENT
  getQuestionsList() {
    return this.apiService.getQuestionsList();
  }
  getSelectedOptionByIndex(index){
    return this.portfolioFormData["riskAssessQuest" + index];
  }
  setRiskAssessment(data, questionIndex) {
    this.portfolioFormData["riskAssessQuest" + questionIndex] = data;
  }

  //MY FINANCIALS
  getMyFinancials(): IMyFinancials {
    return {
      monthlyIncome: this.portfolioFormData.monthlyIncome,
      myIncomeSaved: this.portfolioFormData.myIncomeSaved,
      totalAssets: this.portfolioFormData.totalAssets,
      totalLoans: this.portfolioFormData.totalLoans,
      initialDeposit: this.portfolioFormData.initialDeposit,
      monthlyDeposit: this.portfolioFormData.monthlyDeposit,
      suffEmergencyFund: this.portfolioFormData.suffEmergencyFund
    };
  }
}
 