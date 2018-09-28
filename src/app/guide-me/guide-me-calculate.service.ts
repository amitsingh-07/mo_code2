import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { ILongTermCareNeedsData } from './../shared/interfaces/recommendations.request';
import { GuideMeService } from './guide-me.service';
import { IExistingCoverage } from './insurance-results/existing-coverage-modal/existing-coverage.interface';
import { ILifeProtectionNeedsData } from './life-protection/life-protection';

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
  // tslint:disable-next-line:cognitive-complexity
  getEducationSupportAmt(country: string, course: string, nationality: string): number[] {
    let educationSum: number[];
    const nonmedicine = 'Non-Medicine';
    const medicine = 'Medicine';
    const singapore = 'Singapore';
    const australia = 'Australia';
    const uk = 'United Kingdom';
    const usa = 'USA';
    const singaporean = 'Singaporean';
    const singaporePR = 'Singapore PR';
    const foreigner = 'Foreigner';
    educationSum = [];

    if (country && course && nationality) {
      if (country === singapore && course === nonmedicine && nationality === singaporean) {
        educationSum[0] = 49600;
        educationSum[1] = 48000;
      } else if (country === singapore && course === nonmedicine && nationality === singaporePR) {
        educationSum[0] = 69400;
        educationSum[1] = 48000;
      } else if (country === singapore && course === nonmedicine && nationality === foreigner) {
        educationSum[0] = 106200;
        educationSum[1] = 48000;
      } else if (country === australia && course === nonmedicine) {
        educationSum[0] = 168000;
        educationSum[1] = 120900;
      } else if (country === uk && course === nonmedicine) {
        educationSum[0] = 201600;
        educationSum[1] = 81200;
      } else if (country === usa && course === nonmedicine) {
        educationSum[0] = 283000;
        educationSum[1] = 131600;
      } else if (country === singapore && course === medicine && nationality === singaporean) {
        educationSum[0] = 157500;
        educationSum[1] = 60000;
      } else if (country === singapore && course === medicine && nationality === singaporePR) {
        educationSum[0] = 220600;
        educationSum[1] = 60000;
      } else if (country === singapore && course === medicine && nationality === foreigner) {
        educationSum[0] = 277100;
        educationSum[1] = 60000;
      } else if (country === australia && course === medicine) {
        educationSum[0] = 490600;
        educationSum[1] = 241700;
      } else if (country === uk && course === medicine) {
        educationSum[0] = 469000;
        educationSum[1] = 132100;
      } else if (country === usa && course === medicine) {
        educationSum[0] = 614600;
        educationSum[1] = 263100;
      }
    }
    return educationSum;
  }

  // Dependents
  getProtectionSupportSum(): number {
    let protectionSupportSum: number = null;
    const lifeProtection = this.guideMeService.getLifeProtection().dependents;
    lifeProtection.forEach((dependent) => {
      if (dependent.supportAmount) {
        protectionSupportSum += dependent.supportAmount * 12 * dependent.yearsNeeded;
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
    let exCoverage = 0;
    try {
      if (this.existingCoverage.lifeProtectionCoverage) {
        exCoverage = parseInt(this.existingCoverage.lifeProtectionCoverage + '', 10);
      }
    } catch (e) { }

    const lifeProtectionData = {} as ILifeProtectionNeedsData;
    lifeProtectionData.coverageAmount = this.getLifeProtectionSummary() - exCoverage;
    if (isNaN(lifeProtectionData.coverageAmount) || lifeProtectionData.coverageAmount < 0) {
      lifeProtectionData.coverageAmount = 0;
    }
    lifeProtectionData.coverageDuration = 0;
    lifeProtectionData.isPremiumWaiver = true;
    return lifeProtectionData;
  }

  getCriticalIllnessData() {
    let exCoverage = 0;
    try {
      if (this.existingCoverage.criticalIllnessCoverage) {
        exCoverage = parseInt(this.existingCoverage.criticalIllnessCoverage + '', 10);
      }
    } catch (e) { }
    const ciData = this.guideMeService.getCiAssessment();
    ciData.coverageAmount -= exCoverage;
    if (isNaN(ciData.coverageAmount) || ciData.coverageAmount < 0) {
      ciData.coverageAmount = 0;
    }
    return ciData;
  }

  getOcpData() {
    let exCoverage = 0;
    try {
      if (this.existingCoverage.occupationalDisabilityCoveragePerMonth) {
        exCoverage = parseInt(this.existingCoverage.occupationalDisabilityCoveragePerMonth + '', 10);
      }
    } catch (e) { }

    const ocpData = this.guideMeService.getMyOcpDisability();
    ocpData.coverageAmount -= exCoverage;
    if (isNaN(ocpData.coverageAmount) || ocpData.coverageAmount < 0) {
      ocpData.coverageAmount = 0;
    }
    return ocpData;
  }

  getLtcData() {
    let exCoverage = 0;
    try {
      if (this.existingCoverage.longTermCareCoveragePerMonth) {
        exCoverage = parseInt(this.existingCoverage.longTermCareCoveragePerMonth + '', 10);
      }
    } catch (e) { }

    const ltcData: ILongTermCareNeedsData = this.guideMeService.getLongTermCare();
    ltcData.monthlyPayout = this.guideMeService.selectLongTermCareValues() - exCoverage;
    if (isNaN(ltcData.monthlyPayout) || ltcData.monthlyPayout < 0) {
      ltcData.monthlyPayout = 0;
    }
    return ltcData;
  }
}
