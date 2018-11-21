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
    formatedDob: Date;
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

export interface IWill {
    willProfile: IwillProfile;
    willProfileMembers: IWillProfileMembers[];
}

export interface IwillProfile {
    customerId: string;
    enquiryId?: number;
    uin: string;
    name: string;
    genderCode: string;
    maritalStatusCode: string;
    noOfChildren: number;
    promoCode?: IPromoCode;
}

export interface IWillProfileMembers {
    uin: string;
    name: string;
    dob?: string;
    relationshipCode: string;
    isFamily: string;
    isBeneficiary: string;
    isGuardian: string;
    isAltGuardian: string;
    isTrusteee: string;
    isAltTrusteee: string;
    distribution: number;
}

export enum IRelationship {
    parent = 'P',
    sibling = 'SBL',
    parent_in_law = 'PIL',
    friend = 'F',
    others = 'O',
    spouse = 'S',
    child = 'C'
}

export enum IMaritalStatus {
    single = 'S',
    married = 'M',
    divorced = 'D',
    widowed = 'W'
}

export enum IGender {
    male = 'M',
    female = 'F'
}
