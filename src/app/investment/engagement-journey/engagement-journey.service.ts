import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConstants } from '../../app.constants';

import { ApiService } from '../../shared/http/api.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { IMyFinancials } from './your-financials/your-financials.interface';
import { InvestmentPeriodFormError } from './investment-period/investment-period-form-error';
import { PersonalInfo } from './investment-period/investment-period';
import { EngagementJourneyFormData } from './engagement-journey-form-data';
import { ENGAGEMENT_JOURNEY_CONSTANTS } from './engagement-journey.constants';

const PORTFOLIO_RECOMMENDATION_COUNTER_KEY = 'portfolio_recommendation-counter';
const SESSION_STORAGE_KEY = 'app_engage_journey_session';

@Injectable({
  providedIn: 'root'
})
export class EngagementJourneyService {
  private EngagementJourneyFormData: EngagementJourneyFormData = new EngagementJourneyFormData();
  private InvestmentPeriodFormError: any = new InvestmentPeriodFormError();
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    public authService: AuthenticationService
  ) {
    this.getPortfolioFormData();
  }

  commit() {
    if (window.sessionStorage) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.EngagementJourneyFormData));
    }
  }

  getPortfolioFormData(): EngagementJourneyFormData {
    if (window.sessionStorage && sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      this.EngagementJourneyFormData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
    }
    return this.EngagementJourneyFormData;
  }

  // GET PERSONAL INFO
  getPersonalInfo() {
    return {
      // dob: this.EngagementJourneyFormData.dob,
      investmentPeriod: this.EngagementJourneyFormData.investmentPeriod
    };
  }

  // Risk Profile
  getRiskProfile() {
    return {
      riskProfileId: this.EngagementJourneyFormData.riskProfileId,
      riskProfileName: this.EngagementJourneyFormData.riskProfileName,
      htmlDescription: this.EngagementJourneyFormData.htmlDescription,
      alternateRiskProfileId: this.EngagementJourneyFormData.alternateRiskProfileId,
      alternateRiskProfileType: this.EngagementJourneyFormData.alternateRiskProfileType
    };
  }

  setRiskProfile(data) {
    this.EngagementJourneyFormData.riskProfileId = data.primaryRiskProfileId;
    this.EngagementJourneyFormData.riskProfileName = data.primaryRiskProfileType;
    this.EngagementJourneyFormData.htmlDescription = data.htmlDescObject;
    this.EngagementJourneyFormData.alternateRiskProfileId = data.alternateRiskProfileId;
    this.EngagementJourneyFormData.alternateRiskProfileType = data.alternateRiskProfileType;

    this.commit();
  }
  setSelectedRiskProfileId(RiskProfileID) {
    this.EngagementJourneyFormData.selectedriskProfileId = RiskProfileID;
  }
  getSelectedRiskProfileId() {
    return {
      riskProfileId: this.EngagementJourneyFormData.selectedriskProfileId
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
    return this.InvestmentPeriodFormError.formFieldErrors[formCtrlName][validation];
  }

  // tslint:disable-next-line:cognitive-complexity
  doFinancialValidations(form) {
    if (form.value.firstChkBox && form.value.secondChkBox) {
      // tslint:disable-next-line:max-line-length
      if (
        Number(this.removeCommas(form.value.initialInvestment)) <
        ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.min_initial_amount &&
        Number(this.removeCommas(form.value.monthlyInvestment)) <
        ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.min_monthly_amount
      ) {
        return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['one'];
      } else if (
        Number(this.removeCommas(form.value.monthlyInvestment)) <
        ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.min_monthly_amount
      ) {
        return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['two'];
      } else if (
        Number(this.removeCommas(form.value.initialInvestment)) <
        ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.min_initial_amount
      ) {
        return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['three'];
      }
    } else if (form.value.firstChkBox) {
      if (
        Number(this.removeCommas(form.value.initialInvestment)) <
        ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.min_initial_amount
      ) {
        return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['three'];
      }
    } else if (form.value.secondChkBox) {
      if (
        Number(this.removeCommas(form.value.monthlyInvestment)) <
        ENGAGEMENT_JOURNEY_CONSTANTS.my_financials.min_monthly_amount
      ) {
        return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['two'];
      }
    } else {
      return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['four'];
    }
    // tslint:disable-next-line:triple-equals
    if (
      Number(this.removeCommas(form.value.initialInvestment)) === 0 &&
      Number(this.removeCommas(form.value.monthlyInvestment)) === 0
    ) {
      return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['zero'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(this.removeCommas(form.value.initialInvestment)) < 100 &&
      Number(this.removeCommas(form.value.monthlyInvestment)) < 50
    ) {
      return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['more'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(this.removeCommas(form.value.initialInvestment)) >
      Number(this.removeCommas(form.value.totalAssets)) &&
      Number(this.removeCommas(form.value.monthlyInvestment)) >
      (Number(this.removeCommas(form.value.percentageOfSaving)) *
        Number(this.removeCommas(form.value.monthlyIncome)) / 100)
    ) {
      return this.InvestmentPeriodFormError.formFieldErrors['financialValidations'][
        'moreassetandinvestment'
      ];
    } else if (
      Number(this.removeCommas(form.value.initialInvestment)) >
      Number(this.removeCommas(form.value.totalAssets))
    ) {
      return this.InvestmentPeriodFormError.formFieldErrors['financialValidations']['moreasset'];
      // tslint:disable-next-line:max-line-length
    } else if (
      Number(this.removeCommas(form.value.monthlyInvestment)) >
      (Number(this.removeCommas(form.value.percentageOfSaving)) *
        Number(this.removeCommas(form.value.monthlyIncome)) / 100)
    ) {
      return this.InvestmentPeriodFormError.formFieldErrors['financialValidations'][
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
    this.EngagementJourneyFormData.investmentPeriod = data.investmentPeriod;
    this.commit();
  }

  // RISK ASSESSMENT
  getQuestionsList() {
    return this.apiService.getQuestionsList();
  }
  constructGetQuestionsRequest() { }

  getSelectedOptionByIndex(index) {
    return this.EngagementJourneyFormData['riskAssessQuest' + index];
  }
  setRiskAssessment(data, questionIndex) {
    this.EngagementJourneyFormData['riskAssessQuest' + questionIndex] = data;
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
      monthlyIncome: this.EngagementJourneyFormData.monthlyIncome,
      percentageOfSaving: this.EngagementJourneyFormData.percentageOfSaving,
      totalAssets: this.EngagementJourneyFormData.totalAssets,
      totalLiabilities: this.EngagementJourneyFormData.totalLiabilities,
      initialInvestment: this.EngagementJourneyFormData.initialInvestment,
      monthlyInvestment: this.EngagementJourneyFormData.monthlyInvestment,
      suffEmergencyFund: this.EngagementJourneyFormData.suffEmergencyFund,
      oneTimeInvestmentChkBox: this.EngagementJourneyFormData.oneTimeInvestmentChkBox,
      monthlyInvestmentChkBox: this.EngagementJourneyFormData.monthlyInvestmentChkBox
    };
  }
  setMyFinancials(formData) {
    this.EngagementJourneyFormData.monthlyIncome = formData.monthlyIncome;
    this.EngagementJourneyFormData.percentageOfSaving = formData.percentageOfSaving;
    this.EngagementJourneyFormData.totalAssets = formData.totalAssets;
    this.EngagementJourneyFormData.totalLiabilities = formData.totalLiabilities;
    this.EngagementJourneyFormData.initialInvestment = formData.initialInvestment;
    this.EngagementJourneyFormData.monthlyInvestment = formData.monthlyInvestment;
    this.EngagementJourneyFormData.suffEmergencyFund = formData.suffEmergencyFund;
    this.EngagementJourneyFormData.oneTimeInvestmentChkBox = formData.firstChkBox;
    this.EngagementJourneyFormData.monthlyInvestmentChkBox = formData.secondChkBox;
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
    return this.EngagementJourneyFormData.fundDetails;
  }

  setFundDetails(fundDetails) {
    this.EngagementJourneyFormData.fundDetails = fundDetails;
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
    this.EngagementJourneyFormData = new EngagementJourneyFormData();
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
