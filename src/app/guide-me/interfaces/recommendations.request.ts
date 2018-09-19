import { IMyExpenses } from '../expenses/expenses.interface';
import { IMyIncome } from '../income/income.interface';
import { IMyLiabilities } from '../liabilities/liabilities.interface';
import { ILifeProtectionNeedsData } from '../life-protection/life-protection';
import { IMyAssets } from '../my-assets/my-assets.interface';

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
    existingInsuranceList: IExistingInsurance[];
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
}

export interface IFinancialStatusMapping {
    assets: IMyAssets;
    income: IMyIncome;
    liabilities: IMyLiabilities;
    expenses: IMyExpenses;
}

export interface ILifeProtection {
    gender: string;
    relationship: string;
    age: number;
    dependentProtectionNeeds: {
        dependentId: number;
        educationCourse: string;
        monthlySupportAmount: number;
        countryOfEducation: string;
        nationality: string;
        universityEntryAge: number;
        yearsNeeded: number;
    };
}

export interface ICriticalIllnessData {
    coverageYears: number;
    coverageAmount: number;
    isEarlyCriticalIllness: boolean;
}

export interface IOccupationalDisabilityData {
    percentageCoverage: number;
    coverageDuration: number;
    coverageAmount: number;
    employmentStatusId: number;
    maxAge: number;
}

export interface IHospitalizationNeedsData {
    hospitalClassId: number;
    isFullRider: boolean;
}

export interface ILongTermCareNeedsData {
    careGiverTypeId: number;
    monthlyPayout: number;
}

export interface IExistingInsurance {
    lifeProtectionCoverage: number;
    criticalIllnessCoverage: number;
    occupationalDisabilityCoveragePerMonth: number;
    longTermCareCoveragePerMonth: number;
}
