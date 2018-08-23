import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from './../shared/http/api.service';
import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { GuideMeService } from './guide-me.service';
import { IEnquiryData, IRecommendationRequest } from './interfaces/recommendations.request';

@Injectable({
    providedIn: 'root'
})
export class GuideMeApiService {
    constructor(
        private http: HttpClient, private apiService: ApiService,
        private authService: AuthenticationService, private guideMeService: GuideMeService) {

    }

    getProfileList() {
        return this.apiService.getProfileList();
    }

    getProtectionNeedsList() {
        const userInfoForm: any = {
            profileId: this.guideMeService.getGuideMeFormData().myProfile,
            birthDate: this.guideMeService.getGuideMeFormData().customDob
        };
        return this.apiService.getProtectionNeedsList(userInfoForm);
    }

    getHospitalPlanList() {
        return this.apiService.getHospitalPlanList();
    }

    getLongTermCareList() {
        return this.apiService.getLongTermCareList();
    }

    constructRecommendationsRequest(): IRecommendationRequest {
        const requestObj = {} as IRecommendationRequest;
        requestObj.sessionId = this.authService.getAppSecretKey();
        requestObj.criticalIllnessNeedsData = this.guideMeService.getCiAssessment();
        requestObj.enquiryProtectionTypeData = this.guideMeService.getSelectedProtectionNeedsList();
        requestObj.existingInsuranceList = this.guideMeService.getExistingCoverage();
        requestObj.financialStatusMapping.assets = this.guideMeService.getMyAssets();
        requestObj.financialStatusMapping.income = this.guideMeService.getMyIncome();
        requestObj.financialStatusMapping.liabilities = this.guideMeService.getMyLiabilities();
        requestObj.financialStatusMapping.expenses = this.guideMeService.getMyExpenses();
        requestObj.hospitalizationNeeds = this.guideMeService.getHospitalPlan();
        requestObj.occupationalDisabilityNeeds = this.guideMeService.getMyOcpDisability();
        requestObj.longTermCareNeeds = this.guideMeService.getLongTermCare();
        requestObj.dependentsData = null;
        requestObj.lifeProtectionNeeds = null;
        requestObj.enquiryData = this.getEnquiryData();

        return requestObj;
    }

    getEnquiryData() {
        const smoker: boolean =
            this.guideMeService.getGuideMeFormData().smoker.toLowerCase() === 'smoker' ? true : false;
        const enquiryData = {
            id: 0,
            profileStatusId: this.guideMeService.getProfile().myProfile,
            customerId: 0,
            careGiverId: this.guideMeService.getLongTermCare().careGiverTypeId,
            hospitalClassId: this.guideMeService.getHospitalPlan().hospitalClassId,
            sessionTrackerId: 0,
            gender: this.guideMeService.getGuideMeFormData().gender,
            dateOfBirth: this.guideMeService.getGuideMeFormData().dob,
            isSmoker: smoker,
            employmentStatusId: 0,
            numberOfDependents: this.guideMeService.getGuideMeFormData().dependent,
            hasPremiumWaiver: false,
        } as IEnquiryData;

        return enquiryData;
    }
}
