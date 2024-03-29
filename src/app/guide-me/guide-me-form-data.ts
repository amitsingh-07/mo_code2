import { CriticalIllnessData } from './ci-assessment/ci-assessment';
import { IMyExpenses } from './expenses/expenses.interface';
import { HospitalPlan } from './hospital-plan/hospital-plan';
import { IMyIncome } from './income/income.interface';
import { IExistingCoverage } from './insurance-results/existing-coverage-modal/existing-coverage.interface';
import { IMyLiabilities } from './liabilities/liabilities.interface';
import { IDependent } from './life-protection/life-protection-form/dependent.interface';
import { LongTermCare } from './ltc-assessment/ltc-assessment';
import { IMyAssets } from './my-assets/my-assets.interface';
import { IMyOcpDisability } from './ocp-disability/ocp-disability.interface';
import { ProtectionNeeds } from './protection-needs/protection-needs';

export class GuideMeFormData {
    protectionNeedsPageIndex: number;
    isExistingCoverAdded = false;
    myProfile: number;
    email: string;
    gender: string;
    dob: any;
    customDob: string;
    smoker: string;
    dependent: number;

    protectionNeedData: ProtectionNeeds[];
    lifeProtectionData: {dependents: IDependent[]};

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

    // Exisiting Coverage
    existingCoverageValues: IExistingCoverage;

    // My Assets
    assetsTemmp: IMyAssets;
}
