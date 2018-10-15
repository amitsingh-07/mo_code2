export interface IAboutMe {
    name: string;
    nricNumber: string;
    gender: string;
    maritalStatus: string;
    noOfChildren: number;
}

export interface IMyFamily {
    spouse: ISpouse;
    children: IChild[];
}

export interface ISpouse {
    name: string;
    nricNumber: string;
}

export interface IChild {
    name: string;
    nricNumber: string;
    dob: string;
}

export interface IGuardian {
    name: string;
    relationship: string;
    nricNumber: string;
}

export interface IEligibility {
    singaporean: string;
    assets: string;
    religion: string;
}

export interface IExecTrustee {
    name: string;
    relationship: string;
    nricNumber: string;
}

export interface IPromoCode {
    promoCode: string;
}
