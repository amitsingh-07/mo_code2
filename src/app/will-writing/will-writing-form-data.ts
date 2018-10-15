import { IAboutMe, IChild, IEligibility, IExecTrustee, IGuardian, IPromoCode, ISpouse } from './will-writing-types';

export class WillWritingFormData {

    // eligibility info
    eligibility: IEligibility;
        // about me info
    aboutMe: IAboutMe;

    // spouse info
    spouse: ISpouse;

    // children info
    children: IChild[];

    // guardian info
    guardian: IGuardian;

    // promoCode info;
    promoCode: IPromoCode;

     // Executor and Trustee
     execTrustee: IExecTrustee[];
}
