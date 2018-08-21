import { FormGroup } from '@angular/forms';

import { IMyExpenses } from './expenses/expenses.interface';
import { IMyIncome } from './income/income.interface';
import { IMyLiabilities } from './liabilities/liabilities.interface';
import { IMyAssets } from './my-assets/my-assets.interface';
import { ProtectionNeeds } from './protection-needs/protection-needs';

export class GuideMeFormData {
    myProfile: number;
    email: string;
    gender: string;
    dob: string;
    customDob: string;
    smoker: string;
    dependent: number;

    protectionNeedData: ProtectionNeeds;
    lifeProtectionData: FormGroup;

    // My Income
    income: IMyIncome;

    // My Expenses
    expenses: IMyExpenses;

    // My Assets
    assets: IMyAssets;

    // My Liabilities
    liabilities: IMyLiabilities;

    // Critical Illness Assessment
    ciCoverageAmt: number;
    annualSalary: number;
    ciMultiplier: number;
    untilRetirementAge: number;

    // Occupational Disability
    coverageAmount: number;
    retirementAge: number;
    selectedEmployee: string;
    sliderValue: number;

    // Long Term Care
    longTermCareData: string;

    // Hospital Plan
    hospitalPlanData: string;
}
