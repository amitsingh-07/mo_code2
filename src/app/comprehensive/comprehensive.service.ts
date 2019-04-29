import { CurrencyPipe, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { SummaryModalComponent } from '../shared/modal/summary-modal/summary-modal.component';
import { ToolTipModalComponent } from '../shared/modal/tooltip-modal/tooltip-modal.component';
import { NavbarService } from '../shared/navbar/navbar.service';
import { AboutAge } from '../shared/utils/about-age.util';
import { Util } from '../shared/utils/util';
import { appConstants } from './../app.constants';
import { ProgressTrackerUtil } from './../shared/modal/progress-tracker/progress-tracker-util';
import {
    IProgressTrackerData,
    IProgressTrackerItem,
    IProgressTrackerSubItem,
    IProgressTrackerSubItemList
} from './../shared/modal/progress-tracker/progress-tracker.types';
import { RoutingService } from './../shared/Services/routing.service';
import { COMPREHENSIVE_CONST } from './comprehensive-config.constants';
import { ComprehensiveFormData } from './comprehensive-form-data';
import { ComprehensiveFormError } from './comprehensive-form-error';
import { COMPREHENSIVE_BASE_ROUTE, COMPREHENSIVE_ROUTE_PATHS } from './comprehensive-routes.constants';
import {
    HospitalPlan,
    IChildEndowment,
    IComprehensiveDetails,
    IComprehensiveEnquiry,
    IDependantDetail,
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
    constructor(
        private http: HttpClient, private modal: NgbModal, private location: Location,
        private aboutAge: AboutAge, private currencyPipe: CurrencyPipe,
        private routingService: RoutingService, private router: Router,
        private navbarService: NavbarService, private ageUtil: AboutAge) {
        this.getComprehensiveFormData();
    }

    commit() {
        if (window.sessionStorage) {
            const cmpSessionData = this.getComprehensiveSessionData();
            cmpSessionData[ComprehensiveService.SESSION_KEY_FORM_DATA] = this.comprehensiveFormData;
            sessionStorage.setItem(appConstants.SESSION_KEY.COMPREHENSIVE, JSON.stringify(cmpSessionData));
        }
    }

    getComprehensiveSessionData() {
        if (window.sessionStorage && sessionStorage.getItem(appConstants.SESSION_KEY.COMPREHENSIVE)) {
            return JSON.parse(sessionStorage.getItem(appConstants.SESSION_KEY.COMPREHENSIVE));
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
        this.getComprehensiveFormData();
    }

    getComprehensiveUrlList() {
        const urlList = {
            0: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED,
            1: COMPREHENSIVE_ROUTE_PATHS.STEPS + '/1',
            2: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION,
            3: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION_SUMMARY + '/summary',
            4: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS,
            5: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS_SUMMARY + '/summary',
            6: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION,
            7: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION_SUMMARY + '/summary',
            8: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE,
            9: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST,
            10: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST_SUMMARY + '/summary',
            11: COMPREHENSIVE_ROUTE_PATHS.STEPS + '/2',
            12: COMPREHENSIVE_ROUTE_PATHS.MY_EARNINGS,
            13: COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS,
            14: COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN,
            15: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
            16: COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS,
            17: COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES,
            18: COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES_SUMMARY + '/summary',
            19: COMPREHENSIVE_ROUTE_PATHS.STEPS + '/3',
            20: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
            21: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN_SUMMARY + '/summary',
            22: COMPREHENSIVE_ROUTE_PATHS.STEPS + '/4',
            23: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN,
            24: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN_SUMMARY + '/summary',
            25: COMPREHENSIVE_ROUTE_PATHS.VALIDATE_RESULT,
            26: COMPREHENSIVE_ROUTE_PATHS.RESULT
        };

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
                this.comprehensiveFormData = cmpSessionData[ComprehensiveService.SESSION_KEY_FORM_DATA];
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
        if (!this.comprehensiveFormData.comprehensiveDetails.dependentsList) {
            this.comprehensiveFormData.comprehensiveDetails.dependentsList = [] as IDependantDetail[];
        }
        return this.comprehensiveFormData.comprehensiveDetails.dependentsList;
    }

    getChildEndowment() {
        if (!this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList) {
            this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList = [] as IChildEndowment[];
        }
        return this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList;
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
     * Set the comprehensive summary object.
     *
     * @param {IComprehensiveDetails} comprehensiveDetails
     * @memberof ComprehensiveService
     */
    setComprehensiveSummary(comprehensiveDetails: IComprehensiveDetails) {
        this.comprehensiveFormData.comprehensiveDetails = comprehensiveDetails;
        this.reloadDependantDetails();
        this.setBucketAmountByCal();
        this.setViewableMode(false);
        this.commit();
    }

    /**
     * Wrapper method to update the comprehensive details object
     *
     * @memberof ComprehensiveService
     */
    updateComprehensiveSummary() {
        this.setComprehensiveSummary(this.comprehensiveFormData.comprehensiveDetails);
    }

    /**
     * Reload and update the dependant education preference details with dependant name and date of birth.
     *
     * @memberof ComprehensiveService
     */
    reloadDependantDetails() {
        const comprehensiveDetails = this.comprehensiveFormData.comprehensiveDetails;
        const enquiry: IComprehensiveEnquiry = comprehensiveDetails.comprehensiveEnquiry;
        if (enquiry !== null && enquiry.hasDependents && (enquiry.hasEndowments === '1' || enquiry.hasEndowments === '2')) {
            if (comprehensiveDetails.dependentsList && comprehensiveDetails.dependentEducationPreferencesList) {
                comprehensiveDetails.dependentEducationPreferencesList.forEach((eduPref) => {
                    comprehensiveDetails.dependentsList.forEach((dependant) => {
                        if (dependant.id === eduPref.dependentId) {
                            eduPref.dateOfBirth = dependant.dateOfBirth;
                            eduPref.name = dependant.name;
                            eduPref.enquiryId = this.getEnquiryId();
                        }
                    });
                });
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
            const getAge = this.aboutAge.calculateAge(dependant.dateOfBirth, new Date());
            const maxAge = (dependant.gender.toLowerCase() === 'male') ? 21 : 19;
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
        this.comprehensiveFormData.comprehensiveDetails.dependentsList = dependant;
        this.updateComprehensiveSummary();
    }

    setChildEndowment(dependentEducationPreferencesList: IChildEndowment[]) {
        this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList = dependentEducationPreferencesList;
        this.updateComprehensiveSummary();
        this.commit();
    }
    getMyLiabilities() {
        if (!this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities) {
            this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities = {} as IMyLiabilities;
        }
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities;
    }

    setMyLiabilities(myLiabilitiesData: IMyLiabilities) {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveLiabilities = myLiabilitiesData;
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
        if (!this.comprehensiveFormData.comprehensiveDetails.comprehensiveSpending) {
            this.comprehensiveFormData.comprehensiveDetails.comprehensiveSpending = {} as IMySpendings;
        }
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveSpending;
    }
    getEnquiryId() {
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.enquiryId;
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
            return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasDependents;
        }
    }
    getDownOnLuck() {
        if (!this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck) {
            this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck = {} as HospitalPlan;
        }
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck;
    }
    setDownOnLuck(comprehensiveDownOnLuck: HospitalPlan) {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck = comprehensiveDownOnLuck;
        this.commit();
    }
    clearBadMoodFund() {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveDownOnLuck.badMoodMonthlyAmount = null;
        this.commit();
    }

    hasBadMoodFund() {
        const maxBadMoodFund = Math.floor((this.getMyEarnings().totalAnnualIncomeBucket
            - this.getMySpendings().totalAnnualExpenses) / 12);
        return maxBadMoodFund >= 0;
    }

    setDependantSelection(selection: boolean) {

        this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasDependents = selection;
        this.commit();
    }
    hasEndowment() {
        if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry) {
            return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasEndowments;
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
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveRegularSavingsList;
    }
    setRegularSavingsList(regularSavingsPlan: IRegularSavings[]) {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveRegularSavingsList = regularSavingsPlan;
        this.commit();
    }
    hasRegularSavings() {
        if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry) {
            return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.hasRegularSavingsPlans;
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
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveInsurancePlanning;
    }
    setInsurancePlanningList(comprehensiveInsurancePlanning: IInsurancePlan) {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveInsurancePlanning
            = comprehensiveInsurancePlanning;
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
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveRetirementPlanning;
    }
    setRetirementPlan(comprehensiveRetirementPlanning: IRetirementPlan) {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveRetirementPlanning
            = comprehensiveRetirementPlanning;
        this.commit();
    }
    getFormError(form, formName) {
        const controls = form.controls;
        const errors: any = {};
        errors.errorMessages = [];
        errors.title = this.comprehensiveFormError[formName].formFieldErrors.errorTitle;

        for (const name in controls) {
            if (!controls[name].hasOwnProperty('controls') && controls[name].invalid) {
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
                        this.comprehensiveFormError[formName].formFieldErrors[name]['required'].errorMessage
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
        errors.title = this.comprehensiveFormError[formName].formFieldErrors.errorTitle;

        let index = 0;

        // tslint:disable-next-line:forin
        for (const field in forms) {
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
        return errors;
    }

    openErrorModal(title: string, message: any, isMultipleForm: boolean, formName?: string) {
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
                message[index]['formName'] = element.formName.name;
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
    openSummaryPopUpModal(summaryModalDetails) {
        const ref = this.modal.open(SummaryModalComponent, {
            centered: true,
            windowClass: 'full-height-comprehensive',
            backdrop: 'static',
            keyboard: false
        });
        ref.componentInstance.summaryModalDetails = summaryModalDetails;
        ref.result.then((result) => {
        }, (reason) => {
            if (reason === 'dismiss' && summaryModalDetails.routerEnabled) {
                const previousUrl = this.getPreviousUrl(this.router.url);
                if (previousUrl !== null) {
                    this.router.navigate([previousUrl]);
                } else {
                    this.navbarService.goBack();
                }
            }
        });
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
        const urlList = this.getComprehensiveUrlList();
        const currentUrlIndex = toInteger(Util.getKeyByValue(urlList, currentUrl));
        if (currentUrlIndex > 0) {
            const previousUrl = urlList[currentUrlIndex - 1];
            if (previousUrl === ProgressTrackerUtil.trimPath(this.routingService.getCurrentUrl())) {
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

        const urlList = this.getComprehensiveUrlList();
        this.generateProgressTrackerData();

        const currentUrlIndex = toInteger(Util.getKeyByValue(urlList, url));
        let accessibleUrl = '';

        const profileData = this.getMyProfile();
        const cmpSummary = this.getComprehensiveSummary();
        const enquiry = this.getComprehensiveSummary().comprehensiveEnquiry;
        const childEndowmentData: IChildEndowment[] = this.getChildEndowment();

        const dependantProgressData = this.getDependantsProgressData();
        const financeProgressData = this.getFinancesProgressData();
        const fireProofingProgressData = this.getFireproofingProgressData();
        const retirementProgressData = this.getRetirementProgressData();

        for (let index = currentUrlIndex; index >= 0; index--) {
            if (accessibleUrl !== '') {
                break;
            } else {
                switch (index) {
                    // 'getting-started'
                    case 0:
                        // TODO : change the condition to check `cmpSummary.enquiry.promoCodeValidated`
                        if (!cmpSummary.comprehensiveEnquiry.enquiryId) {
                            accessibleUrl = COMPREHENSIVE_BASE_ROUTE;
                        }
                        break;

                    // 'steps/1',
                    case 1:
                    // 'dependant-selection'
                    case 2:
                        if (profileData.nation) {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'dependant-selection/summary'
                    case 3:
                        if (enquiry.hasDependents === false && dependantProgressData.subItems[0].value === '0') {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'dependant-details'
                    case 4:
                        if (enquiry.hasDependents !== null && enquiry.hasDependents !== false) {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'dependant-details/summary'
                    case 5:
                        if (!this.hasChildDependant()) {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'dependant-education-selection'
                    case 6:
                        if (this.hasChildDependant()) {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'dependant-education-selection/summary'
                    case 7:
                        if (this.hasChildDependant() && (this.hasEndowment() === '0' || this.hasEndowment() === '2')) {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'dependant-education-preference'
                    case 8:
                        if (this.hasChildDependant() && this.hasEndowment() === '1') {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'dependant-education-list'
                    case 9:
                    // 'dependant-education-list/summary'
                    case 10:
                        let eduPref = '';
                        if (childEndowmentData.length > 0 && childEndowmentData[0].location !== null) {
                            eduPref = childEndowmentData[0].location;
                        }
                        if (this.hasChildDependant() && this.hasEndowment() === '1' && eduPref !== '') {
                            accessibleUrl = urlList[index];
                        }
                        break;

                    // 'steps/2'
                    case 11:
                    // 'my-earnings'
                    case 12:
                        let canAccess = true;
                        dependantProgressData.subItems.forEach((subItem) => {
                            if (!subItem.completed && subItem.hidden !== true) {
                                canAccess = false;
                            }
                        });
                        if (canAccess) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'my-spendings'
                    case 13:
                        if (financeProgressData.subItems[0].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'regular-saving-plan'
                    case 14:
                        if (financeProgressData.subItems[1].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'bad-mood-fund'
                    case 15:
                        if (financeProgressData.subItems[2].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'my-assets'
                    case 16:
                        if (financeProgressData.subItems[4].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'my-liabilities'
                    case 17:
                        if (financeProgressData.subItems[5].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'my-liabilities/summary'
                    case 18:
                    // 'steps/3'
                    case 19:
                    // 'insurance-plan'
                    case 20:
                        if (financeProgressData.subItems[6].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'insurance-plan/summary'
                    case 21:
                    // 'steps/4'
                    case 22:
                    // 'retirement-plan'
                    case 23:
                        if (fireProofingProgressData.subItems[0].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    // 'retirement-plan/summary'
                    case 24:
                    // 'result'
                    case 25:
                    case 26:
                        if (retirementProgressData.subItems[0].completed) {
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
            subTitle: 'Time Taken: 20 mins',
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

        return this.progressData;
    }

    getGetStartedProgressData(): IProgressTrackerItem {
        const myProfile: IMyProfile = this.getMyProfile();
        return {
            title: 'Get Started',
            expanded: true,
            completed: typeof myProfile.gender !== 'undefined',
            customStyle: this.getStartedStyle,
            subItems: [
                {
                    id: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED,
                    path: COMPREHENSIVE_ROUTE_PATHS.GETTING_STARTED,
                    title: 'Tell us about you',
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

        if (enquiry && enquiry.hasDependents !== null && dependantData.length > 0) {
            hasDependants = true;
        }
        if (enquiry && enquiry.hasEndowments === '1' && childEndowmentData.length > 0) {
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
            id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS,
            path: (enquiry.hasDependents !== null && enquiry.hasDependents !== false)
                ? COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS : COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_SELECTION,
            title: 'Number of Dependant',
            value: noOfDependants,
            completed: enquiry.hasDependents !== null
        });
        if (enquiry.hasDependents === null || dependantData.length > 0) {

            const eduPrefs: IChildEndowment[] = this.getChildEndowment();
            const eduPlan: string = this.hasEndowment();

            const prefsList: IProgressTrackerSubItemList[] = [];
            let prefsListCompleted = false;
            let hasEndowmentAmount = false;
            const tempPrefsList = [];

            if (eduPrefs && enquiry.hasDependents !== null && enquiry.hasEndowments === '1') {
                eduPrefs.forEach((item) => {
                    if (!Util.isEmptyOrNull(item.location)) {
                        tempPrefsList.push(item);
                    }
                    if (!Util.isEmptyOrNull(item.endowmentMaturityYears)) {
                        hasEndowmentAmount = true;
                    }
                    prefsList.push({
                        title: item.name,
                        value: (item.location === null ? '' : item.location)
                            + (item.educationCourse === null ? '' : ', ' + item.educationCourse)
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

            subItemsArray.push(
                {
                    id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION,
                    path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION,
                    title: 'Plan for children education',
                    value: hasEduPlansValue,
                    completed: enquiry.hasEndowments !== null && hasDependants && eduPrefs && typeof eduPrefs !== 'undefined',
                    hidden: !this.hasChildDependant()
                });

            if (enquiry.hasEndowments === '1') {
                subItemsArray.push(
                    {
                        id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE,
                        path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE,
                        title: 'Education Preferences',
                        value: prefsList.length === 0 || enquiry.hasEndowments !== '1' ? 'No' : '',
                        completed: hasDependants && hasEndowments && eduPrefs && typeof eduPrefs !== 'undefined' && prefsListCompleted,
                        list: prefsList
                    });
                subItemsArray.push(
                    {
                        id: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST,
                        path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST,
                        title: 'Do you have education endowment plan',
                        value: hasEndowmentPlans,
                        completed: (hasDependants && hasEndowments && prefsListCompleted
                            && (typeof eduPlan !== 'undefined' || eduPlan !== '0'))
                    });
            }
        }
        return {
            title: 'What\'s on your shoulders',
            expanded: true,
            completed: hasDependants,
            customStyle: 'dependant',
            subItems: subItemsArray
        };
    }

    transformAsCurrency(in_amount: any): string {
        return this.currencyPipe.transform(in_amount, 'USD',
            'symbol-narrow',
            '1.0-2');
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
            value: earningsData && earningsData.totalAnnualIncomeBucket >= 0
                ? this.transformAsCurrency(earningsData.totalAnnualIncomeBucket) + '' : '',
            completed: !Util.isEmptyOrNull(earningsData)
        });
        subItemsArray.push({
            id: COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS,
            path: COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS,
            title: 'Your Spendings',
            value: spendingsData && spendingsData.totalAnnualExpenses >= 0
                ? this.transformAsCurrency(spendingsData.totalAnnualExpenses) + '' : '',
            completed: !Util.isEmptyOrNull(spendingsData)
        });

        subItemsArray.push({
            id: COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN,
            path: COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN,
            title: 'Regular Savings Plan',
            value: '',
            completed: this.hasRegularSavings() !== null,
            hidden: true
        });

        subItemsArray.push({
            id: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
            path: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
            title: 'Bad Mood Fund',
            value: this.getDownOnLuck().badMoodMonthlyAmount
                ? this.transformAsCurrency(this.getDownOnLuck().badMoodMonthlyAmount) + '' : '',
            completed: typeof this.getDownOnLuck().hospitalPlanId !== 'undefined',
            hidden: !this.hasBadMoodFund() && !Util.isEmptyOrNull(earningsData)
        });

        subItemsArray.push({
            id: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND + '1',
            path: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
            title: 'Hospital Choice',
            value: typeof this.getDownOnLuck().hospitalPlanId !== 'undefined'
                ? this.getDownOnLuck().hospitalPlanName : '',
            completed: typeof this.getDownOnLuck().hospitalPlanId !== 'undefined'
        });

        subItemsArray.push({
            id: COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS,
            path: COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS,
            title: 'Assets (What You Own)',
            value: assetsData && assetsData.totalAnnualAssets >= 0
                ? this.transformAsCurrency(assetsData.totalAnnualAssets) + '' : '',
            completed: !Util.isEmptyOrNull(assetsData)
        });
        subItemsArray.push({
            id: COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES,
            path: COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES,
            title: 'Liabilities (What You Owe)',
            value: liabilitiesData && liabilitiesData.totalAnnualLiabilities >= 0
                ? this.transformAsCurrency(liabilitiesData.totalAnnualLiabilities) + '' : '',
            completed: !Util.isEmptyOrNull(liabilitiesData)
        });
        return {
            title: 'Your Finances',
            expanded: true,
            completed: false,
            customStyle: this.getStartedStyle,
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
        let ocpDisabilityValue = '$0';
        let longTermCareValue = '$0';
        if (isCompleted) {
            const haveHospitalPlan = cmpSummary.comprehensiveInsurancePlanning.haveHospitalPlan;
            if (haveHospitalPlan) {
                hospitalPlanValue = 'Yes';
            } else if (haveHospitalPlan !== null && !haveHospitalPlan) {
                hospitalPlanValue = 'No';
            }

            const haveCPFDependentsProtectionScheme = cmpSummary.comprehensiveInsurancePlanning.haveCPFDependentsProtectionScheme;
            if (!Util.isEmptyOrNull(haveCPFDependentsProtectionScheme)) {
                if (haveCPFDependentsProtectionScheme === 0) {
                    const otherLifeProtectionCoverageAmount = cmpSummary.comprehensiveInsurancePlanning.otherLifeProtectionCoverageAmount;
                    const lifeProtectionAmount = cmpSummary.comprehensiveInsurancePlanning.lifeProtectionAmount;
                    const homeProtectionCoverageAmount = cmpSummary.comprehensiveInsurancePlanning.homeProtectionCoverageAmount;
                    cpfDependantProtectionSchemeValue = this.transformAsCurrency(Util.toNumber(otherLifeProtectionCoverageAmount)
                        + Util.toNumber(lifeProtectionAmount) + Util.toNumber(homeProtectionCoverageAmount));
                } else if (haveCPFDependentsProtectionScheme === 1) {
                    cpfDependantProtectionSchemeValue = 'No';
                } else if (haveCPFDependentsProtectionScheme === 2) {
                    cpfDependantProtectionSchemeValue = 'Not Sure';
                }
            }

            if (!Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.criticalIllnessCoverageAmount)) {
                criticalIllnessValue = this.transformAsCurrency(cmpSummary.comprehensiveInsurancePlanning.criticalIllnessCoverageAmount);
            }

            if (!Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.disabilityIncomeCoverageAmount)) {
                ocpDisabilityValue = this.transformAsCurrency(cmpSummary.comprehensiveInsurancePlanning.disabilityIncomeCoverageAmount);
            }

            if (!Util.isEmptyOrNull(cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield)) {
                if (cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield === 0) {
                    longTermCareValue = this.transformAsCurrency(cmpSummary.comprehensiveInsurancePlanning.longTermElderShieldAmount);
                } else if (cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield === 1) {
                    longTermCareValue = 'No';
                } else if (cmpSummary.comprehensiveInsurancePlanning.haveLongTermElderShield === 2) {
                    longTermCareValue = 'Not Sure';
                }
            }
        }

        return {
            title: 'Your Current Fireproofing',
            expanded: true,
            completed: false,
            customStyle: this.getStartedStyle,
            subItems: [
                {
                    id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
                    path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
                    title: 'Do you have a hospital plan',
                    value: hospitalPlanValue,
                    completed: isCompleted
                },
                {
                    id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '1',
                    path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
                    title: 'Life Protection',
                    value: cpfDependantProtectionSchemeValue,
                    completed: isCompleted
                },
                {
                    id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '2',
                    path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
                    title: 'Critical Illness',
                    value: criticalIllnessValue,
                    completed: isCompleted
                },
                {
                    id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '3',
                    path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
                    title: 'Occupational Disability',
                    value: ocpDisabilityValue,
                    completed: isCompleted
                },
                {
                    id: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN + '4',
                    path: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
                    title: 'Long-Term Care',
                    value: longTermCareValue,
                    completed: isCompleted,
                    hidden: (this.ageUtil.calculateAge(this.getMyProfile().dateOfBirth, new Date()) <
                        COMPREHENSIVE_CONST.INSURANCE_PLAN.LONG_TERM_INSURANCE_AGE)
                }
            ]
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
        if (isCompleted && cmpSummary.comprehensiveRetirementPlanning.retirementAge) {
            retirementAgeValue = cmpSummary.comprehensiveRetirementPlanning.retirementAge + ' yrs old';
        }
        return {
            title: 'Financial Independence',
            expanded: true,
            completed: false,
            customStyle: this.getStartedStyle,
            subItems: [{
                id: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN,
                path: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN,
                title: 'Retirement Age',
                value: retirementAgeValue,
                completed: isCompleted
            }]
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
        } else if ((bucketFlag.indexOf(true) >= 0 && bucketFlag.indexOf(false) >= 0) || totalBucket > 0) {
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
            const inputBucket = Object.assign({}, this.comprehensiveFormData.comprehensiveDetails[financeData.API_KEY]);
            if (Object.keys(inputBucket).length > 0 && inputBucket.constructor === Object) {
                const popInputBucket = financeData.POP_FORM_INPUT;
                const filterInput = this.unSetObjectByKey(inputBucket, popInputBucket);
                const inputParams = financeData.MONTHLY_INPUT_CALC;
                const inputTotal = this.additionOfCurrency(filterInput, inputParams);
                this.comprehensiveFormData.comprehensiveDetails[financeData.API_KEY][financeData.API_TOTAL_BUCKET_KEY]
                    = (!isNaN(inputTotal) && inputTotal > 0) ? inputTotal : 0;
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
                        if (innerKey !== 'enquiryId' && removeKey.indexOf(innerKey) < 0) {
                            const Regexp = new RegExp('[,]', 'g');
                            let thisValue: any = (objDetails[innerKey] + '').replace(Regexp, '');
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
            computedVal = Math.pow((1 + percentCal), aboutAge);
            finalResult = Math.round(computedVal * amount);
        }
        return finalResult;
    }
    /**
     * Dependant Summary Page Compute
     */
    setDependantExpense(location: any, univ: any, aboutAge: number, nation: any) {
        let totalExpense: any = 0;
        const summaryConst = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.DEPENDANT;
        Object.keys(summaryConst).forEach((expenseInput) => {
            let locationChange = location;
            if (location === 'Singapore' && (nation === 'Foreigner' || nation === 'Singaporean PR')) {
                locationChange = nation;
            }
            const expenseConfig = summaryConst[expenseInput];
            totalExpense += this.getComputedExpense(expenseConfig[univ][locationChange], expenseConfig.PERCENT, aboutAge);
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
            sumLiquidCash -= (6 * expenseDetails);
        }
        return (Math.floor(sumLiquidCash));
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
        const homePayTotal = this.getTakeHomeSalary(earningDetails, summaryConfig, true);
        const regularSavingTotal = this.getRegularSaving('cash', true);
        const badMoodTotal = this.getBadMoodFund();
        const expenseTotal = this.getHomeExpenses('cash', true);
        const annualBonus = (earningDetails && earningDetails.annualBonus) ? this.getValidAmount(earningDetails.annualBonus) : 0;
        const annualDividend = (earningDetails && earningDetails.annualDividends) ? this.getValidAmount(earningDetails.annualDividends) : 0;
        spareCash = (summaryConfig.SPARE_CASH_EARN_SPEND_PERCENT * (homePayTotal - expenseTotal - regularSavingTotal - badMoodTotal))
            + (summaryConfig.SPARE_CASH_ANNUAL_PERCENT * (annualBonus + annualDividend));
        return (Math.floor(spareCash));
    }
    /**
     * Compute Take Home
     * annual Flag = true for annual calculation
     * annual Flag = false for monthly calculation
     */
    getTakeHomeSalary(earningDetails: any, summaryConfig: any, annualFlag: boolean) {
        const baseProfile = this.getMyProfile();
        let homeSalary = 0;
        let homeCpfSalary = 0;
        if (earningDetails && earningDetails !== null && earningDetails.totalAnnualIncomeBucket > 0) {
            if (baseProfile && baseProfile.nation === 'Foreigner') {
                homeSalary += this.getValidAmount(earningDetails.monthlySalary);
                homeSalary += this.getValidAmount(earningDetails.otherMonthlyWorkIncome);
            } else {
                const cpfDetails = {
                    amountLimitCpf: summaryConfig.HOME_PAY_CPF_SELF_EMPLOYED_BREAKDOWN,
                    cpfPercent: summaryConfig.HOME_PAY_CPF_SELF_EMPLOYED_PERCENT
                };
                if (earningDetails.employmentType === 'Employed') {
                    cpfDetails.amountLimitCpf = summaryConfig.HOME_PAY_CPF_EMPLOYED_BREAKDOWN;
                    cpfDetails.cpfPercent = summaryConfig.HOME_PAY_CPF_EMPLOYED_PERCENT;
                }
                homeCpfSalary += this.getValidAmount(earningDetails.monthlySalary);
                homeCpfSalary += this.getValidAmount(earningDetails.otherMonthlyWorkIncome);
                if (homeCpfSalary > cpfDetails.amountLimitCpf) {
                    homeSalary = (cpfDetails.amountLimitCpf * cpfDetails.cpfPercent) + (homeCpfSalary - cpfDetails.amountLimitCpf);
                } else {
                    homeSalary = (homeCpfSalary * cpfDetails.cpfPercent);
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
            const inputParams = { rsp: rspDetails };
            const removeParams = ['enquiryId'];
            if (mode === 'cash') {
                removeParams.push('regularPaidByCPF');
            } else if (mode === 'cpf') {
                removeParams.push('regularPaidByCash');
            }
            const filterInput = this.unSetObjectByKey(inputParams, removeParams);
            const monthlySumCal = this.additionOfCurrency(filterInput);
            if (annualFlag) {
                return (monthlySumCal * 12);
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
                homeExpenses += this.getValidAmount(expenseDetails.HLMortgagePaymentUsingCash);
                homeExpenses += this.getValidAmount(expenseDetails.mortgagePaymentUsingCash);
            }
            if (modeType === 'cpf' || modeType === 'both') {
                homeExpenses += this.getValidAmount(expenseDetails.HLMortgagePaymentUsingCPF);
                homeExpenses += this.getValidAmount(expenseDetails.mortgagePaymentUsingCPF);
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
        const homePayTotal = this.getTakeHomeSalary(earningDetails, summaryConfig, false);
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
        if (badMoodDetails && badMoodDetails !== null && badMoodDetails.badMoodMonthlyAmount) {
            const badMoodMonthly = this.getValidAmount(badMoodDetails.badMoodMonthlyAmount);
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
            return toInteger(thisValue);
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
        const enquiry: IComprehensiveEnquiry = getComprehensiveDetails.comprehensiveEnquiry;
        const userGender = (getComprehensiveDetails.baseProfile.gender).toLowerCase();
        const userAge = this.aboutAge.calculateAge(getComprehensiveDetails.baseProfile.dateOfBirth, new Date());
        const fireProofingDetails = { dependant: false, gender: userGender.toLowerCase(), age: userAge };
        if (enquiry.hasDependents) {
            getComprehensiveDetails.dependentsList.forEach((dependant) => {
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
            return this.comprehensiveFormData.comprehensiveDetails.comprehensiveViewMode;
        }
        return false;
    }
    setViewableMode(commitFlag: boolean) {
        if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.reportStatus ===
            COMPREHENSIVE_CONST.REPORT_STATUS.SUBMITTED) {
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
        if (!getCompData || !getCompData.comprehensiveEnquiry.reportStatus ||
            getCompData.comprehensiveEnquiry.reportStatus === null || getCompData.comprehensiveEnquiry.reportStatus === ''
            || getCompData.comprehensiveEnquiry.reportStatus !== COMPREHENSIVE_CONST.REPORT_STATUS.NEW) {
            validateFlag = false;
        }
        const getResultConfig = COMPREHENSIVE_CONST.YOUR_RESULTS;
        let totalAmount = 0;
        Object.keys(getResultConfig).forEach((financeInput) => {
            const apiInput = getResultConfig[financeInput].API_KEY;
            const validationDataSet = getResultConfig[financeInput].VALIDATION_INPUT;
            validationDataSet.forEach((dataSet) => {
                if (getCompData[apiInput][dataSet]) {
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
        // tslint:disable-next-line:no-commented-code
        /*if (!progressData.completed) {
            completedStatus = false;
        }*/
        Object.keys(progressData.subItems).forEach((completedData) => {
            if (!progressData.subItems[completedData].completed && !progressData.subItems[completedData].hidden) {
                completedStatus = false;
            }
        });
        return completedStatus;
    }
    setMySteps(currentStep: number) {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.stepCompleted = currentStep;
        this.commit();
    }
    getMySteps() {
        if (this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.stepCompleted) {
            return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.stepCompleted;
        } else {
            return 0;
        }
    }
    setReportStatus(reportStatus: string) {
        this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.reportStatus = reportStatus;
        this.commit();
    }
    getReportStatus() {
        return this.comprehensiveFormData.comprehensiveDetails.comprehensiveEnquiry.reportStatus;
    }
}
