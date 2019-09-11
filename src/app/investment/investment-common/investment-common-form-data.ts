import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
export class InvestmentCommonFormData {
    accountCreationStatusInfo: IAccountCreationActions;
    investmentsSummary: any;
    portfolioName: string;
}

export interface IAccountCreationActions {
    accountCreationState: string;
    allowEngagementJourney: boolean;
    portfolioLimitExceeded: boolean;
    showInvestmentAccountCreationForm: boolean;
}
