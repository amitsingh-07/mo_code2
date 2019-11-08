export interface IUserDetails {
    mobileNumber: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    marketingAcceptance?: boolean;
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
    basicCustomerDetails: IUserDetails;
    retirementNeeds: IRetirementNeeds;
    retirementAmountAvailable: IRetirementAmountAvailable;
    retirementSchemeList: any
}


