import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyInfoService } from '../shared/Services/my-info.service';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import {
    IEnquiryData,
    IFinancialStatusMapping,
    IHospitalizationNeedsData,
    ILifeProtection,
    IRecommendationRequest
} from './../shared/interfaces/recommendations.request';
import { Formatter } from './../shared/utils/formatter.util';
import { GuideMeCalculateService } from './guide-me-calculate.service';
import { GuideMeService } from './guide-me.service';
import { IExistingCoverage } from './insurance-results/existing-coverage-modal/existing-coverage.interface';

@Injectable({
    providedIn: 'root'
})
export class GuideMeApiService {
    existingCoverage: IExistingCoverage;
    constructor(
        private http: HttpClient, private apiService: ApiService,
        private myInfoService: MyInfoService,
        private authService: AuthenticationService, private guideMeService: GuideMeService,
        private calculateService: GuideMeCalculateService) {
        this.existingCoverage = this.guideMeService.getExistingCoverageValues();
    }

    getProfileList() {
        return this.apiService.getProfileList();
    }

    getProtectionNeedsList() {
        const userInfoForm: any = {
            profileId: this.guideMeService.getGuideMeFormData().myProfile,
            birthDate: this.guideMeService.getGuideMeFormData().customDob,
            noOfDependents: this.guideMeService.getUserInfo().dependent,
            journeyType: 'guided'
        };
        return this.apiService.getProtectionNeedsList(userInfoForm);
    }

    getHospitalPlanList() {
        return this.apiService.getHospitalPlanList();
    }

    getLongTermCareList() {
        return this.apiService.getLongTermCareList();
    }

    getRecommendations() {
        return this.apiService.getRecommendations(this.constructRecommendationsRequest());
    }

    getCustomerInsuranceDetails() {
        return this.apiService.getCustomerInsuranceDetails();
    }

    private constructRecommendationsRequest(): IRecommendationRequest {
        const requestObj = {} as IRecommendationRequest;
        requestObj.sessionId = this.authService.getSessionId();

        requestObj.enquiryProtectionTypeData = this.guideMeService.getSelectedProtectionNeedsList();
        let existingCoverageList = this.guideMeService.getExistingCoverageValues();
        if (!existingCoverageList) {
            existingCoverageList = this.guideMeService.getEmptyExistingCoverage();
        }
        requestObj.existingInsuranceList = [existingCoverageList];

        requestObj.financialStatusMapping = {} as IFinancialStatusMapping;
        requestObj.financialStatusMapping.assets = this.guideMeService.getMyAssets();
        requestObj.financialStatusMapping.income = this.guideMeService.getMyIncome();
        requestObj.financialStatusMapping.liabilities = this.guideMeService.getMyLiabilities();
        requestObj.financialStatusMapping.expenses = this.guideMeService.getMyExpenses();

        requestObj.hospitalizationNeeds = this.getHospitalPlanData();
        requestObj.criticalIllnessNeedsData = this.calculateService.getCriticalIllnessData();

        requestObj.occupationalDisabilityNeeds = this.calculateService.getOcpData();

        requestObj.longTermCareNeeds = this.calculateService.getLtcData();
        requestObj.dependentsData = this.getDependentsData();
        requestObj.lifeProtectionNeeds = this.calculateService.getLifeProtectionData();
        requestObj.enquiryData = this.getEnquiryData();

        return requestObj;
    }

    getHospitalPlanData(): IHospitalizationNeedsData {
        const hospitalPlan = this.guideMeService.getHospitalPlan();
        return {
            hospitalClassId: hospitalPlan.hospitalClassId,
            isPartialRider: hospitalPlan.isFullRider
        } as IHospitalizationNeedsData;
    }

    getEnquiryData() {
        const smoker: boolean =
            this.guideMeService.getGuideMeFormData().smoker.toLowerCase() === 'smoker' ? true : false;
        const dobObj = this.guideMeService.getGuideMeFormData().dob;
        const dob = dobObj.day + '-' + dobObj.month + '-' + dobObj.year;
        const enquiryData = {
            id: 0,
            profileStatusId: this.guideMeService.getProfile().myProfile,
            customerId: 0,
            careGiverId: this.guideMeService.getLongTermCare().careGiverTypeId,
            hospitalClassId: this.guideMeService.getHospitalPlan().hospitalClassId,
            sessionTrackerId: 0,
            gender: this.guideMeService.getGuideMeFormData().gender,
            dateOfBirth: dob,
            isSmoker: smoker,
            employmentStatusId: 0,
            numberOfDependents: this.guideMeService.getGuideMeFormData().dependent,
            hasPremiumWaiver: false,
            type: 'insurance-guided'
        } as IEnquiryData;

        return enquiryData;
    }

    getDependentsData() {
        const dependentsData = [];
        const dependentList = this.guideMeService.getLifeProtection().dependents;
        for (const dependent of dependentList) {
            const thisDependent = {
                gender: dependent.gender,
                relationship: dependent.relationship,
                age: dependent.age,
                dependentProtectionNeeds: {
                    dependentId: 0,
                    educationCourse: dependent.eduSupportCourse,
                    monthlySupportAmount: Formatter.getIntValue(dependent.supportAmount),
                    countryOfEducation: dependent.eduSupportCountry,
                    nationality: dependent.eduSupportNationality,
                    universityEntryAge: 0,
                    yearsNeeded: dependent.yearsNeeded
                }
            } as ILifeProtection;
            dependentsData.push(thisDependent);
        }
        return dependentsData;
    }
}
