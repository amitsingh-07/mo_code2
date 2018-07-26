import { IMyIncome } from './income/income.interface';
export class GuideMeFormData implements IMyIncome {
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

}
