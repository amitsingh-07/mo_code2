import { FormArray, FormGroup } from '@angular/forms'; 

export class PortfolioFormData {
    //PERSONAL INFO
    dob:string;
    investmentPeriod:number;
    
    //RISK ASSESSMENT
    riskAssessQuest1: number;
    riskAssessQuest2: number;
    riskAssessQuest3: number;
    riskAssessQuest4: number;

    //MY FINANCIALS
    monthlyIncome:number;
    myIncomeSaved:number;
    totalAssets:number;
    totalLoans:number;
    initialDeposit:number;
    monthlyDeposit:number;
    suffEmergencyFund: boolean; 
}
