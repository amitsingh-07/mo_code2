export interface ISignUp {
    customer: ICustomer;
    enquiryId: number;
    selectedProducts: IPlan[];
}

export interface IPlan {
    typeId: number;
    productName: string;
}

export interface ICustomer {
    isSmoker: boolean;
    givenName: string;
    surName: string;
    email: string;
    mobileNumber: string;
    notificationByEmail: boolean;
    password: string;
    countryCode: string;
    notificationByPhone: false;
    dateOfBirth: string;
    gender: string;
    crmId: number;
    isIdentityVerified: boolean;
}

export interface IVerifyRequestOTP {
    customerRef: string;
    otp?: number;
}

export interface ISetPassword {
    customerRef: string;
    password: string;
    callbackUrl: string;
    resetType: string;
    resetCode: string;
}
