import { LongTermCare } from './ltc-assessment/ltc-assessment';
import { CriticalIllnessData } from './ci-assessment/ci-assessment';
import { IMyExpenses } from './expenses/expenses.interface';
import { HospitalPlan } from './hospital-plan/hospital-plan';
import { IMyIncome } from './income/income.interface';
import { IMyLiabilities } from './liabilities/liabilities.interface';
import { IDependent } from './life-protection/life-protection-form/dependent.interface';
import { IMyAssets } from './my-assets/my-assets.interface';
import { IMyOcpDisability } from './ocp-disability/ocp-disability.interface';
import { ProtectionNeeds } from './protection-needs/protection-needs';

export class GuideMeFormData {
    myProfile: number;
    email: string;
    gender: string;
    dob: string;
    customDob: string;
    smoker: string;
    dependent: number;

    protectionNeedData: ProtectionNeeds[];
    lifeProtectionData: IDependent[];

    // My Income
    income: IMyIncome;

    // My Expenses
    expenses: IMyExpenses;

    // My Assets
    assets: IMyAssets;

    // My Liabilities
    liabilities: IMyLiabilities;

    // Critical Illness Assessment
    criticalIllness: CriticalIllnessData;

    // Occupational Disability
    occupationalDisability: IMyOcpDisability;

    // Long Term Care
    longTermCareData: LongTermCare;

    // Hospital Plan
    hospitalPlanData: HospitalPlan;
}
