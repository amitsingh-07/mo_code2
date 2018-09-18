import { ILongTermCare } from './product-info/long-term-care-form/long-term-care.interface';
import { IOcpDisability } from './product-info/ocp-disability-form/ocp-disability-form.interface';
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

    // Long-Term-Care Form
    longTermCare: ILongTermCare;

    // Occupational Disability Form
    ocpDisability: IOcpDisability;
}
