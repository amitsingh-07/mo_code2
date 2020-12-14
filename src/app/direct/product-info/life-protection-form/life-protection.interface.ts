export interface ILifeProtection {
    gender: string;
    dob: string;
    smoker: string;
    coverageAmt: number;
    premiumWaiver: boolean;
    duration: number;
    ciCoverageAmount: number;
    isEarlyCI: boolean;
}
export interface ILifeProtectionNeedsData {
    coverageAmount: number;
    coverageDuration: number;
    isPremiumWaiver: boolean;
    ciCoverageAmount: number;
    isEarlyCI: boolean;
}