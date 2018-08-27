import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { IMyFinancials } from './my-financials/my-financials.interface';
import { PersonalFormError } from './personal-info/personal-form-error';
import { PersonalInfo } from './personal-info/personal-info';
import { PortfolioFormData } from './portfolio-form-data';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private portfolioFormData: PortfolioFormData = new PortfolioFormData();
  private personalFormError: any = new PersonalFormError();
  //private myFinanacialFormError : any = new MyFinanacialFormError ();

  constructor(private http: HttpClient, private apiService: ApiService) {
  }

  getPortfolioFormData(): PortfolioFormData {
    let formData = this.portfolioFormData;
    //formData.dateOfBirth = formData.dateOfBirth.day
    return this.portfolioFormData;
  }


  //PERSONAL INFO
  getPersonalInfo() {
    return {
      dob: this.portfolioFormData.dateOfBirth,
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
    return this.personalFormError.formFieldErrors[formCtrlName][validation];
    
  }
  setUserInfo(data:PersonalInfo) {
    this.portfolioFormData.dateOfBirth = data.dateOfBirth;
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
      percentageOfSaving: this.portfolioFormData.percentageOfSaving,
      totalAssets: this.portfolioFormData.totalAssets,
      totalLiabilities: this.portfolioFormData.totalLiabilities,
      initialInvestment: this.portfolioFormData.initialInvestment,
      monthlyInvestment: this.portfolioFormData.monthlyInvestment,
      suffEmergencyFund: this.portfolioFormData.suffEmergencyFund
    }; 
  }
  setMyFinancials(formData){
    this.portfolioFormData.monthlyIncome = formData.monthlyIncome;
    this.portfolioFormData.percentageOfSaving = formData.myIncomeSaved;
    this.portfolioFormData.totalAssets = formData.totalAssets;
    this.portfolioFormData.totalLiabilities = formData.totalLoans;
    this.portfolioFormData.initialInvestment = formData.initialInvestment;
    this.portfolioFormData.monthlyInvestment = formData.monthlyInvestment;
    this.portfolioFormData.suffEmergencyFund = formData.suffEmergencyFund;
  }
  
  //SAVE FOR STEP 1
  savePersonalInfo(){
    const data = this.getPortfolioFormData();
    return this.apiService.savePersonalInfo(data);
  }

}
 