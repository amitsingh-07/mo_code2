export interface IUserDetails {
    mobileNumber: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    marketingAcceptance?: boolean;
    consent?: boolean;
}

export interface IRetirementNeeds {
    retirementAge: number;
    monthlyRetirementIncome: number;
    dateOfBirth: string;
    formatedDob?: string;
}

export interface IRetirementAmountAvailable {
    lumpSumAmount: number;
    monthlyAmount: string;
}

export interface IRetirementNeedsGroup {
    retirementNeeds: IRetirementNeeds;
    retirementAmountAvailable: IRetirementAmountAvailable;
}

export interface IRetirementPlanPayload {
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: string;
    receiveMarketingMaterials: boolean,
    contactedByMobile: boolean
    retirementAge: number;
    monthlyRetirementIncome: number;
    dateOfBirth: string;
    lumpSumAmount: number;
    monthlyAmount: string;
    retirementSchemeList: any
}