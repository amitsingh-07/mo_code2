import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
export class InvestmentCommonFormData {
    accountCreationActions: IAccountCreationActions;
    investmentsSummary: any;
    portfolioName: string;
    initialFundingMethodId: number;
    confirmedFundingMethodId: number;
    srsOperatorBank: any;
    srsAccountNumber: string;
}

export interface IAccountCreationActions {
    accountCreationState: string;
    allowEngagementJourney: boolean;
    portfolioLimitExceeded: boolean;
    showInvestmentAccountCreationForm: boolean;
}
