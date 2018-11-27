import { UserInfo } from './../guide-me/get-started/get-started-form/user-info';
import { ICriticalIllness } from './product-info/critical-illness-form/critical-illness.interface';
import { IEducation } from './product-info/education-form/education.interface';
import { IHospital } from './product-info/hospital-plan-form/hospital-plan.interface';
import { ILifeProtection } from './product-info/life-protection-form/life-protection.interface';
import { ILongTermCare } from './product-info/long-term-care-form/long-term-care.interface';
import { IOcpDisability } from './product-info/ocp-disability-form/ocp-disability-form.interface';
import { IProductCategory } from './product-info/product-category/product-category';
import { IRetirementIncome } from './product-info/retirement-income-form/retirement-income.interface';
import { ISrsApprovedPlans } from './product-info/srs-approved-plans-form/srs-approved-plans-form.interface';

export class DirectFormData {
    minProdInfo: string;
    // prodCategory: IProductCategory;
    gender: string;
    dob: any;
    customDob: string;
    smoker: string;

     // Life Protection && Critical Illness Form
    coverageAmt: number;
    duration: string;
    userInfo: UserInfo;
    prodCategory: IProductCategory;
    productCategoryList: IProductCategory[];

    // Life Protection Form
    lifeProtection: ILifeProtection;

    // Critical Illness Form
    criticalIllness: ICriticalIllness;

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

    premiumFrequencyFilter: string;
}
