export interface ISignUp {
    customer: ICustomer;
    enquiryId: number;
    selectedProducts: IPlan[];
    captcha: any;
    sessionId: any;
    journeyType: string;
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
    id: number;
    isSmoker: boolean;
    givenName: string;
    surName: string;
    email: string;
    mobileNumber: string;
    notificationByEmail: boolean;
    countryCode: string;
    notificationByPhone: boolean;
    dateOfBirth: string;
    gender: string;
    acceptMarketEmails: boolean;
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
}

export interface IVerifyCode {
    code: string;
}
