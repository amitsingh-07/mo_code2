import { CurrencyPipe, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { SummaryModalComponent } from '../shared/modal/summary-modal/summary-modal.component';
import { ToolTipModalComponent } from '../shared/modal/tooltip-modal/tooltip-modal.component';
import { NavbarService } from '../shared/navbar/navbar.service';
import { AboutAge } from '../shared/utils/about-age.util';
import { Util } from '../shared/utils/util';
import { SIGN_UP_CONFIG } from '../sign-up/sign-up.constant';
import { appConstants } from './../app.constants';
import { ApiService } from './../shared/http/api.service';
import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { ProgressTrackerUtil } from './../shared/modal/progress-tracker/progress-tracker-util';
import { IProgressTrackerData, IProgressTrackerItem, IProgressTrackerSubItem, IProgressTrackerSubItemList } from './../shared/modal/progress-tracker/progress-tracker.types';
import { RoutingService } from './../shared/Services/routing.service';
import { ComprehensiveApiService } from './comprehensive-api.service';
import { COMPREHENSIVE_CONST } from './comprehensive-config.constants';
import { ComprehensiveFormData } from './comprehensive-form-data';
import { ComprehensiveFormError } from './comprehensive-form-error';
import { COMPREHENSIVE_BASE_ROUTE, COMPREHENSIVE_FULL_ROUTER_CONFIG, COMPREHENSIVE_ROUTE_PATHS } from './comprehensive-routes.constants';
import {
  HospitalPlan,
  IChildEndowment,
  IComprehensiveDetails,
  IComprehensiveEnquiry,
  IDependantDetail,
  IDependantSummaryList,
  IHospitalPlanList,
  IInsurancePlan,
  IMyAssets,
  IMyEarnings,
  IMyLiabilities,
  IMyProfile,
  IMySpendings,
  IProgressTrackerWrapper,
  IPromoCode,
  IRegularSavings,
  IRetirementPlan
} from './comprehensive-types';
@Injectable({
  providedIn: 'root'
})
export class ComprehensiveService {
  public static SESSION_KEY_FORM_DATA = 'cmp-form-data';
  private comprehensiveFormData: ComprehensiveFormData = new ComprehensiveFormData();
  private comprehensiveFormError: any = new ComprehensiveFormError();
  private progressData: IProgressTrackerData;
  private progressWrapper: IProgressTrackerWrapper;
  private getStartedStyle = 'get-started';
  cpfPayoutAmount: number = 0;
  welcomeFlowRetirementAge: number = 0;
  welcomeFlowMyInfoData: {enquiryId: number, reportId: number};
  isCFPAutofillMyInfoEnabled = false;
  cfpAutofillMyInfoAttributes = COMPREHENSIVE_CONST.MY_INFO_ATTRIBUTES;

  constructor(
    private http: HttpClient,
    private modal: NgbModal,
    private location: Location,
    private aboutAge: AboutAge,
    private currencyPipe: CurrencyPipe,
    private routingService: RoutingService,
    private router: Router,
    private navbarService: NavbarService,
    private ageUtil: AboutAge,
    private comprehensiveApiService: ComprehensiveApiService,
    private authService: AuthenticationService,
    private apiService: ApiService
  ) {
    this.getComprehensiveFormData();
  }
  //Get User Role for CFP True = Corporate False = Public
  isCorporateRole() {
    return this.authService.isSignedUserWithRole(COMPREHENSIVE_CONST.ROLES.ROLE_COMPRE_LITE);
  }

  /**
   * 
   * @returns Check corporate user(Organisation)
   */
   getPrefillPromoCodeAccess() {
    return this.authService.isSignedUserWithRole(SIGN_UP_CONFIG.ROLE_CORP_FB_USER);
  }

  commit() {
    if (window.sessionStorage) {
      const comprehensiveVersionType = appConstants.SESSION_KEY.COMPREHENSIVE;

      /* Robo3 FULL or LITE Config*/
      const cmpSessionData = this.getComprehensiveSessionData();
      cmpSessionData[
        ComprehensiveService.SESSION_KEY_FORM_DATA
      ] = this.comprehensiveFormData;
      sessionStorage.setItem(
        comprehensiveVersionType,
        JSON.stringify(cmpSessionData)
      );
    }
  }
  getComprehensiveSessionData() {
    // tslint:disable-next-line: max-line-length
    const comprehensiveVersionType = appConstants.SESSION_KEY.COMPREHENSIVE;
    if (
      window.sessionStorage &&
      sessionStorage.getItem(comprehensiveVersionType)
    ) {
      return JSON.parse(
        sessionStorage.getItem(comprehensiveVersionType)
      );
    }
    return {};
  }

  getHospitalPlan(): IHospitalPlanList[] {
    if (!this.comprehensiveFormData.hospitalPlanList) {
      this.comprehensiveFormData.hospitalPlanList = [] as IHospitalPlanList[];
    }
    return this.comprehensiveFormData.hospitalPlanList;
  }
  clearFormData() {
    this.comprehensiveFormData = {} as ComprehensiveFormData;
    this.commit();
    sessionStorage.removeItem(appConstants.SESSION_KEY.COMPREHENSIVE);
    this.getComprehensiveFormData();
  }

  getComprehensiveUrlList(urlList: any) {
    Object.keys(urlList).forEach((key) => {
      urlList[key] = ProgressTrackerUtil.trimPath(urlList[key]);
    });

    return urlList;
  }
  // Return the entire Comprehensive Form Data
  getComprehensiveFormData(): ComprehensiveFormData {
    if (window.sessionStorage) {
      const cmpSessionData = this.getComprehensiveSessionData();
      if (cmpSessionData[ComprehensiveService.SESSION_KEY_FORM_DATA]) {
        this.comprehensiveFormData =
          cmpSessionData[ComprehensiveService.SESSION_KEY_FORM_DATA];
      } else {
        this.comprehensiveFormData = {} as ComprehensiveFormData;
      }

      if (!this.comprehensiveFormData.comprehensiveDetails) {
        this.comprehensiveFormData.comprehensiveDetails = this.getComprehensiveSummary();
      }
    }
    return this.comprehensiveFormData;
  }

  isProgressToolTipShown() {
    if (!this.comprehensiveFormData.isToolTipShown) {
      this.comprehensiveFormData.isToolTipShown = false;
    }
    return this.comprehensiveFormData.isToolTipShown;
  }

  setProgressToolTipShown(shown: boolean) {
    this.comprehensiveFormData.isToolTipShown = shown;
    this.commit();
  }

  getMyProfile() {
    if (!this.comprehensiveFormData.comprehensiveDetails.baseProfile) {
      this.comprehensiveFormData.comprehensiveDetails.baseProfile = {} as IMyProfile;
    }
    return this.comprehensiveFormData.comprehensiveDetails.baseProfile;
  }

  getMyDependant() {
    if (!this.comprehensiveFormData.comprehensiveDetails.dependentsSummaryList) {
      this.comprehensiveFormData.comprehensiveDetails.dependentsSummaryList.dependentsList = [] as IDependantDetail[];
    }
    return this.comprehensiveFormData.comprehensiveDetails.dependentsSummaryList.dependentsList;
  }

  getChildEndowment() {
    if (
      !this.comprehensiveFormData.comprehensiveDetails
        .dependentEducationPreferencesList
    ) {
      this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList = [] as IChildEndowment[];
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .dependentEducationPreferencesList;
  }
  getPromoCode() {
    if (!this.comprehensiveFormData.promoCode) {
      this.comprehensiveFormData.promoCode = {} as IPromoCode;
    }
    return this.comprehensiveFormData.promoCode;
  }
  setPromoCode(promoCode: IPromoCode) {
    this.comprehensiveFormData.promoCode = promoCode;
    this.commit();
  }
  setPromoCodeValidation(promoCodeValidated: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.isValidatedPromoCode = promoCodeValidated;
  }
  /**
   * Get the comprehensive summary object.
   *
   * @returns
   * @memberof ComprehensiveService
   */
  getComprehensiveSummary(): IComprehensiveDetails {
    if (!this.comprehensiveFormData.comprehensiveDetails) {
      this.comprehensiveFormData.comprehensiveDetails = {} as IComprehensiveDetails;
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry = {} as IComprehensiveEnquiry;
    }
    return this.comprehensiveFormData.comprehensiveDetails;
  }
  /**
   *
   * @return
   * ComprehensiveEnquiry
   */

  getComprehensiveEnquiry() {
    if (!this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry = {} as IComprehensiveEnquiry;
    }
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry;
  }

  /**
   * Set the comprehensive summary object.
   *
   * @param {IComprehensiveDetails} comprehensiveDetails
   * @memberof ComprehensiveService
   */
  setComprehensiveSummary(comprehensiveDetails: IComprehensiveDetails) {
    if (comprehensiveDetails === null) {
      this.comprehensiveFormData = {} as ComprehensiveFormData;
      this.commit();
    } else {
      this.comprehensiveFormData.comprehensiveDetails = comprehensiveDetails;
      this.reloadDependantDetails();
      this.setBucketAmountByCal();
      this.setViewableMode(false);
      this.setRiskAssessmentAnswers();
      this.commit();
      this.setRiskQuestions().subscribe((data) => {
        return true;
      });
    }
  }

  /**
   * Wrapper method to update the comprehensive details object
   *
   * @memberof ComprehensiveService
   */
  updateComprehensiveSummary() {
    this.setComprehensiveSummary(
      this.comprehensiveFormData.comprehensiveDetails
    );
  }

  /**
   * Reload and update the dependant education preference details with dependant name and date of birth.
   *
   * @memberof ComprehensiveService
   */
  reloadDependantDetails() {
    const comprehensiveDetails = this.comprehensiveFormData
      .comprehensiveDetails;
    const enquiry: IComprehensiveEnquiry =
      comprehensiveDetails.comprehensiveEnquiry;
    if (
      enquiry !== null &&
      enquiry.hasDependents &&
      (enquiry.hasEndowments === '1' || enquiry.hasEndowments === '2')
    ) {
      if (
        comprehensiveDetails.dependentsSummaryList.dependentsList &&
        comprehensiveDetails.dependentEducationPreferencesList
      ) {
        comprehensiveDetails.dependentEducationPreferencesList.forEach(
          (eduPref, index) => {
            comprehensiveDetails.dependentsSummaryList.dependentsList.forEach((dependant) => {
              if (dependant.id === eduPref.dependentId) {
                comprehensiveDetails.dependentEducationPreferencesList[
                  index
                ] = this.getExistingEndowmentItem(eduPref, dependant);
              }
            });
          }
        );
      }
    }

    this.comprehensiveFormData.comprehensiveDetails = comprehensiveDetails;
  }

  /**
   * Check whether there are any child dependant. Child dependant age criteria `MALE = 21`, `FEMALE = 19`
   *
   * @returns {boolean}
   * @memberof ComprehensiveService
   */
  hasChildDependant(): boolean {
    let hasChildDependant = false;
    this.getMyDependant().forEach((dependant: any) => {
      const getAge = this.aboutAge.calculateAgeByYear(
        dependant.dateOfBirth,
        new Date()
      );
      const maxAge = dependant && dependant.gender && dependant.gender.toLowerCase() === COMPREHENSIVE_CONST.GENDER.MALE ? 21 : 19;
      if (getAge < maxAge) {
        hasChildDependant = true;
        return;
      }
    });

    return hasChildDependant;
  }
  setMyProfile(profile: IMyProfile) {
    this.comprehensiveFormData.comprehensiveDetails.baseProfile = profile;
    this.commit();
  }

  setHasDependant(hasDependant: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasDependents = hasDependant;
    this.updateComprehensiveSummary();
  }

  setMyDependant(dependant: IDependantDetail[]) {
    this.comprehensiveFormData.comprehensiveDetails.dependentsSummaryList.dependentsList = dependant;
    this.updateComprehensiveSummary();
    this.commit();
  }

  setChildEndowment(dependentEducationPreferencesList: IChildEndowment[]) {
    this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList = dependentEducationPreferencesList;
    this.updateComprehensiveSummary();
    this.commit();
  }

  getExistingEndowmentItem(
    childEndowment: IChildEndowment,
    dependant: IDependantDetail
  ) {
    const getAge = this.aboutAge.calculateAgeByYear(
      dependant.dateOfBirth,
      new Date()
    );
    const maturityAge = this.aboutAge.getAboutAge(
      getAge,
      dependant.gender.toLowerCase() === 'male' ? 21 : 19
    );

    let preferenceSelected = true;
    if (
      this.getComprehensiveSummary().comprehensiveEnquiry.hasEndowments === '2'
    ) {
      preferenceSelected =
        dependant.isInsuranceNeeded === null || dependant.isInsuranceNeeded;
    } else if (
      this.getComprehensiveSummary().comprehensiveEnquiry.hasEndowments === '1'
    ) {
      preferenceSelected = true;
    }

    return {
      id: 0, // #childEndowment.id,
      dependentId: dependant.id,
      name: dependant.name,
      dateOfBirth: dependant.dateOfBirth,
      gender: dependant.gender,
      enquiryId: this.getEnquiryId(),
      location: childEndowment.location,
      educationCourse: childEndowment.educationCourse,
      educationSpendingShare: childEndowment.educationSpendingShare,
      endowmentMaturityAmount: childEndowment.endowmentMaturityAmount,
      endowmentMaturityYears: childEndowment.endowmentMaturityYears,
      age: maturityAge,
      preferenceSelection: preferenceSelected,
      nation: dependant.nation
    } as IChildEndowment;
  }

  getMyLiabilities() {
    if (
      !this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities
    ) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities = {} as IMyLiabilities;
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .comprehensiveLiabilities;
  }

  setMyLiabilities(myLiabilitiesData: IMyLiabilities) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities = myLiabilitiesData;
    this.commit();
  }

  getHomeLoanChanges() {
    if (!this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.homeLoanUpdatedByLiabilities = {} as boolean;
    }
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.homeLoanUpdatedByLiabilities;
  }

  setHomeLoanChanges(homeLoanUpdatedByLiabilities: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.homeLoanUpdatedByLiabilities = homeLoanUpdatedByLiabilities;
    this.commit();
  }

  getMyEarnings() {
    if (!this.comprehensiveFormData.comprehensiveDetails.comprehensiveIncome) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveIncome = {} as IMyEarnings;
    }
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveIncome;
  }

  setMyEarnings(myEarningsData: IMyEarnings) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveIncome = myEarningsData;
    this.commit();
  }

  getMySpendings() {
    if (
      !this.comprehensiveFormData.comprehensiveDetails.comprehensiveSpending
    ) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveSpending = {} as IMySpendings;
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .comprehensiveSpending;
  }
  getEnquiryId() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
      .enquiryId;
  }
  setMySpendings(mySpendingsData: IMySpendings) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveSpending = mySpendingsData;
    this.commit();
  }

  /**
   * Get the starting page route for the comprehensive module.
   *
   * @returns
   * @memberof ComprehensiveService
   */
  getStartingPage() {
    return this.comprehensiveFormData.startingPage;
  }

  /**
   * Set the starting page for the comprehensive module.
   *
   * @param {string} pageRoute
   * @memberof ComprehensiveService
   */
  setStartingPage(pageRoute: string) {
    this.comprehensiveFormData.startingPage = pageRoute;
    this.commit();
  }

  hasDependant() {
    if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry) {
      return this.comprehensiveFormData.comprehensiveDetails
        .comprehensiveEnquiry.hasDependents;
    }
  }
  gethouseHoldDetails() {
    if (!this.comprehensiveFormData.comprehensiveDetails) {
      this.comprehensiveFormData.comprehensiveDetails.dependentsSummaryList = {} as IDependantSummaryList;
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .dependentsSummaryList;
  }
  sethouseHoldDetails(dependantSummaryList: IDependantSummaryList) {
    this.comprehensiveFormData.comprehensiveDetails.dependentsSummaryList = dependantSummaryList;
    this.commit();
  }
  getDownOnLuck() {
    if (
      !this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck
    ) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck = {} as HospitalPlan;
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .comprehensiveDownOnLuck;
  }
  setDownOnLuck(comprehensiveDownOnLuck: HospitalPlan) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck = comprehensiveDownOnLuck;
    this.commit();
  }
  clearBadMoodFund() {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck.badMoodMonthlyAmount = 0;
    this.commit();
  }
  saveBadMoodFund() {
    this.clearBadMoodFund();
    this.comprehensiveApiService
      .saveDownOnLuck(this.getDownOnLuck())
      .subscribe((data) => { });
  }
  hasBadMoodFund() {
    const badMoodFund = this.getDownOnLuck().badMoodMonthlyAmount;
    const computeBadMoodFund = this.computeBadMoodFund();
    return (!Util.isEmptyOrNull(badMoodFund) && computeBadMoodFund >= badMoodFund && computeBadMoodFund > 0)
  }

  setDependantSelection(selection: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasDependents = selection;
    this.commit();
  }
  hasEndowment() {
    if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry) {
      return this.comprehensiveFormData.comprehensiveDetails
        .comprehensiveEnquiry.hasEndowments;
    }
  }

  setEndowment(selection: string) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasEndowments = selection;
    this.commit();
  }
  clearEndowmentPlan() {
    this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList = [] as IChildEndowment[];
    this.commit();
  }
  getMyAssets() {
    if (!this.comprehensiveFormData.comprehensiveDetails.comprehensiveAssets) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveAssets = {} as IMyAssets;
    }
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveAssets;
  }
  setMyAssets(myAssets: IMyAssets) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveAssets = myAssets;
    this.commit();
  }
  getRegularSavingsList() {
    if (!this.comprehensiveFormData.comprehensiveDetails) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveRegularSavingsList = [] as IRegularSavings[];
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .comprehensiveRegularSavingsList;
  }
  setRegularSavingsList(regularSavingsPlan: IRegularSavings[]) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveRegularSavingsList = regularSavingsPlan;
    this.commit();
  }
  hasRegularSavings() {
    if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry) {
      return this.comprehensiveFormData.comprehensiveDetails
        .comprehensiveEnquiry.hasRegularSavingsPlans;
    }
  }
  setRegularSavings(selection: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasRegularSavingsPlans = selection;
    this.commit();
  }
  getInsurancePlanningList() {
    if (!this.comprehensiveFormData.comprehensiveDetails) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveInsurancePlanning = {} as IInsurancePlan;
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .comprehensiveInsurancePlanning;
  }
  setInsurancePlanningList(comprehensiveInsurancePlanning: IInsurancePlan) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveInsurancePlanning = comprehensiveInsurancePlanning;
    this.commit();
  }
  setCareshieldFlag(careshieldFlag: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveInsurancePlanning.haveLongTermPopup = careshieldFlag;
    this.commit();
  }
  setHospitalPlan(hospitalPlanList: IHospitalPlanList[]) {
    this.comprehensiveFormData.hospitalPlanList = hospitalPlanList;
    this.commit();
  }
  getRetirementPlan() {
    if (!this.comprehensiveFormData.comprehensiveDetails) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveRetirementPlanning = {} as IRetirementPlan;
    }
    return this.comprehensiveFormData.comprehensiveDetails
      .comprehensiveRetirementPlanning;
  }
  setRetirementPlan(comprehensiveRetirementPlanning: IRetirementPlan) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveRetirementPlanning = comprehensiveRetirementPlanning;
    this.commit();
  }
  getQuestionsList() {
    return this.comprehensiveApiService.getQuestionsList();
  }
  getRiskProfileFlag() {
    if (this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileSkipped) {
      return this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileSkipped;
    } else {
      return false;
    }
  }

  setRiskProfileFlag(flag) {
    this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileSkipped = flag;
    this.saveSkipRiskProfile().subscribe(() => { });    
    this.commit();
  }

  getSelectedOptionByIndex(index) {
    if (this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileAnswers) {
      return this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileAnswers['riskAssessQuest' + index];
    }
  }
  setRiskAssessment(riskProfileCheckboxFlag, data, questionIndex) {
    this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileAnswers['riskAssessQuest' + questionIndex] = data;
    this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileSkipped = riskProfileCheckboxFlag;
    this.commit();

  }

  setRiskAssessmentAnswers() {
    const riskProfileAnswersData = this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer;
    let selAnswers = {
      riskAssessQuest1: null,
      riskAssessQuest2: null,
      riskAssessQuest3: null,
      riskAssessQuest4: null
    };
    if (riskProfileAnswersData !== null && riskProfileAnswersData.answers !== null) {
      let isRiskProfileAnswer = riskProfileAnswersData && riskProfileAnswersData.answers;

      selAnswers = {
        riskAssessQuest1: riskProfileAnswersData && riskProfileAnswersData.answers && riskProfileAnswersData.answers.length > 0 ? riskProfileAnswersData.answers[0].questionOptionId : null,
        riskAssessQuest2: riskProfileAnswersData && riskProfileAnswersData.answers && riskProfileAnswersData.answers.length > 1 ? riskProfileAnswersData.answers[1].questionOptionId : null,
        riskAssessQuest3: riskProfileAnswersData && riskProfileAnswersData.answers && riskProfileAnswersData.answers.length > 2 ? riskProfileAnswersData.answers[2].questionOptionId : null,
        riskAssessQuest4: riskProfileAnswersData && riskProfileAnswersData.answers && riskProfileAnswersData.answers.length > 3 ? riskProfileAnswersData.answers[3].questionOptionId : null
      };
      this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileAnswers = selAnswers;
    } else {
      const enquiryId = riskProfileAnswersData && riskProfileAnswersData.enquiryId ? riskProfileAnswersData.enquiryId : null;
      const skipRiskProfile = riskProfileAnswersData && riskProfileAnswersData.riskProfileSkipped;
      this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer = { riskProfileSkipped: skipRiskProfile, enquiryId: enquiryId, answers: [], riskProfileAnswers: selAnswers };
    }
  }
  saveSkipRiskProfile() {
    const data = this.constructSkipRiskProfileRequest();
    return this.comprehensiveApiService.saveSkipRiskProfile(data);
  }
  constructSkipRiskProfileRequest() {
    const data = this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileSkipped;
    return {
      enquiryId: this.getEnquiryId(),
      skipRiskProfile: data
    };
  }

  saveRiskAssessment() {
    const data = this.constructRiskAssessmentSaveRequest();
    return this.comprehensiveApiService.saveRiskAssessment(data);
  }
  constructRiskAssessmentSaveRequest() {
    const formData = this.comprehensiveFormData.comprehensiveDetails.riskAssessmentAnswer.riskProfileAnswers;
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
      enquiryId: this.getEnquiryId(),
      answers: selAnswers
    };
  }
  // Set Risk Assessment Questions - Answer Minimal Info
  setRiskQuestions() {
    return new Observable((obs) => {
      if (Util.isEmptyOrNull(this.comprehensiveFormData.comprehensiveDetails.riskQuestionList)) {
        this.getQuestionsList().subscribe((qData) => {
          let riskQues = {};
          if (qData.objectList) {
            qData.objectList.forEach(
              (qDetails) => {
                qDetails['options'].forEach(
                  (quesOptions) => {
                    if (quesOptions['additionalInfo']['displayInfo']) {
                      riskQues[quesOptions['id']] = quesOptions['additionalInfo']['displayInfo'];
                    }
                  });
              });
          }
          this.comprehensiveFormData.comprehensiveDetails.riskQuestionList = riskQues;
          this.commit();
          obs.next(true);
        });
      } else {
        obs.next(true);
      }
    });
  }

  getFormError(form, formName) {
    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.comprehensiveFormError[
      formName
    ].formFieldErrors.errorTitle;

    for (const name in controls) {
      if (
        !controls[name].hasOwnProperty('controls') &&
        controls[name].invalid
      ) {
        errors.errorMessages.push(
          this.comprehensiveFormError[formName].formFieldErrors[name][
            Object.keys(controls[name]['errors'])[0]
          ].errorMessage
        );
      } else {
        const formGroup = {
          formName: '',
          errors: [],
          errorStatus: false
        };
        for (const subFormName in controls[name].controls) {
          if (controls[name].controls[subFormName].invalid) {
            formGroup.errorStatus = true;
          }
        }
        if (formGroup.errorStatus === true) {
          errors.errorMessages.push(
            this.comprehensiveFormError[formName].formFieldErrors[name][
              'required'
            ].errorMessage
          );
        }
      }
    }
    return errors;
  }

  getMultipleFormError(form, formName, formTitle) {
    const forms = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.comprehensiveFormError[
      formName
    ].formFieldErrors.errorTitle;
    let index = 0;

    // tslint:disable-next-line:forin
    for (const field in forms) {
      if (forms[field].status === 'INVALID') {
        for (const control of forms[field].controls) {
          const formGroup = {
            formName: '',
            errors: []
          };
          // tslint:disable-next-line:forin
          for (const name in control.controls) {
            formGroup.formName = formTitle[index];
            if (control.controls[name].invalid) {
              formGroup.errors.push(
                this.comprehensiveFormError[formName].formFieldErrors[name][
                  Object.keys(control.controls[name]['errors'])[0]
                ].errorMessage
              );
            }
          }
          if (formGroup.errors.length > 0) {
            errors.errorMessages.push(formGroup);
          }
          index++;
        }
      }
    }
    return errors;
  }

  openErrorModal(
    title: string,
    message: any,
    isMultipleForm: boolean,
    formName?: string
  ) {
    const ref = this.modal.open(ErrorModalComponent, {
      centered: true,
      windowClass: 'will-custom-modal'
    });
    ref.componentInstance.errorTitle = title;
    if (!isMultipleForm) {
      ref.componentInstance.formName = formName;

      ref.componentInstance.errorMessageList = message;
    } else {
      message.forEach((element: any, index) => {
        if (element.formName) {
          message[index]['formName'] = element.formName.name;
        }
      });
      ref.componentInstance.multipleFormErrors = message;
    }
    return false;
  }

  openTooltipModal(toolTipParam) {
    const ref = this.modal.open(ToolTipModalComponent, {
      centered: true
    });
    ref.componentInstance.tooltipTitle = toolTipParam.TITLE;
    ref.componentInstance.tooltipMessage = toolTipParam.DESCRIPTION;
  }
  openTooltipModalWithDismiss(toolTipParam) {
    const ref = this.modal.open(ToolTipModalComponent, {
      centered: true
    });
    ref.componentInstance.tooltipTitle = toolTipParam.TITLE;
    ref.componentInstance.tooltipMessage = toolTipParam.DESCRIPTION;
    ref.result.then(
      (result) => { },
      (reason) => {
        if (reason === 'Cross click' && toolTipParam.URL) {
          this.router.navigate([toolTipParam.URL]);
        }
      }
    );
    return false;
  }
  openSummaryPopUpModal(summaryModalDetails) {
    const ref = this.modal.open(SummaryModalComponent, {
      centered: true,
      windowClass: 'full-height-comprehensive',
      backdrop: 'static',
      keyboard: false
    });
    ref.componentInstance.summaryModalDetails = summaryModalDetails;
    ref.result.then(
      (result) => { },
      (reason) => {
        if (reason === 'dismiss' && summaryModalDetails.routerEnabled) {
          const previousUrl = this.getPreviousUrl(this.router.url);
          if (previousUrl !== null) {
            this.router.navigate([previousUrl]);
          } else {
            this.navbarService.goBack();
          }
        }
      }
    );
    return false;
  }

  // tslint:disable-next-line:cognitive-complexity
  additionOfCurrency(formValues, inputParams = []) {
    let sum: any = 0;

    for (const i in formValues) {
      if (formValues[i] !== null && formValues[i] !== '') {
        const Regexp = new RegExp('[,]', 'g');
        let thisValue: any = (formValues[i] + '').replace(Regexp, '');
        thisValue = parseInt(formValues[i], 10);
        if (!isNaN(thisValue)) {
          if (inputParams.indexOf(i) >= 0) {
            sum += thisValue !== 0 ? thisValue * 12 : 0;
          } else {
            sum += parseInt(thisValue, 10);
          }
        }
      }
    }
    return sum.toFixed();
  }

  /**
   * Get the previous url to navigate.
   *
   * @param {string} currentUrl
   * @returns {string}
   * @memberof ComprehensiveService
   */
  getPreviousUrl(currentUrl: string): string {
    const urlList = this.getComprehensiveUrlList(COMPREHENSIVE_FULL_ROUTER_CONFIG);
    const currentUrlIndex = Util.toInteger(Util.getKeyByValue(urlList, currentUrl));
    if (currentUrlIndex > 0) {
      const previousUrl = urlList[currentUrlIndex - 1];
      if (
        previousUrl ===
        ProgressTrackerUtil.trimPath(this.routingService.getCurrentUrl())
      ) {
        return null;
      } else {
        return previousUrl;
      }
    }
    return COMPREHENSIVE_BASE_ROUTE;
  }

  /**
   * Check whether the current URL is accessible if not, return the next accessible URL.
   *
   * @param {string} url
   * @returns {string}
   * @memberof ComprehensiveService
   */
  // tslint:disable-next-line:cognitive-complexity
  getAccessibleUrl(url: string): string {
    const urlLists = this.getComprehensiveUrlList(COMPREHENSIVE_FULL_ROUTER_CONFIG);
    return this.getAccessibleFullJourney(urlLists, url);
  }
  // Return Access Url for Full Journey
  getAccessibleFullJourney(urlList: any, url: any) {

    this.generateProgressTrackerData();

    const currentUrlIndex = Util.toInteger(Util.getKeyByValue(urlList, url));
    let accessibleUrl = '';

    const profileData = this.getMyProfile();
    const cmpSummary = this.getComprehensiveSummary();

    const enquiry = this.getComprehensiveSummary().comprehensiveEnquiry;
    const childEndowmentData: IChildEndowment[] = this.getChildEndowment();

    const dependantProgressData = this.getDependantsProgressData();
    const financeProgressData = this.getFinancesProgressData();
    const fireProofingProgressData = this.getFireproofingProgressData();
    const retirementProgressData = this.getRetirementProgressData();
    const riskProfileProgressData = this.getRiskProfileProgressData();
    const reportStatusData = this.getReportStatus();
    const stepCompleted = this.getMySteps();
    let userAge = 0;
    if (cmpSummary && (cmpSummary.baseProfile.dateOfBirth !== null || cmpSummary.baseProfile.dateOfBirth !== '')) {
      userAge = this.aboutAge.calculateAge(
        cmpSummary.baseProfile.dateOfBirth,
        new Date()
      );
    }
    let accessPage = true;
    if (userAge < COMPREHENSIVE_CONST.YOUR_PROFILE.APP_MIN_AGE
      || userAge > COMPREHENSIVE_CONST.YOUR_PROFILE.APP_MAX_AGE) {
      accessPage = false;
    }
    let accessRetirementAge = false;
    if (this.getRetirementPlan() && this.getRetirementPlan().retirementAge) {
      accessRetirementAge = (parseInt(this.getRetirementPlan().retirementAge) >= userAge);
    }
    let isEditAccess = true;
    const isLocked = this.getLocked();
    if (reportStatusData === COMPREHENSIVE_CONST.REPORT_STATUS.ERROR || (!isLocked && reportStatusData === COMPREHENSIVE_CONST.REPORT_STATUS.READY)) {
      isEditAccess = false;
    }
    for (let index = currentUrlIndex; index >= 0; index--) {
      if (accessibleUrl !== '') {
        break;
      } else {
        let canAccess = true;
        dependantProgressData.subItems.forEach((subItem) => {
          if (!subItem.completed && subItem.hidden !== true) {
            canAccess = false;
          }
        });
        switch (index) {
          // 'getting-started'
          case 0:
            if (
              !cmpSummary.comprehensiveEnquiry.enquiryId ||
              !cmpSummary.comprehensiveEnquiry.isCFPGetStarted
            ) {
              accessibleUrl = COMPREHENSIVE_BASE_ROUTE;
            }
            break;

          // 'steps/1',
          case 1:
          // 'dependant-selection'
          case 2:
            if (isEditAccess && accessPage && profileData.nationalityStatus) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'dependant-details'
          case 3:
            if (
              isEditAccess && accessPage && enquiry.hasDependents !== null &&
              enquiry.hasDependents !== false
            ) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'dependant-education-selection'
          case 4:
            if (isEditAccess && accessPage && this.hasChildDependant()) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'dependant-education-preference'
          case 5:
            if (isEditAccess && accessPage && this.hasChildDependant() && this.hasEndowment() === '1') {
              accessibleUrl = urlList[index];
            }
            break;

          // 'dependant-education-list'
          case 6:
            let eduPref = '';
            if (
              childEndowmentData.length > 0 &&
              childEndowmentData[0].location !== null
            ) {
              eduPref = childEndowmentData[0].location;
            }
            if (
              isEditAccess && accessPage && this.hasChildDependant() &&
              this.hasEndowment() === '1' &&
              eduPref !== ''
            ) {
              accessibleUrl = urlList[index];
            }
            break;

          // 'steps/2'
          case 7:
            if (isEditAccess && accessPage && canAccess) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'my-earnings'
          case 8:
            if (isEditAccess && accessPage && canAccess && stepCompleted > 0) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'my-spendings'
          case 9:
            if (isEditAccess && accessPage && canAccess && financeProgressData.subItems[0].completed && stepCompleted > 0) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'regular-saving-plan'
          case 10:
            if (isEditAccess && accessPage && canAccess && financeProgressData.subItems[1].completed && stepCompleted > 0) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'bad-mood-fund'
          case 11:
            if (isEditAccess && accessPage && canAccess && financeProgressData.subItems[2].completed && stepCompleted > 0) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'my-assets'
          case 12:
            if (isEditAccess && accessPage && canAccess && financeProgressData.subItems[4].completed && stepCompleted > 0) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'my-liabilities'
          case 13:
            if (isEditAccess && accessPage && canAccess && financeProgressData.subItems[5].completed && stepCompleted > 0) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'steps/3'
          case 14:
            if (isEditAccess && accessPage && canAccess && financeProgressData.subItems[6].completed && stepCompleted > 0) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'insurance-plan'
          case 15:
            if (isEditAccess && accessPage && canAccess && financeProgressData.subItems[6].completed && stepCompleted > 1) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'steps/4'
          case 16:
            if (isEditAccess && accessPage && canAccess && fireProofingProgressData.subItems[0].completed && stepCompleted > 1) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'retirement-plan'
          case 17:
            if (isEditAccess && accessPage && canAccess && fireProofingProgressData.subItems[0].completed && stepCompleted > 2) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'Step 5'
          case 18:
            if (isEditAccess && accessPage && canAccess && retirementProgressData.subItems[0].completed && stepCompleted >= 3) {
              accessibleUrl = urlList[index];
            }
            break;
          // 'Risk Profile'
          case 19:
            if (isEditAccess && accessPage && canAccess && retirementProgressData.subItems[0].completed && stepCompleted > 3 && accessRetirementAge) {
              accessibleUrl = urlList[index];
            }
            break;
          case 20:
            if (isEditAccess && accessPage && canAccess && riskProfileProgressData.subItems[0].completed && stepCompleted > 3 && accessRetirementAge) {
              accessibleUrl = urlList[index];
            }
            break;
          case 21:
            if (isEditAccess && accessPage && canAccess && riskProfileProgressData.subItems[1].completed && stepCompleted > 3 && accessRetirementAge) {
              accessibleUrl = urlList[index];
            }
            break;
          case 22:
            if (isEditAccess && accessPage && canAccess && riskProfileProgressData.subItems[2].completed && stepCompleted >= 4 && accessRetirementAge) {
              accessibleUrl = urlList[index];
            }
            break;
          case 23:
          case 24:
          case 25:
            if (
              accessPage && canAccess &&
              (cmpSummary.riskAssessmentAnswer.riskProfileSkipped || riskProfileProgressData.subItems[2].completed) && stepCompleted >= 4 && accessRetirementAge
            ) {
              accessibleUrl = urlList[index];
            }
          case 26:
            if (
              accessPage && canAccess &&
              (cmpSummary.riskAssessmentAnswer.riskProfileSkipped || riskProfileProgressData.subItems[2].completed) &&
              (reportStatusData === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED || reportStatusData === COMPREHENSIVE_CONST.REPORT_STATUS.READY)
            ) {
              accessibleUrl = urlList[index];
            }
            break;
             // 'myinfo-autofill'
          case 27:
            if (isEditAccess && accessPage && this.isCFPAutofillMyInfoEnabled) {
              accessibleUrl = urlList[index];
            }
            break;
        }
      }
    }
    if (accessibleUrl === '') {
      accessibleUrl = urlList[0];
    }
    return accessibleUrl;
  }  

  generateProgressTrackerData(): IProgressTrackerData {
    this.progressData = {} as IProgressTrackerData;
    this.progressData = {
      title: 'Your Progress Tracker',
      subTitle: 'Est. Time Required: 20 mins',
      properties: {
        disabled: false
      },
      items: []
    };

    this.progressData.items.push(this.getGetStartedProgressData());
    this.progressData.items.push(this.getDependantsProgressData());
    this.progressData.items.push(this.getFinancesProgressData());
    this.progressData.items.push(this.getFireproofingProgressData());
    this.progressData.items.push(this.getRetirementProgressData());
    this.progressData.items.push(this.getRiskProfileProgressData());

    if (!this.getViewableMode()) {
      this.progressData.items.push(this.getReviewInputsProgressData());
    }
    return this.progressData;
  }

  getGetStartedProgressData(): IProgressTrackerItem {
    const myProfile: IMyProfile = this.getMyProfile();
    return {
      title: 'Get Started',
      expanded: true,
      showArrow: true,
      completed: typeof myProfile.gender !== 'undefined',
      customStyle: this.getStartedStyle,
      subItems: [
        {
          id: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED,
          path: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED,
          title: 'Tell us about yourself',
          value: myProfile.firstName,
          completed: typeof myProfile.firstName !== 'undefined'
        }
      ]
    };
  }

  // tslint:disable-next-line:cognitive-complexity
  getDependantsProgressData(): IProgressTrackerItem {
    const subItemsArray: IProgressTrackerSubItem[] = [];

    let hasDependants = false;
    let hasEndowments = false;
    let hasRegularSavings = false;
    const enquiry = this.getComprehensiveSummary().comprehensiveEnquiry;
    const childEndowmentData: IChildEndowment[] = this.getChildEndowment();
    const dependantData: IDependantDetail[] = this.getMyDependant();
    const dependentHouseHoldData: IDependantSummaryList = this.gethouseHoldDetails();

    if (enquiry && enquiry.hasDependents !== null && dependantData && dependantData.length > 0) {
      hasDependants = true;
    }
    if (
      enquiry &&
      enquiry.hasEndowments === '1' &&
      childEndowmentData.length > 0
    ) {
      hasEndowments = true;
    }
    if (enquiry && enquiry.hasRegularSavingsPlans !== null) {
      hasRegularSavings = true;
    }

    let noOfDependants = '';
    if (dependantData) {
      noOfDependants = dependantData.length + '';
    }
    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION,
      path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION,
      title: 'No. of Household Members',
      value: dependentHouseHoldData.noOfHouseholdMembers == 0 || dependentHouseHoldData.noOfHouseholdMembers ? dependentHouseHoldData.noOfHouseholdMembers + '' : '',
      completed: (enquiry.hasDependents !== null && (this.validateSteps(0, 1)))
    });
    subItemsArray.push({
      id: '',
      path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION,
      title: 'Household Income',
      value: dependentHouseHoldData.houseHoldIncome ? dependentHouseHoldData.houseHoldIncome + '' : '',
      completed: (enquiry.hasDependents !== null && (this.validateSteps(0, 1)))
    });


    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS,
      path:
        enquiry.hasDependents !== null && enquiry.hasDependents !== false
          ? COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS
          : COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION,
      title: 'Number of Dependant(s)',
      value: noOfDependants,
      completed: ((enquiry.hasDependents !== null && enquiry.hasDependents !== false && this.validateSteps(0, 2)) || (enquiry.hasDependents !== null && this.validateSteps(0, 1)))
    });

    if ((enquiry.hasDependents === null || dependantData && dependantData.length > 0)) {
      const eduPrefs: IChildEndowment[] = this.getChildEndowment();
      const eduPlan: string = this.hasEndowment();

      const prefsList: IProgressTrackerSubItemList[] = [];
      let prefsListCompleted = false;
      let hasEndowmentAmount = false;
      const tempPrefsList = [];

      if (
        eduPrefs &&
        enquiry.hasDependents !== null &&
        enquiry.hasEndowments === '1'
      ) {
        eduPrefs.forEach((item) => {
          if (!Util.isEmptyOrNull(item.location)) {
            tempPrefsList.push(item);
          }
          if (!Util.isEmptyOrNull(item.endowmentMaturityYears)) {
            hasEndowmentAmount = true;
          }
          prefsList.push({
            title: item.name,
            value:
              (item.location === null ? '' : item.location) +
              (item.educationCourse === null ? '' : ', ' + item.educationCourse) +
              (item.educationSpendingShare === null ? '' : ', ' + item.educationSpendingShare + '% Share')
          });
        });
      }

      if (tempPrefsList.length === prefsList.length) {
        prefsListCompleted = true;
      }

      let hasEndowmentPlans = '';
      if (eduPlan === '1') {
        hasEndowmentPlans = hasEndowmentAmount ? 'Yes' : 'No';
      } else if (eduPlan === '2') {
        hasEndowmentPlans = 'No';
      }

      let hasEduPlansValue = '';
      if (hasEndowments) {
        hasEduPlansValue = 'Yes';
      } else if (enquiry.hasEndowments !== '1') {
        hasEduPlansValue = 'No';
      }

      subItemsArray.push({
        id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION,
        path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION,
        title: 'Plan for children education',
        value: hasEduPlansValue,
        completed:
          this.validateSteps(0, 3) &&
          enquiry.hasEndowments !== null &&
          hasDependants &&
          eduPrefs &&
          typeof eduPrefs !== 'undefined',
        hidden: !this.hasChildDependant()
      });

      if (enquiry.hasEndowments === '1') {
        subItemsArray.push({
          id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE,
          path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE,
          title: 'Education Preferences',
          value:
            prefsList.length === 0 || enquiry.hasEndowments !== '1' ? 'No' : '',
          completed:
            this.validateSteps(0, 4) &&
            hasDependants &&
            hasEndowments &&
            eduPrefs &&
            typeof eduPrefs !== 'undefined' &&
            prefsListCompleted,
          list: this.validateSteps(0, 4) ? prefsList : []
        });
        subItemsArray.push({
          id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST,
          path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST,
          title: 'Do you have education endowment plan',
          value: hasEndowmentPlans,
          completed:
            this.validateSteps(0, 5) &&
            hasDependants &&
            hasEndowments &&
            prefsListCompleted &&
            (typeof eduPlan !== 'undefined' || eduPlan !== '0')
        });
      }
    }
    return {
      title: 'What\'s On Your Shoulders',
      expanded: true,
      showArrow: true,
      completed: hasDependants,
      customStyle: 'dependant',
      subItems: subItemsArray
    };
  }

  transformAsCurrency(in_amount: any): string {
    return this.currencyPipe.transform(
      in_amount,
      'USD',
      'symbol-narrow',
      '1.0-2'
    );
  }

  getFinancesProgressData(): IProgressTrackerItem {
    const subItemsArray: IProgressTrackerSubItem[] = [];
    const earningsData: IMyEarnings = this.getMyEarnings();
    const spendingsData: IMySpendings = this.getMySpendings();
    const assetsData: IMyAssets = this.getMyAssets();
    const liabilitiesData: IMyLiabilities = this.getMyLiabilities();

    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.MY_EARNINGS,
      path: COMPREHENSIVE_ROUTE_PATHS.MY_EARNINGS,
      title: 'Your Earnings',
      value:
        earningsData && earningsData.totalAnnualIncomeBucket >= 0
          ? this.transformAsCurrency(earningsData.totalAnnualIncomeBucket) + ''
          : '',
      completed: (!Util.isEmptyOrNull(earningsData) && (this.validateSteps(1, 1)))
    });
    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS,
      path: COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS,
      title: 'Your Spendings',
      value:
        spendingsData && spendingsData.totalAnnualExpenses >= 0
          ? this.transformAsCurrency(spendingsData.totalAnnualExpenses) + ''
          : '',
      completed: (!Util.isEmptyOrNull(spendingsData) && (this.validateSteps(1, 2)))
    });

    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN,
      path: COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN,
      title: 'Regular Savings Plan',
      value: '',
      completed:
        ((this.hasRegularSavings() !== null ||
          !Util.isEmptyOrNull(this.getRegularSavingsList()))
          && (this.validateSteps(1, 3))),
      hidden: true
    });

    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
      path: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
      title: 'Bad Mood Fund',
      value: this.getDownOnLuck().badMoodMonthlyAmount
        ? this.transformAsCurrency(this.getDownOnLuck().badMoodMonthlyAmount) +
        ''
        : typeof this.getDownOnLuck().hospitalPlanId !== 'undefined'
          ? this.transformAsCurrency(0)
          : '',
      completed: ((typeof this.getDownOnLuck().hospitalPlanId !== 'undefined')
        && (this.validateSteps(1, 4))),
      hidden: !this.hasBadMoodFund() && !Util.isEmptyOrNull(earningsData)
    });

    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND + '1',
      path: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
      title: 'Hospital Choice',
      value:
        typeof this.getDownOnLuck().hospitalPlanId !== 'undefined'
          ? this.getDownOnLuck().hospitalPlanName
          : '',
      completed: ((typeof this.getDownOnLuck().hospitalPlanId !== 'undefined') && (this.validateSteps(1, 4)))
    });

    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS,
      path: COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS,
      title: 'Assets (What You Own)',
      value:
        assetsData && assetsData.totalAnnualAssets >= 0
          ? this.transformAsCurrency(assetsData.totalAnnualAssets) + ''
          : '',
      completed: (!Util.isEmptyOrNull(assetsData) && (this.validateSteps(1, 5)))
    });
    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES,
      path: COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES,
      title: 'Liabilities (What You Owe)',
      value:
        liabilitiesData && liabilitiesData.totalAnnualLiabilities >= 0
          ? this.transformAsCurrency(liabilitiesData.totalAnnualLiabilities) +
          ''
          : '',
      completed: (!Util.isEmptyOrNull(liabilitiesData) && (this.validateSteps(1, 6)))
    });
    return {
      title: 'Your Finances',
      expanded: true,
      showArrow: true,
      completed: false,
      customStyle: 'finances',
      subItems: subItemsArray
    };
  }

  /**
   * Get progress tracker data for  the 'Your Current Fireproofing' section.
   *
   * @returns {IProgressTrackerItem}
   * @memberof ComprehensiveService
   */
  // tslint:disable-next-line:cognitive-complexity
  getFireproofingProgressData(): IProgressTrackerItem {
    const cmpSummary = this.getComprehensiveSummary();
    const isCompleted = cmpSummary.comprehensiveInsurancePlanning !== null;
    let hospitalPlanValue = '';
    let cpfDependantProtectionSchemeValue = '$0';
    let criticalIllnessValue = '$0';
    let ocpDisabilityValue = '$0 /mth';
    let longTermCareValue = '$0 /mth';
    let otherLongTermCareValue = '$0 /mth';
    let longTermCareList = [];
    let hideLongTermInsurance = true;

    if (isCompleted) {
      const haveHospitalPlan =
        cmpSummary.comprehensiveInsurancePlanning.haveHospitalPlan;
      if (haveHospitalPlan) {
        hospitalPlanValue = 'Yes';
      } else if (haveHospitalPlan !== null && !haveHospitalPlan) {
        hospitalPlanValue = 'No';
      }

      const haveCPFDependentsProtectionScheme =
        cmpSummary.comprehensiveInsurancePlanning
          .haveCPFDependentsProtectionScheme;
      if (!Util.isEmptyOrNull(haveCPFDependentsProtectionScheme)) {
        if (haveCPFDependentsProtectionScheme === 1) {
          const otherLifeProtectionCoverageAmount =
            cmpSummary.comprehensiveInsurancePlanning
              .otherLifeProtectionCoverageAmount;
          const lifeProtectionAmount =
            cmpSummary.comprehensiveInsurancePlanning.lifeProtectionAmount;
          const homeProtectionCoverageAmount =
            cmpSummary.comprehensiveInsurancePlanning
              .homeProtectionCoverageAmount;
          cpfDependantProtectionSchemeValue = this.transformAsCurrency(
            Util.toNumber(otherLifeProtectionCoverageAmount) +
            Util.toNumber(lifeProtectionAmount) +
            Util.toNumber(homeProtectionCoverageAmount)
          );
        } else if (haveCPFDependentsProtectionScheme === 0) {
          cpfDependantProtectionSchemeValue = 'No';
        } else if (haveCPFDependentsProtectionScheme === 2) {
          cpfDependantProtectionSchemeValue = 'Not Sure';
        }
      }

      if (
        !Util.isEmptyOrNull(
          cmpSummary.comprehensiveInsurancePlanning
            .criticalIllnessCoverageAmount
        )
      ) {
        criticalIllnessValue = this.transformAsCurrency(
          cmpSummary.comprehensiveInsurancePlanning
            .criticalIllnessCoverageAmount
        );
      }

      if (
        !Util.isEmptyOrNull(
          cmpSummary.comprehensiveInsurancePlanning
            .disabilityIncomeCoverageAmount
        )
      ) {
        ocpDisabilityValue = this.transformAsCurrency(
          cmpSummary.comprehensiveInsurancePlanning
            .disabilityIncomeCoverageAmount
        ) + ' /mth';
      }


      if ((!Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield) && cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield === 1) || cmpSummary.comprehensiveInsurancePlanning.shieldType === COMPREHENSIVE_CONST.LONG_TERM_SHIELD_TYPE.CARE_SHIELD || (!Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield) && cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield === 1 && cmpSummary.comprehensiveInsurancePlanning.shieldType === COMPREHENSIVE_CONST.LONG_TERM_SHIELD_TYPE.ELDER_SHIELD)) {
        if (!Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.longTermElderShieldAmount)) {
          longTermCareValue = this.transformAsCurrency(
            cmpSummary.comprehensiveInsurancePlanning.longTermElderShieldAmount
          ) + ' /mth';
        }
        if (!Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.otherLongTermCareInsuranceAmount)) {
          otherLongTermCareValue = this.transformAsCurrency(
            cmpSummary.comprehensiveInsurancePlanning.otherLongTermCareInsuranceAmount
          ) + ' /mth';
        }
        longTermCareList.push({
          title: 'Other coverage amount',
          value: otherLongTermCareValue,
        });
        if (cmpSummary.comprehensiveInsurancePlanning.shieldType === COMPREHENSIVE_CONST.LONG_TERM_SHIELD_TYPE.CARE_SHIELD && (this.validateSteps(2, 1))) {
          longTermCareValue = otherLongTermCareValue;
          longTermCareList = [];
        }
      } else if (
        cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield ===
        0
      ) {
        longTermCareValue = 'No';
      } else if (
        cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield ===
        2
      ) {
        longTermCareValue = 'Not Sure';
      }

    }
    if (this.getMyProfile().dateOfBirth) {
      const userAge = this.ageUtil.calculateAge(this.getMyProfile().dateOfBirth, new Date());
      if (userAge > COMPREHENSIVE_CONST.INSURANCE_PLAN.LONG_TERM_INSURANCE_AGE) {
        hideLongTermInsurance = false;
        if ((cmpSummary.comprehensiveEnquiry.reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) && Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.shieldType) && (userAge <
          COMPREHENSIVE_CONST.INSURANCE_PLAN.LONG_TERM_INSURANCE_AGE_OLD)) {
          hideLongTermInsurance = true;
        }
      }
    }

    return {
      title: 'Risk-Proof Your Journey',
      expanded: true,
      showArrow: true,
      completed: false,
      customStyle: 'risk-proof',
      subItems: [
        {
          id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
          path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
          title: 'Do you have a hospital plan',
          value: hospitalPlanValue,
          completed: (isCompleted && (this.validateSteps(2, 1)))
        },
        {
          id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '1',
          path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
          title: 'Life Protection',
          value: cpfDependantProtectionSchemeValue,
          completed: (isCompleted && (this.validateSteps(2, 1)))
        },
        {
          id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '2',
          path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
          title: 'Critical Illness',
          value: criticalIllnessValue,
          completed: (isCompleted && (this.validateSteps(2, 1)))
        },
        {
          id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '3',
          path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
          title: 'Occupational Disability',
          value: ocpDisabilityValue,
          completed: (isCompleted && (this.validateSteps(2, 1)))
        },
        {
          id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '4',
          path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
          title: 'Long-Term Care',
          value: longTermCareValue,
          completed: (isCompleted && (this.validateSteps(2, 1))),
          hidden: hideLongTermInsurance,
          list: (this.validateSteps(2, 1)) ? longTermCareList : []
        }
      ]
    };
  }

  /**
   * Get progress tracker data for  the 'Your Risk Profile' section.
   *
   * @returns {IProgressTrackerItem}
   * @memberof ComprehensiveService
   */
  // tslint:disable-next-line:cognitive-complexity
  getRiskProfileProgressData(): IProgressTrackerItem {
    const cmpSummary = this.getComprehensiveSummary();
    const isCompleted = false; //cmpSummary.comprehensiveInsurancePlanning !== null;
    const skipRiskProfile = this.getRiskProfileFlag();

    const riskProfileSubSteps = [{
      id: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/1',
      path: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/1',
      title: 'Temporary Losses',
      value: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest1
        && cmpSummary.riskQuestionList) ?
        cmpSummary.riskQuestionList[cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest1] : '',
      completed: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest1
        && cmpSummary.riskQuestionList && (this.validateSteps(COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.RISK_PROFILE.NO, 1)))
    },
    {
      id: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/2',
      path: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/2',
      title: 'Unrealised/Paper Loss',
      value: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest2
        && cmpSummary.riskQuestionList) ?
        cmpSummary.riskQuestionList[cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest2] : '',
      completed: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest2
        && cmpSummary.riskQuestionList && (this.validateSteps(COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.RISK_PROFILE.NO, 2)))
    },
    {
      id: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/3',
      path: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/3',
      title: 'Stress Level',
      value: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest3
        && cmpSummary.riskQuestionList) ?
        cmpSummary.riskQuestionList[cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest3] : '',
      completed: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest3
        && cmpSummary.riskQuestionList && (this.validateSteps(COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.RISK_PROFILE.NO, 3)))
    },
    {
      id: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/4',
      path: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/4',
      title: 'Portfolio Type',
      value: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest4
        && cmpSummary.riskQuestionList) ?
        cmpSummary.riskQuestionList[cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest4] : '',
      completed: (cmpSummary.riskAssessmentAnswer && cmpSummary.riskAssessmentAnswer.riskProfileAnswers.riskAssessQuest4
        && cmpSummary.riskQuestionList && (this.validateSteps(COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.RISK_PROFILE.NO, 4)))
    }];

    const startRiskProfile = [{
      id: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/1',
      path: COMPREHENSIVE_ROUTE_PATHS.RISK_PROFILE + '/1',
      title: COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.RISK_PROFILE.TITLE,
      value: '',
      completed: this.getMySteps() >= COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.RISK_PROFILE.NO
    }];

    return {
      title: 'Your Risk Profile',
      expanded: true,
      showArrow: true,
      completed: false,
      customStyle: 'risk-profile',
      subItems: skipRiskProfile ? startRiskProfile : riskProfileSubSteps
    };
  }

  /**
   * Get progress tracker data for the 'Financial Independence' section.
   *
   * @returns {IProgressTrackerItem}
   * @memberof ComprehensiveService
   */
  getRetirementProgressData(): IProgressTrackerItem {
    let retirementAgeValue = '';
    const cmpSummary = this.getComprehensiveSummary();
    const isCompleted = cmpSummary.comprehensiveRetirementPlanning !== null;
    const isStepCompleted = 3;
    if (
      isCompleted &&
      cmpSummary.comprehensiveRetirementPlanning.retirementAge
    ) {
      // tslint:disable-next-line:radix
      const retireAgeVal = parseInt(
        cmpSummary.comprehensiveRetirementPlanning.retirementAge
      );
      retirementAgeValue = retireAgeVal + ' yrs old';
    }
    const subItemsArray = [];
    subItemsArray.push({
      id: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN,
      path: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN,
      title: 'Retirement Age',
      value: retirementAgeValue,
      completed: (isCompleted && (this.validateSteps(isStepCompleted, 1)))
    });
    if (cmpSummary.comprehensiveRetirementPlanning && (this.validateSteps(isStepCompleted, 1))) {
      cmpSummary.comprehensiveRetirementPlanning.retirementIncomeSet.forEach((item, index) => {
        subItemsArray.push({
          id: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN + '1',
          path: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN,
          title: 'Retirement Income ' + (index + 1),
          value: '',
          completed: (isCompleted && (this.validateSteps(isStepCompleted, 1))),
          list: [{
            title: 'Monthly Payout',
            value: this.transformAsCurrency(item.monthlyPayout)
          },
          {
            title: 'Payout Start Age',
            value: item.payoutStartAge + ' years old'
          },
          {
            title: 'Payout Duration',
            value: item.payoutDuration
          }]
        });
      });

      cmpSummary.comprehensiveRetirementPlanning.lumpSumBenefitSet.forEach((item, index) => {
        subItemsArray.push({
          id: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN + '2',
          path: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN,
          title: 'Lump Sum Amount ' + (index + 1),
          value: '',
          completed: (isCompleted && (this.validateSteps(isStepCompleted, 1))),
          list: [{
            title: 'Maturity Amount',
            value: this.transformAsCurrency(item.maturityAmount)
          },
          {
            title: 'Maturity Year',
            value: item.maturityYear
          }]
        });
      });
    }

    return {
      title: 'Financial Independence',
      expanded: true,
      showArrow: true,
      completed: false,
      customStyle: 'retirement-icon',
      subItems: subItemsArray

    };
  }

  getReviewInputsProgressData(): IProgressTrackerItem {
    return {
      title: COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.REVIEW_INPUTS.TITLE,
      expanded: false,
      showArrow: false,
      path: this.getMySteps() == COMPREHENSIVE_CONST.PROGRESS_TRACKER.STEPS.REVIEW_INPUTS.NO && this.checkResultData() ? COMPREHENSIVE_ROUTE_PATHS.REVIEW : '',
      completed: false,
      customStyle: "review-inputs",
      subItems: []
    };
  }

  /**
   * Bucket Calculation for Earnings and Assets
   */
  setBucketImage(bucketParams: any, formValues: any, totalBucket) {
    const bucketFlag = [];
    for (const i in bucketParams) {
      if (formValues[bucketParams[i]] > 0) {
        bucketFlag.push(true);
      } else {
        bucketFlag.push(false);
      }
    }
    if (bucketFlag.indexOf(true) >= 0 && bucketFlag.indexOf(false) < 0) {
      return 'filledBucket';
    } else if (
      (bucketFlag.indexOf(true) >= 0 && bucketFlag.indexOf(false) >= 0) ||
      totalBucket > 0
    ) {
      return 'middleBucket';
    } else {
      return 'emptyBucket';
    }
  }
  /**
   * Set Total Bucket Income For Earnings
   */
  setBucketAmountByCal() {
    Object.keys(COMPREHENSIVE_CONST.YOUR_FINANCES).forEach((financeInput) => {
      const financeData = COMPREHENSIVE_CONST.YOUR_FINANCES[financeInput];
      const inputBucket = Object.assign(
        {},
        this.comprehensiveFormData.comprehensiveDetails[financeData.API_KEY]
      );
      if (
        Object.keys(inputBucket).length > 0 &&
        inputBucket.constructor === Object
      ) {
        const popInputBucket = financeData.POP_FORM_INPUT;
        const filterInput = this.unSetObjectByKey(inputBucket, popInputBucket);
        const inputParams = financeData.MONTHLY_INPUT_CALC;
        if (financeInput === 'YOUR_EARNINGS') {
          const inputTotal = this.getTotalAnnualIncomeByEarnings(filterInput);
          this.comprehensiveFormData.comprehensiveDetails[financeData.API_KEY][
            financeData.API_TOTAL_BUCKET_KEY
          ] = !isNaN(inputTotal) && inputTotal > 0 ? inputTotal : 0;
        } else {
          const inputTotal = this.additionOfCurrency(filterInput, inputParams);
          this.comprehensiveFormData.comprehensiveDetails[financeData.API_KEY][
            financeData.API_TOTAL_BUCKET_KEY
          ] = !isNaN(inputTotal) && inputTotal > 0 ? inputTotal : 0;
        }
      }
    });
  }
  /**
   * Remove key from Object
   * First Parameter is Object and Second Parameter is array with key need to pop
   */
  // tslint:disable-next-line: cognitive-complexity
  unSetObjectByKey(inputObject: any, removeKey: any) {
    Object.keys(inputObject).forEach((key) => {
      if (Array.isArray(inputObject[key])) {
        inputObject[key].forEach((objDetails: any, index) => {
          Object.keys(objDetails).forEach((innerKey) => {
            if (
              innerKey !== 'enquiryId' &&
              innerKey !== 'customerId' &&
              innerKey !== 'id' &&
              removeKey.indexOf(innerKey) < 0
            ) {
              const Regexp = new RegExp('[,]', 'g');
              let thisValue: any = (objDetails[innerKey] + '').replace(
                Regexp,
                ''
              );
              thisValue = parseInt(objDetails[innerKey], 10);
              if (!isNaN(thisValue)) {
                inputObject[innerKey + '_' + index] = thisValue;
              }
            }
          });
        });
      }
    });
    if (removeKey) {
      Object.keys(removeKey).forEach((key) => {
        if (key !== '') {
          delete inputObject[removeKey[key]];
        }
      });
    }
    return inputObject;
  }
  /**
   * Compute Expense Calculation for Summary Page
   * PV x (1+r)^n
   */
  getComputedExpense(amount: number, percent: any, aboutAge: number) {
    let percentCal: any;
    let computedVal: any;
    let finalResult = 0;
    if (!isNaN(amount) && !isNaN(percent) && !isNaN(aboutAge)) {
      percentCal = percent / 100;
      computedVal = Math.pow(1 + percentCal, aboutAge);
      finalResult = Math.round(computedVal * amount);
    }
    return finalResult;
  }
  /**
   * Dependant Summary Page Compute
   */
  setDependantExpense(location: any, univ: any, aboutAge: number, nation: any) {
    let totalExpense: any = 0;
    const summaryConst =
      COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.DEPENDANT;
    Object.keys(summaryConst).forEach((expenseInput) => {
      let locationChange = location;
      if (
        location === 'Singapore' &&
        (nation === 'Others' || nation === 'Singapore PR')
      ) {
        locationChange = nation;
      }
      const expenseConfig = summaryConst[expenseInput];
      totalExpense += this.getComputedExpense(
        expenseConfig[univ][locationChange],
        expenseConfig.PERCENT,
        aboutAge
      );
    });
    return totalExpense;
  }
  /**
   * Summary Page Finance - Compute Liquid Cash
   * (Cash + SavingBond) - (Expense/2)
   */
  getLiquidCash() {
    const assetDetails = this.getMyAssets();
    const expenseDetails = this.getHomeExpenses('cash', false);
    let sumLiquidCash = 0;
    if (assetDetails && assetDetails.cashInBank) {
      sumLiquidCash += this.getValidAmount(assetDetails.cashInBank);
    }
    if (assetDetails && assetDetails.savingsBonds) {
      sumLiquidCash += this.getValidAmount(assetDetails.savingsBonds);
    }
    if (expenseDetails) {
      sumLiquidCash -= 6 * expenseDetails;
    }
    return Math.floor(sumLiquidCash);
  }
  /**
   * Compute Spare Cash
   * 75% of (HomePay - RSP - BadMood - Expense)
   * 50% of (Annual Bonus/Dividend)
   */
  getComputeSpareCash() {
    let spareCash = 0;
    const summaryConfig = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.YOUR_FINANCES;
    const earningDetails = this.getMyEarnings();
    const homePayTotal = this.getTakeHomeSalary(
      earningDetails,
      summaryConfig,
      true,
      false
    );
    const regularSavingTotal = this.getRegularSaving('cash', true);
    const badMoodTotal = this.getBadMoodFund();
    const expenseTotal = this.getHomeExpenses('cash', true);
    const annualBonusCheck =
      earningDetails && earningDetails.annualBonus
        ? this.getValidAmount(earningDetails.annualBonus)
        : 0;
    const annualBonus =
      annualBonusCheck > 0
        ? this.getAnnualBonus(earningDetails, summaryConfig)
        : 0;
    const annualDividend =
      earningDetails && earningDetails.annualDividends
        ? this.getValidAmount(earningDetails.annualDividends)
        : 0;
    spareCash =
      summaryConfig.SPARE_CASH_EARN_SPEND_PERCENT *
      (homePayTotal - expenseTotal - regularSavingTotal - badMoodTotal) +
      summaryConfig.SPARE_CASH_ANNUAL_PERCENT * (annualBonus + annualDividend);
    return Math.floor(spareCash);
  }
  /**
   * Compute Take Home
   * annual Flag = true for annual calculation
   * annual Flag = false for monthly calculation
   */
  getTakeHomeSalary(
    earningDetails: any,
    summaryConfig: any,
    annualFlag: boolean,
    summaryFlag: boolean
  ) {
    const baseProfile = this.getMyProfile();
    let homeSalary = 0;
    let homeCpfSalary = 0;
    if (
      earningDetails &&
      earningDetails !== null &&
      (earningDetails.totalAnnualIncomeBucket > 0 || summaryFlag)
    ) {
      if (baseProfile && baseProfile.nationalityStatus === 'Others') {
        homeSalary += this.getValidAmount(earningDetails.monthlySalary);
        homeSalary += this.getValidAmount(
          earningDetails.otherMonthlyWorkIncome
        );
      } else {
        const cpfDetails = {
          amountLimitCpf: summaryConfig.HOME_PAY_CPF_SELF_EMPLOYED_BREAKDOWN,
          cpfPercent: summaryConfig.HOME_PAY_CPF_SELF_EMPLOYED_PERCENT
        };
        if (earningDetails.employmentType === 'Employed') {
          cpfDetails.amountLimitCpf =
            summaryConfig.HOME_PAY_CPF_EMPLOYED_BREAKDOWN;
          cpfDetails.cpfPercent = summaryConfig.HOME_PAY_CPF_EMPLOYED_PERCENT;
        }
        homeCpfSalary += this.getValidAmount(earningDetails.monthlySalary);
        homeCpfSalary += this.getValidAmount(
          earningDetails.otherMonthlyWorkIncome
        );
        if (homeCpfSalary > cpfDetails.amountLimitCpf) {
          homeSalary =
            cpfDetails.amountLimitCpf * cpfDetails.cpfPercent +
            (homeCpfSalary - cpfDetails.amountLimitCpf);
        } else {
          homeSalary = homeCpfSalary * cpfDetails.cpfPercent;
        }
      }
      homeSalary += this.getValidAmount(earningDetails.monthlyRentalIncome);
      homeSalary += this.getValidAmount(earningDetails.otherMonthlyIncome);
      if (annualFlag) {
        homeSalary *= 12;
        homeSalary += this.getValidAmount(earningDetails.otherAnnualIncome);
      }
    }
    return homeSalary;
  }
  /**
   * compute Regular Saving Plan
   * based on cash mode, cpf mode or both cpf/cash
   * annual Flag = true for annual calculation
   * annual Flag = false for monthly calculation
   */
  getRegularSaving(mode: any, annualFlag: boolean) {
    const rspDetails = this.getRegularSavingsList();
    if (rspDetails && rspDetails !== null) {
      const calculateRSP = [];
      rspDetails.forEach((investDetails: any, index) => {
        if (investDetails.fundType && investDetails.fundType.toLowerCase() === mode) {
          calculateRSP.push(investDetails.amount);
        }
      });
      const monthlySumCal = this.additionOfCurrency(calculateRSP);
      if (annualFlag) {
        return monthlySumCal * 12;
      } else {
        return monthlySumCal;
      }
    } else {
      return 0;
    }
  }
  /**
   * get Expense based on cash mode, cpf mode or both cpf/cash
   * annual Flag = true for annual calculation
   * annual Flag = false for monthly calculation
   */
  getHomeExpenses(modeType: any, annualFlag: boolean) {
    const expenseDetails = this.getMySpendings();
    let homeExpenses = 0;
    if (expenseDetails && expenseDetails !== null) {
      homeExpenses += this.getValidAmount(expenseDetails.monthlyLivingExpenses);
      homeExpenses += this.getValidAmount(expenseDetails.carLoanPayment);
      homeExpenses += this.getValidAmount(expenseDetails.otherLoanPayment);
      if (modeType === 'cash' || modeType === 'both') {
        homeExpenses += this.getValidAmount(
          expenseDetails.HLMortgagePaymentUsingCash
        );
        homeExpenses += this.getValidAmount(
          expenseDetails.mortgagePaymentUsingCash
        );
      }
      if (modeType === 'cpf' || modeType === 'both') {
        homeExpenses += this.getValidAmount(
          expenseDetails.HLMortgagePaymentUsingCPF
        );
        homeExpenses += this.getValidAmount(
          expenseDetails.mortgagePaymentUsingCPF
        );
      }
      if (annualFlag) {
        homeExpenses *= 12;
        homeExpenses += this.getValidAmount(expenseDetails.adHocExpenses);
      }
    }
    return homeExpenses;
  }
  /**
   * Set Bad Mood Input value for Maximum
   * Bad Mood Fund =  Take Home Pay - Expenses - Less RSP (cash Component)
   */
  computeBadMoodFund() {
    const summaryConfig = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.YOUR_FINANCES;
    const earningDetails = this.getMyEarnings();
    const homeExpenseTotal = this.getHomeExpenses('cash', false);
    const homePayTotal = this.getTakeHomeSalary(
      earningDetails,
      summaryConfig,
      false,
      false
    );
    const regularSavingTotal = this.getRegularSaving('cash', false);
    let maxAmount = 0;
    maxAmount = homePayTotal - homeExpenseTotal - regularSavingTotal;
    return Math.floor(maxAmount);
  }
  /**
   * compute Bad Mood Fund
   */
  getBadMoodFund() {
    const badMoodDetails = this.getDownOnLuck();
    if (
      badMoodDetails &&
      badMoodDetails !== null &&
      badMoodDetails.badMoodMonthlyAmount
    ) {
      const badMoodMonthly = this.getValidAmount(
        badMoodDetails.badMoodMonthlyAmount
      );
      return badMoodMonthly * 12;
    } else {
      return 0;
    }
  }
  /**
   * check Number
   */
  getValidAmount(thisValue) {
    if (thisValue && thisValue !== null && !isNaN(thisValue)) {
      return Util.toInteger(thisValue);
    } else {
      return 0;
    }
  }
  /**
   * Summary Dynamic Value
   * Get Static Json value for Fire Proofing
   */
  getCurrentFireProofing() {
    const getComprehensiveDetails = this.getComprehensiveSummary();
    const enquiry: IComprehensiveEnquiry =
      getComprehensiveDetails.comprehensiveEnquiry;
    const userGender = getComprehensiveDetails.baseProfile.gender.toLowerCase();
    const userAge = this.aboutAge.calculateAge(
      getComprehensiveDetails.baseProfile.dateOfBirth,
      new Date()
    );
    const fireProofingDetails = {
      dependant: false,
      gender: userGender.toLowerCase(),
      age: userAge
    };
    if (enquiry.hasDependents) {
      getComprehensiveDetails.dependentsSummaryList.dependentsList.forEach((dependant) => {
        fireProofingDetails.dependant = true;
      });
    }
    return fireProofingDetails;
  }
  /**
   * Disable Form Element
   */
  getFormDisabled(formDetails: any) {
    formDetails.disable();
  }
  /**
   * View / Edit Mode Flag Service
   * True = View False = Edit Mode
   */
  getViewableMode() {
    if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveViewMode) {
      return this.comprehensiveFormData.comprehensiveDetails
        .comprehensiveViewMode;
    }
    return false;
  }
  setViewableMode(commitFlag: boolean) {
    if (this.comprehensiveFormData.comprehensiveDetails &&
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry !== null &&
      (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
        .reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED || this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
          .reportStatus === COMPREHENSIVE_CONST.REPORT_STATUS.READY) && this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
        .isLocked) {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveViewMode = true;
    } else {
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveViewMode = false;
    }
    if (commitFlag) {
      this.commit();
    }
    return true;
  }
  /**
   * Result Validation before report generation
   */
  checkResultData() {
    const getCompData = this.getComprehensiveSummary();
    let validateFlag = true;
    if (
      !getCompData ||
      !getCompData.comprehensiveEnquiry.reportStatus ||
      getCompData.comprehensiveEnquiry.reportStatus === null ||
      getCompData.comprehensiveEnquiry.reportStatus === '' ||
      (getCompData.comprehensiveEnquiry.reportStatus !==
        COMPREHENSIVE_CONST.REPORT_STATUS.NEW && getCompData.comprehensiveEnquiry.reportStatus !==
        COMPREHENSIVE_CONST.REPORT_STATUS.EDIT && getCompData.comprehensiveEnquiry.reportStatus !==
        COMPREHENSIVE_CONST.REPORT_STATUS.ERROR && getCompData.comprehensiveEnquiry.reportStatus !==
        COMPREHENSIVE_CONST.REPORT_STATUS.READY)
    ) {
      validateFlag = false;
    }
    const getResultConfig = COMPREHENSIVE_CONST.YOUR_RESULTS;
    let totalAmount = 0;
    Object.keys(getResultConfig).forEach((financeInput) => {
      const apiInput = getResultConfig[financeInput].API_KEY;
      const validationDataSet = getResultConfig[financeInput].VALIDATION_INPUT;
      validationDataSet.forEach((dataSet) => {
        if (getCompData[apiInput] && getCompData[apiInput][dataSet]) {
          const getAmount = this.getValidAmount(getCompData[apiInput][dataSet]);
          totalAmount += getAmount;
        }
      });
    });
    if (totalAmount <= 0) {
      validateFlag = false;
    }
    return validateFlag;
  }
  /**
   * Step Validation before api call
   */
  checkStepValidation(currentStep: number) {
    const progressData = [];
    progressData.push(this.getDependantsProgressData());
    progressData.push(this.getFinancesProgressData());
    progressData.push(this.getFireproofingProgressData());
    progressData.push(this.getRetirementProgressData());
    progressData.push(this.getRiskProfileProgressData());

    let goToStep = 0;
    let stepStatus = true;
    const stepIndicator = this.getMySteps();
    if (stepIndicator > currentStep) {
      stepStatus = false;
      goToStep = stepIndicator + 1;
    } else {
      for (let t = 0; t < currentStep; t++) {
        if (goToStep === 0) {
          if (!this.getSubItemStatus(progressData[t])) {
            stepStatus = false;
            goToStep = t;
          }
        }
      }
    }
    return { status: stepStatus, stepIndicate: goToStep };
  }
  getSubItemStatus(progressData: any) {
    let completedStatus = true;
    Object.keys(progressData.subItems).forEach((completedData) => {
      if (
        !progressData.subItems[completedData].completed &&
        !progressData.subItems[completedData].hidden
      ) {
        completedStatus = false;
      }
    });
    return completedStatus;
  }
  setMySteps(currentStep: number, subStep: number) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.stepCompleted = currentStep;
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.subStepCompleted = subStep;
    this.commit();
  }
  getMySteps() {
    if (
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
        .stepCompleted
    ) {
      return this.comprehensiveFormData.comprehensiveDetails
        .comprehensiveEnquiry.stepCompleted;
    } else {
      return 0;
    }
  }
  getMySubSteps() {
    if (
      this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
        .subStepCompleted
    ) {
      return this.comprehensiveFormData.comprehensiveDetails
        .comprehensiveEnquiry.subStepCompleted;
    } else {
      return 0;
    }
  }
  setReportStatus(reportStatus: string) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.reportStatus = reportStatus;
    this.commit();
  }
  getReportStatus() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
      .reportStatus;
  }
  setLocked(lock: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.isLocked = lock;
    this.commit();
  }
  getLocked() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
      .isLocked;
  }
  setReportId(reportId: number) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.reportId = reportId;
    this.commit();
  }
  getReportId() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
      .reportId;
  }
  /**
   * Compute Take Home Earnings
   */
  getTotalEarningsBucket(earningDetails: any) {
    const summaryConfig = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.YOUR_FINANCES;
    const baseProfile = this.getMyProfile();
    let homeSalary = 0;
    let annualSalary = 0;
    let homeCpfSalary = 0;
    if (earningDetails && earningDetails !== null) {
      if (baseProfile && baseProfile.nationalityStatus === 'Others') {
        homeSalary += this.getValidAmount(earningDetails.monthlySalary);
        homeSalary += this.getValidAmount(
          earningDetails.otherMonthlyWorkIncome
        );
        annualSalary += this.getValidAmount(earningDetails.annualBonus);
      } else {
        const cpfDetails = {
          amountLimitCpf: summaryConfig.ANNUAL_PAY_CPF_BREAKDOWN,
          cpfPercent: summaryConfig.HOME_PAY_CPF_SELF_EMPLOYED_PERCENT
        };
        if (earningDetails.employmentType === 'Employed') {
          cpfDetails.amountLimitCpf = summaryConfig.ANNUAL_PAY_CPF_BREAKDOWN;
          cpfDetails.cpfPercent = summaryConfig.HOME_PAY_CPF_EMPLOYED_PERCENT;
        }
        homeCpfSalary += this.getValidAmount(earningDetails.monthlySalary);
        homeCpfSalary += this.getValidAmount(
          earningDetails.otherMonthlyWorkIncome
        );
        homeCpfSalary *= 12;
        homeCpfSalary += this.getValidAmount(earningDetails.annualBonus);
        if (homeCpfSalary > cpfDetails.amountLimitCpf) {
          annualSalary +=
            cpfDetails.amountLimitCpf * cpfDetails.cpfPercent +
            (homeCpfSalary - cpfDetails.amountLimitCpf);
        } else {
          annualSalary += homeCpfSalary * cpfDetails.cpfPercent;
        }
      }
      homeSalary += this.getValidAmount(earningDetails.monthlyRentalIncome);
      homeSalary += this.getValidAmount(earningDetails.otherMonthlyIncome);

      homeSalary *= 12;
      annualSalary += this.getValidAmount(earningDetails.annualDividends);
      annualSalary += this.getValidAmount(earningDetails.otherAnnualIncome);
      homeSalary += annualSalary;
    }
    return Math.floor(homeSalary);
  }
  /**
   * Compute Annual Bonus for step2 summary
   */
  getAnnualBonus(earningDetails: any, summaryConfig: any) {
    const baseProfile = this.getMyProfile();
    let homeSalary = 0;
    let annualSalary = 0;
    let homeCpfSalary = 0;
    if (earningDetails && earningDetails !== null) {
      const annualBonus = this.getValidAmount(earningDetails.annualBonus);
      if (baseProfile && baseProfile.nationalityStatus === 'Others') {
        annualSalary += annualBonus;
      } else {
        const cpfDetails = {
          amountLimitCpf: summaryConfig.ANNUAL_PAY_CPF_BREAKDOWN,
          cpfPercent: summaryConfig.HOME_PAY_CPF_SELF_EMPLOYED_PERCENT,
          salaryCeilCpf: summaryConfig.HOME_PAY_CPF_SELF_EMPLOYED_BREAKDOWN
        };
        if (earningDetails.employmentType === 'Employed') {
          cpfDetails.amountLimitCpf = summaryConfig.ANNUAL_PAY_CPF_BREAKDOWN;
          cpfDetails.cpfPercent = summaryConfig.HOME_PAY_CPF_EMPLOYED_PERCENT;
          cpfDetails.salaryCeilCpf =
            summaryConfig.HOME_PAY_CPF_EMPLOYED_BREAKDOWN;
        }
        homeCpfSalary += this.getValidAmount(earningDetails.monthlySalary);
        homeCpfSalary += this.getValidAmount(
          earningDetails.otherMonthlyWorkIncome
        );
        if (homeCpfSalary > cpfDetails.salaryCeilCpf) {
          homeSalary += cpfDetails.salaryCeilCpf;
        } else {
          homeSalary += homeCpfSalary;
        }
        const cutOffSalary = cpfDetails.amountLimitCpf - homeSalary * 12;
        let eligibleAnnualBonus = 0;
        let notEligibleAnnualBonus = 0;
        if (cutOffSalary > annualBonus) {
          eligibleAnnualBonus = annualBonus;
          notEligibleAnnualBonus = 0;
        } else {
          eligibleAnnualBonus = cutOffSalary;
          notEligibleAnnualBonus = annualBonus - eligibleAnnualBonus;
        }
        annualSalary =
          eligibleAnnualBonus * cpfDetails.cpfPercent + notEligibleAnnualBonus;
      }
    }

    return Math.floor(annualSalary);
  }
  /**
   * Annual Income Updated Formula
   *
   */
  getTotalAnnualIncomeByEarnings(earningDetails: any) {
    const summaryConfig = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.YOUR_FINANCES;
    let takeHomeCal = 0;
    const homePayTotal = this.getTakeHomeSalary(
      earningDetails,
      summaryConfig,
      true,
      true
    );
    const annualBonusCheck =
      earningDetails && earningDetails.annualBonus
        ? this.getValidAmount(earningDetails.annualBonus)
        : 0;
    const annualBonus =
      annualBonusCheck > 0
        ? this.getAnnualBonus(earningDetails, summaryConfig)
        : 0;
    const annualDividend =
      earningDetails && earningDetails.annualDividends
        ? this.getValidAmount(earningDetails.annualDividends)
        : 0;
    takeHomeCal = homePayTotal + annualBonus + annualDividend;
    return Math.floor(takeHomeCal);
  }
  /* Filter object from array of objects*/
  filterDataByInput(inputObject: any, keyMapped: any, data: any) {
    const filteredData = inputObject.filter((summaryData) => summaryData[keyMapped] === data);
    if (filteredData && filteredData[0]) {
      return filteredData[0];
    } else {
      return '';
    }
  }
  /**
   * Comprehensive steps and sub step save api call
   * parameter 1 - stepCompleted 2 - sunStepCompleted
   */
  setStepCompletion(stepCompletedParam: number, subStepCompletedParam: number) {
    return new Observable((obs) => {
      const stepIndicatorData = {
        enquiryId: this.getEnquiryId(), stepCompleted: stepCompletedParam,
        subStepCompleted: subStepCompletedParam
      };
      this.comprehensiveApiService.saveStepIndicator(stepIndicatorData).subscribe((data) => {
        this.setMySteps(stepCompletedParam, subStepCompletedParam);
        obs.next(data);
      });
    });
  }
  /**
   * Validate Steps with Sub Steps
   */
  validateSteps(stepCompletedParam, subCompletedParam) {
    const stepComplete = this.getMySteps();
    const subStepComplete = this.getMySubSteps();
    return (stepComplete > stepCompletedParam || (stepCompletedParam === stepComplete && subStepComplete >= subCompletedParam));
  }
  /**
   * Date Check Between two dates
   */
  dateFoundInBetween(dateOfBirth, minDate, maxDate) {
    const minDateCal = new Date(minDate);
    const maxDateCal = new Date(maxDate);
    return (dateOfBirth >= minDateCal && dateOfBirth <= maxDateCal);
  }
  /**
   * Retirement sum find BRS/FRS based on birth date
   */
  retirementSumFindByBirthDate(birthDate: any) {
    const subItemsArray = [];
    const dateParts = birthDate.split('/');
    const dateOfBirth = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);

    const birthYear = dateOfBirth.getFullYear();
    const retireSumConfig1 = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.RETIREMENT_SUM_BIRTH_DATE[birthYear - 1];
    const retireSumConfig2 = COMPREHENSIVE_CONST.YOUR_FINANCES.YOUR_ASSETS.RETIREMENT_SUM_BIRTH_DATE[birthYear];
    if (!Util.isEmptyOrNull(retireSumConfig1) &&
      this.dateFoundInBetween(dateOfBirth, retireSumConfig1.BORN_DATE, retireSumConfig1.TILL_DATE)) {
      return retireSumConfig1;
    } else if (!Util.isEmptyOrNull(retireSumConfig2) &&
      this.dateFoundInBetween(dateOfBirth, retireSumConfig2.BORN_DATE, retireSumConfig2.TILL_DATE)) {
      return retireSumConfig2;
    } else {
      return '';
    }
  }

  validateUin(uin) {
    const payload = {
      source: COMPREHENSIVE_CONST.API_SOURCE,
      uin: uin
    };
    return this.apiService.validateUin(payload);
  }
  getCfpPromoCode() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
      .promoCode;
  }
  getWaivedPromo() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
      .promoWaived;
  }
  getWaivedSpeakToAdvisorPromo() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry
      .promoWaivedSpeakToAdvisor;
  }
  setPaymentStatus(paymentStatus: string) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.paymentStatus = paymentStatus;
    this.commit();
  }

  setAdvisorStatus(advisorPaymentStatus: string) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.advisorPaymentStatus = advisorPaymentStatus;
    this.commit();
  }
  getAdvisorStatus() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.advisorPaymentStatus;
  }

  setToastMessage(toastMessage) {
    this.comprehensiveFormData.toastMessage = toastMessage;
  }

  getToastMessage() {
    return this.comprehensiveFormData.toastMessage;
  }
  setSpecialPromoCodeStatus(specialPromoCode: boolean) {
    this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.specialPromoCode = specialPromoCode;
    this.commit();
  }
  getSpecialPromoCodeStatus() {
    return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.specialPromoCode;
  }
}
