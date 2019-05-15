import { IProgressTrackerItem } from '../shared/modal/progress-tracker/progress-tracker.types';

export interface IComprehensiveDetails {
    baseProfile: IMyProfile;
    dependentsList: IDependantDetail[];
    comprehensiveEnquiry: IComprehensiveEnquiry;
    dependentEducationPreferencesList: IChildEndowment[];
    comprehensiveDownOnLuck: HospitalPlan;
    comprehensiveRegularSavingsList: IRegularSavings[];
    comprehensiveLiabilities: IMyLiabilities;
    comprehensiveIncome: IMyEarnings;
    comprehensiveSpending: IMySpendings;
    comprehensiveAssets: IMyAssets;
    comprehensiveInsurancePlanning: IInsurancePlan;
    comprehensiveRetirementPlanning: IRetirementPlan;
    comprehensiveViewMode?: boolean;
}
export interface IComprehensiveEnquiry {
    customerId: number;
    enquiryId: number;
    hasComprehensive: boolean;
    hasDependents: boolean;
    hasEndowments: string;
    hasRegularSavingsPlans: boolean;
    type: string;
    isValidatedPromoCode: boolean;
    promoCodeValidated?: boolean;
    reportStatus: string;
    stepCompleted: number;
}
export interface IPromoCode {
    comprehensivePromoCodeToken: string;
    enquiryId: number;
}
export interface IMyProfile {
    id: string;
    firstName: string;
    dateOfBirth: any;
    nationalityStatus: string;
    gender: string;
    ngbDob: any;
}

export interface IDependantDetail {
    id: number;
    name: string;
    relationship: string;
    gender: string;
    dateOfBirth: string;
    nation: string;
    enquiryId: number;
    isInsuranceNeeded: boolean;
}

export interface IChildEndowment {
    id: number;
    dependentId: number;
    name: string;
    enquiryId: number;
    location: string;
    educationCourse: string;
    endowmentMaturityAmount: number;
    endowmentMaturityYears: number;
    dateOfBirth: string;
    age: number;
    gender: string;
    preferenceSelection: boolean;
    nation?: string;
}

export interface IMyLiabilities {
    enquiryId: number;
    homeLoanOutstandingAmount: number;
    otherPropertyLoanOutstandingAmount: number;
    otherLoanOutstandingAmount: number;
    carLoansAmount: number;
    totalAnnualLiabilities: number;
}
export class HospitalPlan {
    hospitalClass: string;
    hospitalPlanName: string;
    hospitalClassDescription: string;
    hospitalClassId: number;
    hospitalPlanId: number;
    isFullRider = false;
    badMoodMonthlyAmount: number;
    enquiryId: number;
}
export interface IHospitalPlanList {
    id: number;
    hospitalClass: string;
    hospitalClassDescription: string;
    hospitalClassId: number;
    hospitalPlanId: number;
}
export interface IMySummaryModal {
    setTemplateModal: number;
    title?: any;
    dependantModelSel?: boolean;
    contentObj: any;
    contentImage?: string;
    dependantDetails?: ISummaryDependantDetails[];
    nonDependantDetails?: {
        livingCost: number;
        livingPercent: number;
        livingEstimatedCost: number;
        medicalBill: number;
        medicalYear: number;
        medicalCost: number;
    };
    estimatedCost?: number;
    termInsurance?: number;
    wholeLife?: number;
    liabilitiesEmergency?: boolean;
    liabilitiesLiquidCash?: number;
    liabilitiesMonthlySpareCash?: number;
    nextPageURL: any;
    routerEnabled?: boolean;
}

export interface ISummaryDependantDetails {
    userName: string;
    userAge: number;
    userEstimatedCost: number;
}

export interface IMyEarnings {
    enquiryId: number;
    employmentType: string;
    monthlySalary: number;
    monthlyRentalIncome: number;
    otherMonthlyWorkIncome: number;
    otherMonthlyIncome: number;
    annualBonus: number;
    annualDividends: number;
    otherAnnualIncome: number;
    totalAnnualIncomeBucket: number;
}

export interface IMySpendings {
    enquiryId: number;
    monthlyLivingExpenses: number;
    adHocExpenses: number;
    HLMortgagePaymentUsingCPF: number;
    HLMortgagePaymentUsingCash: number;
    HLtypeOfHome: string;
    homeLoanPayOffUntil: number;
    mortgagePaymentUsingCPF: number;
    mortgagePaymentUsingCash: number;
    mortgageTypeOfHome: string;
    mortgagePayOffUntil: number;
    carLoanPayment: number;
    otherLoanPayment: number;
    otherLoanPayoffUntil: number;
    totalAnnualExpenses: number;

}

export interface IProgressTrackerWrapper {
    getStarted: IProgressTrackerItem;
    dependants: IProgressTrackerItem;
    finances: IProgressTrackerItem;
    insurancePlans: IProgressTrackerItem;
    retirementPlan: IProgressTrackerItem;
}
export interface IMyAssets {
    enquiryId: number;
    cashInBank: number;
    savingsBonds: number;
    cpfOrdinaryAccount: number;
    cpfSpecialAccount: number;
    cpfMediSaveAccount: number;
    homeMarketValue: number;
    investmentPropertiesValue: number;
    assetsInvestmentSet: IOtherProperties[];
    otherAssetsValue: number;
    totalAnnualAssets: number;
    source: string;
}
export interface IOtherProperties {
    enquiryId: number;
    typeOfInvestment: string;
    investmentAmount: number;
}
export interface IRegularSavings {
    regularUnitTrust: string;
    regularPaidByCash: string;
    regularPaidByCPF: string;
    enquiryId: number;
}
export interface IInsurancePlan {
    enquiryId: number;
    haveHospitalPlan: boolean;
    haveCPFDependentsProtectionScheme: number;
    haveHDBHomeProtectionScheme: number;
    homeProtectionCoverageAmount: number;
    lifeProtectionAmount: number;
    otherLifeProtectionCoverageAmount: number;
    criticalIllnessCoverageAmount: number;
    disabilityIncomeCoverageAmount: number;
    haveLongTermElderShield: number;
    longTermElderShieldAmount: number;
}
export interface IRetirementPlan {
    enquiryId: number;
    retirementAge: string;
}
