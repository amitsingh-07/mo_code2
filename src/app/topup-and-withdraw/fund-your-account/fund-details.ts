export class FundDetails {
    source: string;
    oneTimeInvestment: number; // Funding
    monthlyInvestment: number; // Funding
    investmentAmount: number; // Topup
    amountToTransfer: number; // Topup
    isAmountExceedCash: boolean;
    portfolioName: string;
    portfolioId: string;
}
