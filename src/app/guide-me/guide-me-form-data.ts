import { IMyExpenses } from './expenses/expenses.interface';
import { IMyIncome } from './income/income.interface';
export class GuideMeFormData implements IMyIncome, IMyExpenses {
    myProfile: number;
    email: string;
    gender: string;
    dob: string;
    customDob: string;
    smoker: string;
    dependent: string;
    protectionNeedData: string;

    // My Income
    monthlySalary: number;
    annualBonus: number;
    otherIncome: number;

    // My Expenses
    monthlyInstallment: number;
    otherExpenses: number;
}
