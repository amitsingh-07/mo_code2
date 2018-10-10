export interface IAboutMe {
    name: string;
    nricNumber: string;
    gender: string;
    maritalStatus: string;
    noOfChildren: number;
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
