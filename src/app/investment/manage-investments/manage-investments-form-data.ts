export class ManageInvestmentsFormData {
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
  minimumBalanceOfTopup: number;
  topupMode: string;

  // withdraw
  withdrawType: any;
  withdrawAmount: number;
  withdrawPortfolio: any;
  withdrawMode: string;
  withdrawBank: any;
  isRedeemAll: boolean;

  userPortfolios: any;
  selectedPortfolioForTopup: any;
  cashAccountBalance: number;

  // your portfolio
  holdingList;
  assetAllocationValues;

  selectedPortfolio;

  toastMessage: IToastMessage;

}

export interface IToastMessage {
  /* TOAST MESSAGE */
  isShown: boolean;
  desc: string;
  link_label: string;
  link_url: any;
}
