export interface ISignUp {
    customer: ICustomer;
    sessionId: any;
    captcha: string;
    journeyType: string;
    enquiryId: number;
    callbackUrl: string;
}

export interface IEnquiryUpdate {
    customerId: string;
    enquiryId: number;
    selectedProducts: IPlan[];
}

export interface IPlan {
    typeId: number;
    productName: string;
    premium: IPremium;
}

export interface IPremium {
    premiumAmount: string;
    premiumFrequency: string;
}

export interface ICustomer {
    countryCode: string;
    mobileNumber: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    acceptMarketingNotifications: boolean;
}

export interface IVerifyRequestOTP {
    customerRef: string;
    otp?: number;
    editProfile?: boolean;
}

export interface ISetPassword {
    customerRef: string;
    password: string;
    callbackUrl: string;
    resetType: string;
    resetCode: string;
    selectedProducts: IPlan[];
    journeyType: string;
    sessionId: string;
}

export interface IVerifyCode {
    code: string;
}

export interface ISelectedProducts {
    customerRef: string;
    isNewCustomer: boolean;
    selectedProducts: IPlan[];
}
