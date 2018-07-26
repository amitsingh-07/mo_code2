import { IMyExpenses } from './expenses/expenses.interface';
import { IMyIncome } from './income/income.interface';
import { IMyLiabilities } from './liabilities/liabilities.interface';
export class GuideMeFormData implements IMyIncome, IMyExpenses, IMyLiabilities {
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

    // My Assets
    cash: number;
    cpf: number;
    homeProperty: number;
    investmentProperties: number;
    investments: number;
    otherAssets: number;

    // My Liabilities
    propertyLoan: number;
    carLoan: number;
    otherLiabilities: number;
}
