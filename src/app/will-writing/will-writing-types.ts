export interface IAboutMe {
    name: string;
    uin: string;
    gender: string;
    maritalStatus: string;
    noOfChildren: number;
}

export interface ISpouse {
    name: string;
    relationship: string;
    uin: string;
}

export interface IChild {
    name: string;
    relationship: string;
    uin: string;
    dob: string;
    pos: number;
}

export interface IGuardian {
    name: string;
    relationship: string;
    uin: string;
    isAlt: boolean;
}

export interface IEligibility {
    singaporean: string;
    assets: string;
    religion: string;
}

export interface IExecTrustee {
    name: string;
    relationship: string;
    uin: string;
    isAlt: boolean;
}

export interface IPromoCode {
    promoCode: string;
}

export interface IBeneficiary {
    name: string;
    relationship: string;
    uin: string;
    selected: boolean;
    distPercentage: number;
    dob?: string;
    pos?: number;
}