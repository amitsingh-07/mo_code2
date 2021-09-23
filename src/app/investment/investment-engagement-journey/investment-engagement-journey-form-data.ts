export class InvestmentEngagementJourneyFormData {
  // PERSONAL INFO
  dob: any;
  investmentPeriod: number;

  // RISK ASSESSMENT
  riskAssessQuest1: number;
  riskAssessQuest2: number;
  riskAssessQuest3: number;
  riskAssessQuest4: number;

  // MY FINANCIALS
  monthlyIncome: number;
  percentageOfSaving: number;
  totalAssets: number;
  totalLiabilities: number;
  initialInvestment: number;
  monthlyInvestment: number;
  suffEmergencyFund: string;
  oneTimeInvestmentChkBox: boolean;
  monthlyInvestmentChkBox: boolean;
  firstTimeUser: boolean;
  portfolioTypeId: number;

  // RISK PROFILE
  riskProfileId: number;
  riskProfileName: string;
  htmlDescription: string;
  alternateRiskProfileId: number;
  alternateRiskProfileType: string;
  fundDetails;
  selectedriskProfileId: number;

  // FUNDING METHOD
  fundingMethod: any;

  // SELECT PORTFOLIO
  selectPortfolioType:any;

  // SET USER SELECTED PORTFOLIO TYPE, JA || PA
  userPortfolioType: any;

  // SET MAJOR SECONDARY HOLDER DATA
  majorSecondaryHolderFormData: any;

  // SET MINOR SECONDARY HOLDER DATA
  minorSecondaryHolderFormData: any;

  // PROMO CODE SETTER
  promoCode: any;
}
