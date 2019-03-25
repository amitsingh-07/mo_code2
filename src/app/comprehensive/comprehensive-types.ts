import { IProgressTrackerItem } from './../shared/modal/progress-tracker/progress-tracker.types';

export interface  IComprehensiveDetails {
    baseProfile: IMyProfile;
    dependentsList: IDependantDetail[];
    comprehensiveEnquiry: IComprehensiveEnquiry;
    dependentEducationPreferencesList: IChildEndowment[];
    downOnLuck: HospitalPlan;
    comprehensiveRegularSavingsList: IRegularSavings[];
    comprehensiveInsurancePlanning: IInsurancePlan;
    comprehensiveIncome: IMyEarnings;
}
export interface IComprehensiveEnquiry {
    customerId: number;
    enquiryId: number;
    hasComprehensive: boolean;
    hasDependents: boolean;
    hasEndowments: string;
    hasRegularSavingsPlans: string;
    type: string;
}
export interface IMyProfile {
    id: string;
    firstName: string;
    dateOfBirth: any;
    nation: string;
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
}

export interface IMyLiabilities {
    homeLoanOutstanding: number;
    otherPropertyLoan: number;
    otherLoanAmountOutstanding: number;
    carLoan: number;
}
export class HospitalPlan {
    hospitalClass: string;
    hospitalClassDescription: string;
    hospitalClassId: number;
    isFullRider = false;
    badMoodMonthlyAmount: string;
    enquiryId: number;
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
}

export interface IProgressTrackerWrapper {
    getStarted: IProgressTrackerItem;
    dependants: IProgressTrackerItem;
    finances: IProgressTrackerItem;
    insurancePlans: IProgressTrackerItem;
    retirementPlan: IProgressTrackerItem;
}
export interface IMyAssets {
    cashInBank: number;
    singaporeSavingsBond: number;
    CPFOA: number;
    CPFSA: number;
    CPFMA: number;
    yourHome: number;
    investmentProperties: number;
    otherInvestment: IOtherProperties[];
    otherAssets: number;
}
export interface IOtherProperties {
    investmentType: string;
    others: number;
}

export interface IRegularSavePlan {
    hasRegularSavings: boolean;
    comprehensiveRegularSavingsList: IRegularSavings[];
}
export interface IRegularSavings {
    regularUnitTrust: string;
    regularPaidByCash: string;
    regularPaidByCPF: string;
}
export interface IInsurancePlan {
    haveHospitalPlan: boolean;
    haveCPFDependentsProtectionScheme: string;
    life_protection_amount: number;
    other_life_protection_amount: number;
    criticalIllnessCoverageAmount: number;
    disabilityIncomeCoverageAmount: number;
    haveLongTermElderShield: string;
    longTermElderShieldAmount: number;
}

