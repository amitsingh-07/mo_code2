export class FundingInstructions {
  source: string;
  oneTimeInvestment: number; // Funding
  monthlyInvestment: number; // Funding
  investmentAmount: number; // Topup
  isAmountExceedCash: boolean;
  portfolioName: string;
  portfolioId: string;
}
