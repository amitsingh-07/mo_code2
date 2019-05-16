import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConstants } from './../app.constants';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { IMyFinancials } from './my-financials/my-financials.interface';
import { PersonalFormError } from './personal-info/personal-form-error';
import { PersonalInfo } from './personal-info/personal-info';
import { PortfolioFormData } from './portfolio-form-data';
import { PORTFOLIO_CONFIG } from './portfolio.constants';

const PORTFOLIO_RECOMMENDATION_COUNTER_KEY = 'portfolio_recommendation-counter';
const SESSION_STORAGE_KEY = 'app_engage_journey_session';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioFormData: PortfolioFormData = new PortfolioFormData();
  private personalFormError: any = new PersonalFormError();
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    public authService: AuthenticationService
  ) {
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
      // dob: this.portfolioFormData.dob,
      investmentPeriod: this.portfolioFormData.investmentPeriod
    };
  }

  // Risk Profile
  getRiskProfile() {
    return {
      riskProfileId: this.portfolioFormData.riskProfileId,
      riskProfileName: this.portfolioFormData.riskProfileName,
      htmlDescription: this.portfolioFormData.htmlDescription,
      alternateRiskProfileId: this.portfolioFormData.alternateRiskProfileId,
      alternateRiskProfileType: this.portfolioFormData.alternateRiskProfileType
    };
  }

  setRiskProfile(data) {
    this.portfolioFormData.riskProfileId = data.primaryRiskProfileId;
    this.portfolioFormData.riskProfileName = data.primaryRiskProfileType;
    this.portfolioFormData.htmlDescription = data.htmlDescObject;
    this.portfolioFormData.alternateRiskProfileId = data.alternateRiskProfileId;
    this.portfolioFormData.alternateRiskProfileType = data.alternateRiskProfileType;

    this.commit();
  }
  setSelectedRiskProfileId(RiskProfileID) {
    this.portfolioFormData.selectedriskProfileId = RiskProfileID;
  }
  getSelectedRiskProfileId() {
    return {
      riskProfileId: this.portfolioFormData.selectedriskProfileId
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

  // tslint:disable-next-line:cognitive-complexity
  doFinancialValidations(form) {
    if (form.value.firstChkBox && form.value.secondChkBox) {
      // tslint:disable-next-line:max-line-length
      if (
        Number(this.removeCommas(form.value.initialInvestment)) <
        PORTFOLIO_CONFIG.my_financials.min_initial_amount &&
        Number(this.removeCommas(form.value.monthlyInvestment)) <
        PORTFOLIO_CONFIG.my_financials.min_monthly_amount
      ) {
        return this.personalFormError.formFieldErrors['financialValidations']['one'];
      } else if (
        Number(this.removeCommas(form.value.monthlyInvestment)) <
        PORTFOLIO_CONFIG.my_financials.min_monthly_amount
      ) {
        return this.personalFormError.formFieldErrors['financialValidations']['two'];
      } else if (
        Number(this.removeCommas(form.value.initialInvestment)) <
        PORTFOLIO_CONFIG.my_financials.min_initial_amount
      ) {
        return this.personalFormError.formFieldErrors['financialValidations']['three'];
      }
    } else if (form.value.firstChkBox) {
      if (
        Number(this.removeCommas(form.value.initialInvestment)) <
        PORTFOLIO_CONFIG.my_financials.min_initial_amount
      ) {
        return this.personalFormError.formFieldErrors['financialValidations']['three'];
      }
    } else if (form.value.secondChkBox) {
      if (
        Number(this.removeCommas(form.value.monthlyInvestment)) <
        PORTFOLIO_CONFIG.my_financials.min_monthly_amount
      ) {
        return this.personalFormError.formFieldErrors['financialValidations']['two'];
      }
    } else {
      return this.personalFormError.formFieldErrors['financialValidations']['four'];
    }
    // tslint:disable-next-line:triple-equals
    if (
      Number(this.removeCommas(form.value.initialInvestment)) === 0 &&
      Number(this.removeCommas(form.value.monthlyInvestment)) === 0
    ) {
      return this.personalFormError.formFieldErrors['financialValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(this.removeCommas(form.value.initialInvestment)) < 100 &&
      Number(this.removeCommas(form.value.monthlyInvestment)) < 50
    ) {
      return this.personalFormError.formFieldErrors['financialValidations']['more'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(this.removeCommas(form.value.initialInvestment)) >
      Number(this.removeCommas(form.value.totalAssets)) &&
      Number(this.removeCommas(form.value.monthlyInvestment)) >
      (Number(this.removeCommas(form.value.percentageOfSaving)) *
        Number(this.removeCommas(form.value.monthlyIncome)) / 100)
    ) {
      return this.personalFormError.formFieldErrors['financialValidations'][
        'moreassetandinvestment'
      ];
    } else if (
      Number(this.removeCommas(form.value.initialInvestment)) >
      Number(this.removeCommas(form.value.totalAssets))
    ) {
      return this.personalFormError.formFieldErrors['financialValidations']['moreasset'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(this.removeCommas(form.value.monthlyInvestment)) >
      (Number(this.removeCommas(form.value.percentageOfSaving)) *
        Number(this.removeCommas(form.value.monthlyIncome)) / 100)
    ) {
      return this.personalFormError.formFieldErrors['financialValidations'][
        'moreinvestment'
      ];
    } else {
      return false;
    }
  }
  // tslint:disable-next-line:cognitive-complexity
  removeCommas(str) {
    if (str) {
      if (str.length > 3) {
        while (str.search(',') >= 0) {
          str = (str + '').replace(',', '');
        }
      }
    }
    return str;
  }

  setPersonalInfo(data: PersonalInfo) {
    this.portfolioFormData.investmentPeriod = data.investmentPeriod;
    this.commit();
  }

  // RISK ASSESSMENT
  getQuestionsList() {
    return this.apiService.getQuestionsList();
  }
  constructGetQuestionsRequest() { }

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
    const selAnswers = [
      {
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
      }
    ];
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
      suffEmergencyFund: this.portfolioFormData.suffEmergencyFund,
      oneTimeInvestmentChkBox: this.portfolioFormData.oneTimeInvestmentChkBox,
      monthlyInvestmentChkBox: this.portfolioFormData.monthlyInvestmentChkBox
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
    this.portfolioFormData.oneTimeInvestmentChkBox = formData.firstChkBox;
    this.portfolioFormData.monthlyInvestmentChkBox = formData.secondChkBox;
    this.commit();
  }

  // SAVE FOR STEP 1
  savePersonalInfo() {
    const payload = this.constructInvObjectiveRequest();
    return this.apiService.savePersonalInfo(payload);
  }
  constructInvObjectiveRequest() {
    const formData = this.getPortfolioFormData();
    const enquiryIdValue = Number(this.authService.getEnquiryId());
    return {
      investmentPeriod: formData.investmentPeriod,
      monthlyIncome: formData.monthlyIncome,
      initialInvestment: formData.initialInvestment,
      monthlyInvestment: formData.monthlyInvestment,
      percentageOfSaving: formData.percentageOfSaving,
      totalAssets: formData.totalAssets,
      totalLiabilities: formData.totalLiabilities,
      enquiryId: enquiryIdValue
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
    const urlParams = this.buildQueryString(params);
    return this.apiService.getPortfolioAllocationDetails(urlParams);
  }

  getFundDetails() {
    return this.portfolioFormData.fundDetails;
  }

  setFundDetails(fundDetails) {
    this.portfolioFormData.fundDetails = fundDetails;
    this.commit();
  }

  // tslint:disable-next-line:cognitive-complexity
  sortByProperty(list, prop, order) {
    list.sort((a, b) => {
      const itemA = typeof a[prop] === 'string' ? a[prop].toLowerCase() : a[prop];
      const itemB = typeof b[prop] === 'string' ? b[prop].toLowerCase() : b[prop];
      if (order === 'asc') {
        if (itemA < itemB) {
          return -1;
        }
        if (itemA > itemB) {
          return 1;
        }
      } else {
        if (itemA > itemB) {
          return -1;
        }
        if (itemA < itemB) {
          return 1;
        }
      }
      return 0;
    });
  }

  clearFormData() {
    this.portfolioFormData = new PortfolioFormData();
    this.commit();
  }

  clearData() {
    this.clearFormData();
    if (window.sessionStorage) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(PORTFOLIO_RECOMMENDATION_COUNTER_KEY);
    }
  }

  buildQueryString(parameters) {
    let qs = '';
    Object.keys(parameters).forEach((key) => {
      const value = parameters[key];
      qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
    });
    if (qs.length > 0) {
      qs = qs.substring(0, qs.length - 1);
    }
    return '?' + qs;
  }
  verifyPromoCode(promoCodeData) {
    const promoCodeType = appConstants.INVESTMENT_PROMO_CODE_TYPE;
    const promoCode = {
      promoCode: promoCodeData,
      sessionId: this.authService.getSessionId(),
      promoCodeCat: promoCodeType
    };
    return this.apiService.verifyPromoCode(promoCode);
  }
}
