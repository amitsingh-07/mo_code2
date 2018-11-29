import { FormArray, FormGroup } from '@angular/forms';
export class TopUpAndWithdrawFormData {
    // PERSONAL INFO
    investmentype: string;
    oneTimeInvestmentAmount: number;
    MonthlyInvestmentAmount: number;
    portfolio: string;
    Investment: string;
    topupportfolioamount: number;
    topupValues: any;
    fundDetails: any;
    PortfolioValues: any;

    // withdraw
    withdrawType: any;
    withdrawAmount: number;
    withdrawPortfolio: any;
    withdrawMode: string;
    withdrawBank: any;

    userPortfolios: any;
    selectedPortfolioForTopup: any;
    cashAccountBalance: number;
}
