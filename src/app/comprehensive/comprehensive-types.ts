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
export interface IMyLiabilities {
    homeLoanOutstanding: number;
    otherPropertyLoan: number;
    otherLoanAmountOustanding: number;
    carLoan: number;
}
export interface IMySummaryModal {
    setTemplateModal: number,
    title: any,
    titleImage: string,
    dependantModelSel: boolean,
    contentObj: any,
    contentImage: string,
    dependantDetails: Array<SummaryDependantDetails>,
    nondependantDetails: {
                           livingCost : number, livingPercent: number, livingEstimatedCost: number, medicalBill: number, medicalYear: number, medicalCost: number
                         },
    estimatedCost: number,
    termInsurance: number,
    wholeLife: number,   
    liabilitiesEmergency: boolean,
    liabilitiesLiquidCash: number,
    liabilitiesMonthlySpareCash: number
}
export interface SummaryDependantDetails {
    username : string, userage: number, userEstimatedCost: number
}