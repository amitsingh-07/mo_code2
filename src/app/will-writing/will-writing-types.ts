export interface IAboutMe {
    name: string;
    nric: string;
    gender: string;
    maritalStatus: string;
    noOfChildren: number;
}

export interface ISpouse {
    name: string;
    nric: string;
}

export interface IChild {
    name: string;
    nric: string;
    dob: string;
}

export interface IGuardian {
    name: string;
    relationship: string;
    nric: string;
}

export interface IEligibility {
    singaporean: string;
    assets: string;
    religion: string;
}
