import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { SummaryModalComponent } from '../shared/modal/summary-modal/summary-modal.component';
import { ToolTipModalComponent } from '../shared/modal/tooltip-modal/tooltip-modal.component';
import { Util } from '../shared/utils/util';
import { appConstants } from './../app.constants';
import { ProgressTrackerUtil } from './../shared/modal/progress-tracker/progress-tracker-util';
import {
    IProgressTrackerData,
    IProgressTrackerItem,
    IProgressTrackerSubItemList
} from './../shared/modal/progress-tracker/progress-tracker.types';
import { COMPREHENSIVE_CONST } from './comprehensive-config.constants';
import { ComprehensiveFormData } from './comprehensive-form-data';
import { ComprehensiveFormError } from './comprehensive-form-error';
import { COMPREHENSIVE_ROUTE_PATHS } from './comprehensive-routes.constants';
import {
    HospitalPlan,
    IChildEndowment,
    IComprehensiveDetails,
    IComprehensiveEnquiry,
    IDependantDetail,
    IInsurancePlan,
    IMyAssets,
    IMyEarnings,
    IMyLiabilities,
    IMyProfile,
    IMySpendings,
    IProgressTrackerWrapper,
    IRegularSavings
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
    constructor(
        private http: HttpClient, private modal: NgbModal, private location: Location) {
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

    getHospitalPlan(): HospitalPlan {
        if (!this.comprehensiveFormData.hospitalPlanData) {
            this.comprehensiveFormData.hospitalPlanData = {} as HospitalPlan;
        }
        return this.comprehensiveFormData.hospitalPlanData;
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
            3: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS,
            4: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION,
            5: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE,
            6: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST,
            7: COMPREHENSIVE_ROUTE_PATHS.STEPS + '/2',
            8: COMPREHENSIVE_ROUTE_PATHS.MY_EARNINGS,
            9: COMPREHENSIVE_ROUTE_PATHS.MY_SPENDINGS,
            10: COMPREHENSIVE_ROUTE_PATHS.REGULAR_SAVING_PLAN,
            11: COMPREHENSIVE_ROUTE_PATHS.MY_ASSETS,
            12: COMPREHENSIVE_ROUTE_PATHS.MY_LIABILITIES,
            13: COMPREHENSIVE_ROUTE_PATHS.BAD_MOOD_FUND,
            14: COMPREHENSIVE_ROUTE_PATHS.STEPS + '/3',
            15: COMPREHENSIVE_ROUTE_PATHS.INSURANCE_PLAN,
            16: COMPREHENSIVE_ROUTE_PATHS.STEPS + '/4',
            17: COMPREHENSIVE_ROUTE_PATHS.RETIREMENT_PLAN
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

    setMyProfile(profile: IMyProfile) {
        this.comprehensiveFormData.comprehensiveDetails.baseProfile = profile;
        this.commit();
    }
    setMyDependant(dependant: IDependantDetail[]) {
        this.comprehensiveFormData.comprehensiveDetails.dependentsList = dependant;
        this.updateComprehensiveSummary();
    }

    setChildEndowment(dependentEducationPreferencesList: IChildEndowment[]) {
        this.comprehensiveFormData.comprehensiveDetails.dependentEducationPreferencesList = dependentEducationPreferencesList;
        this.updateComprehensiveSummary();
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
        if (!this.comprehensiveFormData.comprehensiveDetails.downOnLuck) {
            this.comprehensiveFormData.comprehensiveDetails.downOnLuck = {} as HospitalPlan;
        }
        return this.comprehensiveFormData.comprehensiveDetails.downOnLuck;
    }
    setDownOnLuck(downOnLuck: HospitalPlan) {
        this.comprehensiveFormData.comprehensiveDetails.downOnLuck = downOnLuck;
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
    setRegularSavings(selection: string) {

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
                this.location.back();
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

    // tslint:disable-next-line:cognitive-complexity
    getAccessibleUrl(url: string): string {
        const urlList = this.getComprehensiveUrlList();
        this.generateProgressTrackerData();

        const currentUrlIndex = toInteger(Util.getKeyByValue(urlList, url));
        let accessibleUrl = '';
        const profileData = this.getMyProfile();
        const dependantProgressData = this.getDependantsProgressData();
        for (let index = currentUrlIndex; index >= 0; index--) {
            if (accessibleUrl !== '') {
                break;
            } else {
                switch (index) {
                    case 0:
                        accessibleUrl = urlList[index];
                        break;
                    case 1:
                    case 2:
                        if (profileData.nation) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                    case 3:
                        if (dependantProgressData.subItems[0].completed) {
                            accessibleUrl = urlList[index];
                        }
                        break;
                }
            }
        }

        if (accessibleUrl === '') {
            accessibleUrl = urlList[0];
            // TODO : remove the below line after above routing switch cases are updated correctly
            accessibleUrl = url;
        }
        return accessibleUrl;
    }

    generateProgressTrackerData(): IProgressTrackerData {
        this.progressData = {} as IProgressTrackerData;
        this.progressData = {
            title: 'Progress Tracker Title',
            subTitle: 'Time Taken: 20 mins',
            properties: {
                disabled: false
            },
            items: []
        };

        this.progressData.items.push(this.getGetStartedProgressData());
        this.progressData.items.push(this.getDependantsProgressData());
        this.progressData.items.push(this.getFinancesProgressData());

        return this.progressData;
    }

    getGetStartedProgressData(): IProgressTrackerItem {
        const myProfile: IMyProfile = this.getMyProfile();
        return {
            title: 'Get Started',
            expanded: true,
            completed: typeof myProfile.gender !== 'undefined',
            customStyle: 'get-started',
            subItems: [
                {
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
        let hasDependants = false;
        let hasEndowments = false;
        let hasRegularSavings = false;
        const enquiry = this.getComprehensiveSummary().comprehensiveEnquiry;
        if (enquiry && enquiry.hasDependents !== null) {
            hasDependants = true;
        }
        if (enquiry && enquiry.hasEndowments !== null) {
            hasEndowments = true;
        }
        if (enquiry && enquiry.hasRegularSavingsPlans !== null) {
            hasRegularSavings = true;
        }
        const dependantDetails: IDependantDetail[] = this.getMyDependant();
        const eduPrefs: IChildEndowment[] = this.getChildEndowment();
        const eduPlan: string = this.hasEndowment();

        let noOfDependants = '';
        if (dependantDetails) {
            noOfDependants = dependantDetails.length + '';
        }
        const prefsList: IProgressTrackerSubItemList[] = [];
        if (eduPrefs) {
            eduPrefs.forEach((item) => {
                prefsList.push({
                    title: item.name,
                    value: item.location + ', ' + item.educationCourse
                });
            });
        }

        let hasEndowmentPlans = '';
        if (eduPlan === '1') {
            hasEndowmentPlans = 'Yes';
        } else if (eduPlan === '2') {
            hasEndowmentPlans = 'No';
        }

        let hasEduPlans = '';
        if (hasDependants && eduPrefs) {
            hasEduPlans = eduPrefs.length > 0 ? 'Yes' : 'No';
        }

        return {
            title: 'What\'s on your shoulders',
            expanded: true,
            completed: hasDependants,
            customStyle: 'dependant',
            subItems: [
                {
                    path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS,
                    title: 'Number of Dependant',
                    value: noOfDependants,
                    completed: hasDependants && typeof dependantDetails !== 'undefined'
                },
                {
                    path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_SELECTION,
                    title: 'Plan for children education',
                    value: hasEduPlans,
                    completed: hasDependants && eduPrefs && typeof eduPrefs !== 'undefined'
                },
                {
                    path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_PREFERENCE,
                    title: 'Education Preferences',
                    value: '',
                    completed: hasDependants && eduPrefs && typeof eduPrefs !== 'undefined',
                    list: prefsList
                },
                {
                    path: COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_EDUCATION_LIST,
                    title: 'Do you have education endowment plan',
                    value: hasEndowmentPlans,
                    completed: (hasEndowments && (typeof eduPlan !== 'undefined' || eduPlan !== '0'))
                }
            ]
        };
    }

    getFinancesProgressData(): IProgressTrackerItem {
        return {
            title: 'Your Finances',
            expanded: true,
            completed: false,
            customStyle: 'get-started',
            subItems: [
                {
                    path: 'GetStartedComponent',
                    title: 'Your Earnings',
                    value: '',
                    completed: false
                },
                {
                    path: 'GetStartedComponent1',
                    title: 'Your Spendings',
                    value: '',
                    completed: false
                },
                {
                    path: 'GetStartedComponent1',
                    title: 'Bad Mood Fund',
                    value: '',
                    completed: false
                },
                {
                    path: 'GetStartedComponent1',
                    title: 'Hospital Choice',
                    value: '',
                    completed: false
                }
            ]
        };
    }
    /*
    *Bucket Calculation for Earnings and Assets
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
    /*
   *Set Total Bucket Income For Earnings
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
    /*
    *Remove key from Object
    * First Parameter is Object and Second Parameter is array with key need to pop
    */
    // tslint:disable-next-line: cognitive-complexity
    unSetObjectByKey(inputObject: any, removeKey: any) {
        Object.keys(inputObject).forEach((key) => {
            if (Array.isArray(inputObject[key])) {
                inputObject[key].forEach((objDetails: any, index) => {
                    Object.keys(objDetails).forEach((innerKey) => {
                        if (innerKey !== 'enquiryId') {
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
    /*
    *Compute Expense Calculation for Summary Page
    *PV x (1+r)^n
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
    /*
    *Dependant Summary Page Compute
    */
    setDependantExpense(location: any, univ: any, aboutAge: number) {
        let totalExpense: any = 0;
        const summaryConst = COMPREHENSIVE_CONST.SUMMARY_CALC_CONST.EDUCATION_ENDOWMENT.DEPENDANT;
        Object.keys(summaryConst).forEach((expenseInput) => {
            const expenseConfig = summaryConst[expenseInput];
            totalExpense += this.getComputedExpense(expenseConfig[univ][location], expenseConfig.PERCENT, aboutAge);
            console.log(totalExpense);
        });
        return totalExpense;
    }
}
