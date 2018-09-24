import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { ILifeProtectionNeedsData } from './../guide-me/life-protection/life-protection';
import {
    ICriticalIllnessData,
    IEnquiryData,
    IFinancialStatusMapping,
    IHospitalizationNeedsData,
    ILifeProtection,
    ILongTermCareNeedsData,
    IOccupationalDisabilityData,
    IRecommendationRequest
} from './../shared/interfaces/recommendations.request';
import { DirectService } from './direct.service';

@Injectable({
    providedIn: 'root'
})
export class DirectApiService {
    constructor(
        private http: HttpClient, private apiService: ApiService,
        private authService: AuthenticationService, private directService: DirectService
    ) {
    }

    getProdCategoryList() {
        return this.apiService.getProductCategory();
    }

    getSearchResults(data) {
        return this.apiService.getDirectSearch(data);
    }

    private constructRecommendationsRequest(): IRecommendationRequest {
        const requestObj = {} as IRecommendationRequest;
        requestObj.sessionId = this.authService.getSessionId();

        requestObj.enquiryProtectionTypeData = [this.directService.getProductCategory()];
        requestObj.existingInsuranceList = [this.directService.getEmptyExistingCoverage()];

        requestObj.financialStatusMapping = {} as IFinancialStatusMapping;

        requestObj.hospitalizationNeeds = this.getHospitalPlanData();
        requestObj.criticalIllnessNeedsData = this.getCriticalIllnessData();
        requestObj.occupationalDisabilityNeeds = this.getOcpData();

        requestObj.longTermCareNeeds = this.getLtcData();
        requestObj.dependentsData = this.getDependentsData();
        requestObj.lifeProtectionNeeds = this.getLifeProtectionData();
        requestObj.enquiryData = this.getEnquiryData();

        return requestObj;
    }

    getHospitalPlanData() {
        const hospitalPlan = this.directService.getHospitalPlanForm();
        const hospitalPlanData: IHospitalizationNeedsData = {
            hospitalClassId: hospitalPlan.selectedPlan.hospitalClassId,
            isFullRider: hospitalPlan.fullOrPartialRider
        };
        return hospitalPlanData;
    }

    getCriticalIllnessData() {
        const ci = this.directService.getCriticalIllnessForm();
        const ciData: ICriticalIllnessData = {
            coverageYears: ci.duration,
            coverageAmount: ci.coverageAmt,
            isEarlyCriticalIllness: ci.earlyCI,
        } as ICriticalIllnessData;

        return ciData;
    }

    getOcpData() {
        const ocp = this.directService.getOcpDisabilityForm();
        const ocpData: IOccupationalDisabilityData = {
            percentageCoverage: ocp.percentageCoverage,
            coverageDuration: ocp.duration,
            coverageAmount: ocp.monthlySalary,
            employmentStatusId: ocp.employmentType,
            maxAge: ocp.duration
        } as IOccupationalDisabilityData;
        return ocpData;
    }

    getLtcData() {
        const lcp = this.directService.getLongTermCareForm();
        const lcpData: ILongTermCareNeedsData = {
            monthlyPayout: lcp.monthlyPayout
        } as ILongTermCareNeedsData;
        return lcpData;
    }

    getDependentsData() {
        const dependent = this.directService.getEducationForm();
        const dependentData: ILifeProtection = {
            gender: dependent.childgender,
            dependentProtectionNeeds: {
                monthlySupportAmount: dependent.contribution,
                universityEntryAge: dependent.selectedunivercityEntryAge
            }
        };
        return [dependentData];
    }

    getLifeProtectionData() {
        const lifeProtection = this.directService.getLifeProtectionForm();
        const lifeProtectionData: ILifeProtectionNeedsData = {
            coverageAmount: lifeProtection.coverageAmt,
            coverageDuration: lifeProtection.duration,
            isPremiumWaiver: lifeProtection.premiumWaiver
        };
        return lifeProtectionData;
    }

    getEnquiryData() {
        const userInfo = this.directService.getUserInfo();
        const smoker: boolean = userInfo.smoker.toLowerCase() === 'smoker' ? true : false;
        const dobObj = userInfo.dob;
        const dob = dobObj.day + '-' + dobObj.month + '-' + dobObj.year;
        const enquiryData = {
            id: 0,
            profileStatusId: 0,
            customerId: 0,
            careGiverId: 0,
            hospitalClassId: 0,
            sessionTrackerId: 0,
            gender: userInfo.gender,
            dateOfBirth: dob,
            isSmoker: smoker,
            employmentStatusId: 0,
            numberOfDependents: 0,
            hasPremiumWaiver: false,
            type: 'insurance-direct'
        } as IEnquiryData;

        return enquiryData;
    }
}
