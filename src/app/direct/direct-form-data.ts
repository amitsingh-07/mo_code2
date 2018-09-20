import { IEducation } from './product-info/education-form/education.interface';
import { IHospital } from './product-info/hospital-plan-form/hospital-plan.interface';
import { ILongTermCare } from './product-info/long-term-care-form/long-term-care.interface';
import { IOcpDisability } from './product-info/ocp-disability-form/ocp-disability-form.interface';
import { IProductCategory } from './product-info/product-category/product-category';
import { IRetirementIncome } from './product-info/retirement-income-form/retirement-income.interface';
import { ISrsApprovedPlans } from './product-info/srs-approved-plans-form/srs-approved-plans-form.interface';

export class DirectFormData {
    prodCategory: IProductCategory;
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

    // Education form
    education: IEducation;

    // Hospital form
    hospital: IHospital;

    selectedPlans: any;

    // SRS Approved Plans Form
    srsApprovedPlans: ISrsApprovedPlans;
}
