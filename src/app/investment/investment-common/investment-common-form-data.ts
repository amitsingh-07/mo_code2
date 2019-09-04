import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
export class InvestmentCommonFormData {
    accountCreationStatusInfo: IAccountCreationStatusInfo;
}

export interface IAccountCreationStatusInfo {
    allowEngagementJourney: boolean;
    portfolioLimitExceeded: boolean;
    showInvestmentAccountCreationForm: boolean;
}
