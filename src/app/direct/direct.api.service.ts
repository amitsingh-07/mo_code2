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
        //return this.apiService.getDirectSearch(this.constructRecommendationsRequest());
        const data = {
            "sessionId": "undefined",
            "criticalIllnessNeedsData": {
                "coverageAmount": 300000,
                "coverageYears": 10,
                "isEarlyCriticalIllness": false,
                "annualSalary": 0,
                "ciMultiplier": 0
            },
            "enquiryProtectionTypeData": [
                {
                    "status": true,
                    "protectionTypeId": 2,
                    "protectionType": "Critical Illness",
                    "protectionDesc": "E.g. Cancer, Heart Attack, Stroke"
                }
            ],
            "existingInsuranceList": [
                {
                    "criticalIllnessCoverage": 0,
                    "lifeProtectionCoverage": 0,
                    "longTermCareCoveragePerMonth": 0,
                    "occupationalDisabilityCoveragePerMonth": 0
                }
            ],
            "financialStatusMapping": {
                "assets": {
                    "cash": "999999",
                    "cpf": "888888",
                    "homeProperty": "6666666",
                    "investmentProperties": "55555555",
                    "otherInvestments": "77777777",
                    "otherAssets": "777777"
                },
                "income": {
                    "monthlySalary": "80000",
                    "annualBonus": "900000",
                    "otherIncome": "8999"
                },
                "liabilities": {
                    "propertyLoan": "989898",
                    "carLoan": "98989",
                    "otherLoan": "9898"
                },
                "expenses": {
                    "monthlyInstallments": "89898",
                    "otherExpenses": "6767"
                }
            },
            "hospitalizationNeeds": {
                "hospitalClass": "",
                "hospitalClassDescription": "",
                "hospitalClassId": 0,
                "isFullRider": false
            },
            "occupationalDisabilityNeeds": {
                "coverageAmount": 0,
                "percentageCoverage": 0,
                "maxAge": 0,
                "selectedEmployee": ""
            },
            "longTermCareNeeds": {
                "careGiverType": "",
                "careGiverDescription": "",
                "careGiverTypeId": 0,
                "monthlyPayout": 0
            },
            "dependentsData": [
                {
                    "gender": "Male",
                    "relationship": "Spouse",
                    "age": 1,
                    "dependentProtectionNeeds": {
                        "dependentId": 0,
                        "educationCourse": "Medicine",
                        "monthlySupportAmount": 72,
                        "countryOfEducation": "Singapore",
                        "nationality": "Singaporean",
                        "universityEntryAge": 0,
                        "yearsNeeded": 0
                    }
                }
            ],
            "lifeProtectionNeeds": {
                "coverageAmount": 109070,
                "coverageDuration": 65,
                "isPremiumWaiver": true
            },
            "enquiryData": {
                "id": 0,
                "profileStatusId": "1",
                "customerId": 0,
                "careGiverId": 4,
                "hospitalClassId": 5,
                "sessionTrackerId": 1,
                "gender": "female",
                "dateOfBirth": "22-8-1978",
                "isSmoker": false,
                "employmentStatusId": 0,
                "numberOfDependents": 2,
                "hasPremiumWaiver": false,
                "type": "insurance-guided"
            },
            "srsApprovedPlans": {
                "id": 0,
                "singlePremium": 0,
                "payoutStartAge": 0,
                "payoutType": ""
            },
            "retirementIncomePlan": {
                "id": 0,
                "retirementIncome": 0,
                "payoutStartAge": 0,
                "payoutDuration": ""
            }
        };
        return this.apiService.getDirectSearch(data);
    }

    private constructRecommendationsRequest(): IRecommendationRequest {
        const requestObj = {} as IRecommendationRequest;
        requestObj.sessionId = this.authService.getSessionId();

        requestObj.enquiryProtectionTypeData = this.getProtectionTypeData();
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
                isFullRider: hospitalPlan.fullOrPartialRider
            };
            return hospitalPlanData;
        } else {
            return {} as HospitalPlan;
        }
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
}
