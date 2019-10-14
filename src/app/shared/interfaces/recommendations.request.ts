import { IPlan } from './../../sign-up/signup-types';
import { IMyExpenses } from './../../guide-me/expenses/expenses.interface';
import { IMyIncome } from './../../guide-me/income/income.interface';
import { IExistingCoverage } from './../../guide-me/insurance-results/existing-coverage-modal/existing-coverage.interface';
import { IMyLiabilities } from './../../guide-me/liabilities/liabilities.interface';
import { ILifeProtectionNeedsData } from './../../guide-me/life-protection/life-protection';
import { IMyAssets } from './../../guide-me/my-assets/my-assets.interface';

export interface IRecommendationRequest {
    enquiryData: IEnquiryData;
    enquiryProtectionTypeData: IProtectionTypeData[];
    financialStatusMapping: IFinancialStatusMapping;
    dependentsData: ILifeProtection[];
    criticalIllnessNeedsData: ICriticalIllnessData;
    occupationalDisabilityNeeds: IOccupationalDisabilityData;
    hospitalizationNeeds: IHospitalizationNeedsData;
    longTermCareNeeds: ILongTermCareNeedsData;
    lifeProtectionNeeds: ILifeProtectionNeedsData;
    existingInsuranceList: IExistingCoverage[];
    srsApprovedPlans: ISrsApprovedPlanData;
    retirementIncomePlan: IRetirementIncomePlan;
    sessionId: string;
}

export interface IEnquiryData {
    id: number;
    profileStatusId: number;
    customerId: number;
    careGiverId: number;
    hospitalClassId: number;
    sessionTrackerId: number;
    gender: string;
    dateOfBirth: string;
    isSmoker: boolean;
    employmentStatusId: number;
    numberOfDependents: number;
    hasPremiumWaiver: boolean;
    type: string;
}

export interface IProtectionTypeData {
    protectionTypeId: number;
    protectionType?: string;
    protectionDesc?: string;
    status?: boolean;
}

export interface IFinancialStatusMapping {
    assets: IMyAssets;
    income: IMyIncome;
    liabilities: IMyLiabilities;
    expenses: IMyExpenses;
}

export interface ILifeProtection {
    gender: string;
    relationship?: string;
    age?: number;
    dependentProtectionNeeds: {
        dependentId?: number;
        educationCourse?: string;
        monthlySupportAmount: number;
        countryOfEducation?: string;
        nationality?: string;
        universityEntryAge: number;
        yearsNeeded?: number;
    };
}

export interface ICriticalIllnessData {
    coverageYears: string;
    coverageAmount: number;
    isEarlyCriticalIllness: boolean;
    annualSalary?: number;
    ciMultiplier?: number;
}

export interface IOccupationalDisabilityData {
    percentageCoverage: number;
    coverageDuration: string;
    coverageAmount: number;
    employmentStatusId: number;
    maxAge: number;
}

export interface IHospitalizationNeedsData {
    hospitalClassId: number;
    isPartialRider: boolean;
}

export interface ILongTermCareNeedsData {
    careGiverTypeId?: number;
    monthlyPayout: number;
}

export interface ISrsApprovedPlanData {
    id: number;
    singlePremium: number;
    payoutStartAge: number;
    payoutType: string;
}

export interface IRetirementIncomePlan {
    id: number;
    retirementIncome: number;
    payoutStartAge: number;
    payoutDuration: string;
    payoutFeature: string;
}

export interface IEnquiryByEmail {
    selectedProducts: IPlan[];
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    acceptMarketingEmails: boolean;
    contactViaMobile: boolean;
    validateCaptchaBean: {
        captcha: string;
        sessionId: string;
    };
    enquiryId: number;
}
