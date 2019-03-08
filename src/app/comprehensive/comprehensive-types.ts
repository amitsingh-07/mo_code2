export interface IMyProfile {
    id: string;
    firstName: string;
    dateOfBirth: any;
    nation: string;
    gender: string;
    ngbDob: any;
}
export interface IMyDependant {
    id: number;
    name: string;
    relationship: string;
    gender: string;
    dateOfBirth: string;
    nation: string;
    enquiryId: number;

}

export interface IDependant {
  name: string;
  id: number;
  dependantSelection: boolean;
}
export interface IEPreference {
    id: number;
    age: number;
    location: string;
    educationCourse: string;

}
export interface IEducationPlan {
    hasEndowments: string;
    endowmentDetailsList: IChildEndowment[];
}
export interface IChildEndowment {
    id: number;
    dependentId: number;
    name: string;
    enquiryId: number;
    location: string;
    educationCourse: string;
    endowmentMaturityAmount: string;
    endowmentMaturityYears: string;
    dateOfBirth: string;

}

export interface IMyLiabilities {
    homeLoanOutstanding: number;
    otherPropertyLoan: number;
    otherLoanAmountOustanding: number;
    carLoan: number;
}
export class HospitalPlan {
    hospitalClass: string;
    hospitalClassDescription: string;
    hospitalClassId: number;
    isFullRider = false;
}

export interface IMySummaryModal {
    setTemplateModal: number;
    title?: any;
    dependantModelSel?: boolean;
    contentObj: any;
    contentImage?: string;
    dependantDetails?: ISummaryDependantDetails[];
    nonDependantDetails?: {
        livingCost: number,
        livingPercent: number, livingEstimatedCost: number, medicalBill: number, medicalYear: number, medicalCost: number
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
    userName: string; userAge: number; userEstimatedCost: number;
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
