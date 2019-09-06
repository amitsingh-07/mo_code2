import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
export class InvestmentCommonFormData {
    accountCreationStatusInfo: IAccountCreationStatusInfo;
    investmentsSummary: any;
    portfolioName: string;
}

export interface IAccountCreationStatusInfo {
    allowEngagementJourney: boolean;
    portfolioLimitExceeded: boolean;
    showInvestmentAccountCreationForm: boolean;
}
