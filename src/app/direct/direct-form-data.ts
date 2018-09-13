import { ILongTermCare } from './product-info/long-term-care-form/long-term-care.interface';
import { IRetirementIncome } from './product-info/retirement-income-form/retirement-income.interface';
export class DirectFormData {
    prodCategory: string;
    gender: string;
    dob: any;
    customDob: string;
    smoker: string;

     // Life Protection && Critical Illness Form
    coverageAmt: number;
    duration: string;

    // Life Protection Form
    premiumWaiver: boolean;

    // Critical Illness Form
    earlyCI: boolean;

    // Retirement Income Form
    retirementIncome: IRetirementIncome;

    longTermCare: ILongTermCare;
}
