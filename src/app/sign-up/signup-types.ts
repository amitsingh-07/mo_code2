export interface ISignUp {
    customer: ICustomer;
    sessionId: any;
    captcha: string;
    journeyType: string;
    enquiryId: number;
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

export interface IVerifyCode {
    code: string;
}

export interface IResendEmail {
    mobileNumber: string;
    emailAddress: string;
    callbackUrl: string;
    hostedServerName: string;
}

export interface IUpdateMobileNumber {
    customerRef: string;
    mobileNumber: string;
    countryCode: string;
}
