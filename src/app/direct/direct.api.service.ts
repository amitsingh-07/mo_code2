import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { formConstants } from '../shared/form-constants';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { HospitalPlan } from './../guide-me/hospital-plan/hospital-plan';
import { ILifeProtectionNeedsData } from './../guide-me/life-protection/life-protection';
import {
    ICriticalIllnessData,
    IEnquiryData,
    IFinancialStatusMapping,
    IHospitalizationNeedsData,
    ILifeProtection,
    ILongTermCareNeedsData,
    IOccupationalDisabilityData,
    IProtectionTypeData,
    IRecommendationRequest,
    IRetirementIncomePlan,
    ISrsApprovedPlanData
} from './../shared/interfaces/recommendations.request';
import { Formatter } from './../shared/utils/formatter.util';
import { PRODUCT_CATEGORY_INDEX } from './direct.constants';
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
        return this.apiService.getDirectSearch(this.constructRecommendationsRequest());
    }

    private constructRecommendationsRequest(): IRecommendationRequest {
        const requestObj = {} as IRecommendationRequest;
        requestObj.sessionId = this.authService.getSessionId();

        requestObj.enquiryProtectionTypeData = this.getProtectionTypeData();
        requestObj.existingInsuranceList = [this.directService.getEmptyExistingCoverage()];

        requestObj.financialStatusMapping = {} as IFinancialStatusMapping;
        requestObj.enquiryData = this.getEnquiryData();
        requestObj.hospitalizationNeeds = this.getHospitalPlanData();
        requestObj.criticalIllnessNeedsData = this.getCriticalIllnessData();
        requestObj.occupationalDisabilityNeeds = this.getOcpData();

        requestObj.longTermCareNeeds = this.getLtcData();
        requestObj.dependentsData = this.getDependentsData();
        requestObj.lifeProtectionNeeds = this.getLifeProtectionData();
        requestObj.retirementIncomePlan = this.getRetirementIncomePlanData();
        requestObj.srsApprovedPlans = this.getSrsApprovedPlanData();

        const category = this.directService.getProductCategory();
        switch (category.id) {
            case PRODUCT_CATEGORY_INDEX.LIFE_PROTECTION:
                requestObj.enquiryData.hasPremiumWaiver = requestObj.lifeProtectionNeeds.isPremiumWaiver;
                break;
            case PRODUCT_CATEGORY_INDEX.CRITICAL_ILLNESS:
                break;
            case PRODUCT_CATEGORY_INDEX.OCCUPATIONAL_DISABILITY:
                break;
            case PRODUCT_CATEGORY_INDEX.HOSPITAL_PLAN:
                break;
            case PRODUCT_CATEGORY_INDEX.LONG_TERM_CARE:
                break;
            case PRODUCT_CATEGORY_INDEX.EDUCATION_FUND:
                break;
            case PRODUCT_CATEGORY_INDEX.RETIREMENT_INCOME:
                break;
            case PRODUCT_CATEGORY_INDEX.SRS_PLANS:
                break;
        }
        return requestObj;
    }

    getProtectionTypeData() {
        const productCategory = this.directService.getProductCategory();
        return [
            {
                protectionTypeId: productCategory.id,
                protectionType: productCategory.prodCatName
            } as IProtectionTypeData
        ];
    }
    getHospitalPlanData() {
        if (this.directService.getProductCategory().id === formConstants.PROTECTION_TYPES.HOSPITAL_PLAN) {
            const hospitalPlan = this.directService.getHospitalPlanForm();
            const hospitalPlanData: IHospitalizationNeedsData = {
                hospitalClassId: hospitalPlan.selectedPlan.hospitalClassId,
                isPartialRider: hospitalPlan.fullOrPartialRider
            };
            return hospitalPlanData;
        } else {
            return {} as HospitalPlan;
        }
    }

    getCriticalIllnessData() {
        const ci = this.directService.getCriticalIllnessForm();
        let earlyCI = false;
        if (ci.earlyCI &&
            ((ci.earlyCI + '').toLowerCase() === 'yes') || (ci.earlyCI + '').toLowerCase() === 'true') {
            earlyCI = true;
        }

        const ciData: ICriticalIllnessData = {
            coverageYears: ci.duration,
            coverageAmount: Formatter.getIntValue(ci.coverageAmt),
            isEarlyCriticalIllness: earlyCI,
        } as ICriticalIllnessData;

        return ciData;
    }

    getOcpData() {
        const ocp = this.directService.getOcpDisabilityForm();
        const ocpData: IOccupationalDisabilityData = {
            percentageCoverage: ocp.percentageCoverage,
            coverageDuration: ocp.duration,
            coverageAmount: ocp.monthlySalary * (ocp.percentageCoverage / 100),
            employmentStatusId: (ocp.employmentType === 'Salaried') ? 1 : 2,
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
            coverageAmount: lifeProtection.coverageAmt ? Formatter.getIntValue(lifeProtection.coverageAmt) : 0,
            coverageDuration: lifeProtection.duration,
            isPremiumWaiver: lifeProtection.premiumWaiver
        };
        return lifeProtectionData;
    }

    getEnquiryData() {
        const userInfo = this.directService.getUserInfo();
        const smoker: boolean = userInfo.smoker && userInfo.smoker.toLowerCase() === 'smoker' ? true : false;
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

    getSrsApprovedPlanData(): ISrsApprovedPlanData {
        const srsPlan = this.directService.getSrsApprovedPlansForm();
        return {
            id: 0,
            singlePremium: srsPlan.singlePremium,
            payoutStartAge: srsPlan.payoutStartAge,
            payoutType: srsPlan.payoutType
        };
    }

    getRetirementIncomePlanData(): IRetirementIncomePlan {
        const incomeForm = this.directService.getRetirementIncomeForm();
        return {
            id: 0,
            retirementIncome: incomeForm.retirementIncome,
            payoutStartAge: incomeForm.payoutAge,
            payoutDuration: incomeForm.payoutDuration,
            payoutFeature: incomeForm.payoutFeature
        };
    }
}
