import { IAboutMe, IBeneficiary, IChild, IEligibility, IExecTrustee, IGuardian, IPromoCode, ISpouse } from './will-writing-types';

export class WillWritingFormData {

    // eligibility info
    eligibility: IEligibility;
    // about me info
    aboutMe: IAboutMe;

    // spouse info
    spouse: ISpouse[];

    // children info
    children: IChild[];

    // guardian info
    guardian: IGuardian[];

    // promoCode info;
    promoCode: IPromoCode;

    // promoCode info;
    enquiryId: number;

    // Executor and Trustee
    execTrustee: IExecTrustee[];

    // beneficiary info
    beneficiary: IBeneficiary[];
}
