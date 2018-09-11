import { ILongTermCareNeedsData } from './interfaces/recommendations.request';
import { ILifeProtectionNeedsData } from './life-protection/life-protection';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { GuideMeService } from './guide-me.service';
import { IExistingCoverage } from './insurance-results/existing-coverage-modal/existing-coverage.interface';

@Injectable({
  providedIn: 'root'
})
export class GuideMeCalculateService {
  existingCoverage: IExistingCoverage;
  constructor(private http: HttpClient, private apiService: ApiService, private guideMeService: GuideMeService) {
    this.existingCoverage = this.guideMeService.getExistingCoverageValues();
  }
  // Support Functions:

  // ---Education Support Amounts
  getEducationSupportAmt(course: string, country: string, nationality: string): number[] {
    // tslint:disable-next-line:prefer-const
    let educationSum: number[];
    const nonmedicine = 'Non-medicine';
    const medicine = 'Medicine';
    const singapore = 'Singapore';
    const australia = 'Australia';
    const uk = 'United Kingdom';
    const usa = 'USA';
    const singaporean = 'Singaporean';
    const singaporePR = 'PR';
    const foreigner = 'Foreigner';
    educationSum = [];

    switch (course && country && nationality) {
      case nonmedicine && singapore && singaporean:
        educationSum[0] = 49600;
        educationSum[1] = 48000;
        break;
      case nonmedicine && singapore && singaporePR:
        educationSum[0] = 69400;
        educationSum[1] = 48000;
        break;
      case nonmedicine && singapore && foreigner:
        educationSum[0] = 106200;
        educationSum[1] = 48000;
        break;
      case nonmedicine && australia:
        educationSum[0] = 168000;
        educationSum[1] = 120900;
        break;
      case nonmedicine && uk:
        educationSum[0] = 201600;
        educationSum[1] = 81200;
        break;
      case nonmedicine && usa:
        educationSum[0] = 283000;
        educationSum[1] = 131600;
        break;
      case medicine && singapore && singaporean:
        educationSum[0] = 157500;
        educationSum[1] = 60000;
        break;
      case medicine && singaporean && singaporePR:
        educationSum[0] = 220600;
        educationSum[1] = 60000;
        break;
      case medicine && singaporean && foreigner:
        educationSum[0] = 277100;
        educationSum[1] = 60000;
        break;
      case medicine && australia:
        educationSum[0] = 490600;
        educationSum[1] = 241700;
        break;
      case medicine && uk:
        educationSum[0] = 469000;
        educationSum[1] = 132100;
        break;
      case medicine && usa:
        educationSum[0] = 614600;
        educationSum[1] = 263100;
    }
    return educationSum;
  }

  // Dependents
  getProtectionSupportSum(): number {
    let protectionSupportSum: number = null;
    const lifeProtection = this.guideMeService.getLifeProtection().dependents;
    lifeProtection.forEach((dependent) => {
      if (dependent.supportAmountRange) {
        protectionSupportSum += dependent.supportAmountRange * 12 * dependent.yearsNeeded;
      }
    });
    return protectionSupportSum;
  }

  // Education Support
  getEducationSupportSum(): number {
    let educationSupportSum = 0;
    const lifeProtection = this.guideMeService.getLifeProtection().dependents;
    lifeProtection.forEach((dependent) => {
      if (dependent.educationSupport) {
        const country = dependent.eduSupportCountry;
        const course = dependent.eduSupportCourse;
        const nationality = dependent.eduSupportNationality;
        const eduAmt = this.getEducationSupportAmt(country, course, nationality);
        educationSupportSum += (eduAmt[0] + eduAmt[1]);
      }
    });
    return educationSupportSum;
  }

  // Liabilities Amount
  getLiabilitiesSum(): any {
    const liabilities = this.guideMeService.getMyLiabilities();
    let myLiabilities: number;
    // tslint:disable-next-line:radix
    myLiabilities = Math.floor(liabilities.propertyLoan) + Math.floor(liabilities.carLoan) + Math.floor(liabilities.otherLoan);
    return myLiabilities;
  }

  // Current Assets Amount
  getCurrentAssetsSum(): any {
    const assets = this.guideMeService.getMyAssets();
    let myAssets: number;
    // tslint:disable-next-line:radix
    myAssets = Math.floor(assets.cash) + Math.floor(assets.cpf) + Math.floor(assets.homeProperty)
      + Math.floor(assets.investmentProperties) + Math.floor(assets.otherInvestments);
    return myAssets;
  }

  getLifeProtectionSummary(): number {
    const dependents = this.guideMeService.getLifeProtection();

    let forDependentSum: number;
    let educationSum: number;
    let liabilitiesSum: number;
    let currentAssets: number;
    let coverageNeeded: number;

    forDependentSum = this.getProtectionSupportSum();
    educationSum = this.getEducationSupportSum();
    liabilitiesSum = this.getLiabilitiesSum();
    currentAssets = this.getCurrentAssetsSum();
    coverageNeeded = forDependentSum + educationSum + liabilitiesSum - currentAssets;
    return coverageNeeded;
  }

  getLifeProtectionData() {
    const lifeProtectionData = {} as ILifeProtectionNeedsData;
    lifeProtectionData.coverageAmount = this.getLifeProtectionSummary() - this.existingCoverage.lifeProtectionCoverage;
    if (isNaN(lifeProtectionData.coverageAmount) || lifeProtectionData.coverageAmount < 0) {
      lifeProtectionData.coverageAmount = 0;
    }
    lifeProtectionData.coverageDuration = 0;
    lifeProtectionData.isPremiumWaiver = true;
    return lifeProtectionData;
  }

  getCriticalIllnessData() {
    const ciData = this.guideMeService.getCiAssessment();
    ciData.coverageAmount -= this.existingCoverage.criticalIllnessCoverage;
    if (isNaN(ciData.coverageAmount) || ciData.coverageAmount < 0) {
      ciData.coverageAmount = 0;
    }
    return ciData;
  }

  getOcpData() {
    const ocpData = this.guideMeService.getMyOcpDisability();
    ocpData.coverageAmount -= this.existingCoverage.occupationalDisabilityCoveragePerMonth;
    if (isNaN(ocpData.coverageAmount) || ocpData.coverageAmount < 0) {
      ocpData.coverageAmount = 0;
    }
    return ocpData;
  }

  getLtcData() {
    const ltcData: ILongTermCareNeedsData = this.guideMeService.getLongTermCare();
    ltcData.monthlyPayout = this.guideMeService.selectLongTermCareValues() - this.existingCoverage.longTermCareCoveragePerMonth;
    if (isNaN(ltcData.monthlyPayout) || ltcData.monthlyPayout < 0) {
      ltcData.monthlyPayout = 0;
    }
    return ltcData;
  }
}