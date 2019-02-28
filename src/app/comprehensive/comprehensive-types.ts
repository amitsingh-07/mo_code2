export interface IMyProfile {
    id: string;
    firstName: string;
    lastName: string;
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
export interface IChildPlan {
    dependentId: number;
    enquiryId: number;
    location: string;
    educationCourse: string;
    endowmentMaturityAmount: string;
    endowmentMaturityYears: string;
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
    title: any;
    titleImage: string;
    dependantModelSel: boolean;
    contentObj: any;
    contentImage: string;
    dependantDetails: ISummaryDependantDetails[];
    nonDependantDetails: {
        livingCost: number,
        livingPercent: number, livingEstimatedCost: number, medicalBill: number, medicalYear: number, medicalCost: number
    };
    estimatedCost: number;
    termInsurance: number;
    wholeLife: number;
    liabilitiesEmergency: boolean;
    liabilitiesLiquidCash: number;
    liabilitiesMonthlySpareCash: number;
}

export interface ISummaryDependantDetails {
    userName: string; userAge: number; userEstimatedCost: number;
}
