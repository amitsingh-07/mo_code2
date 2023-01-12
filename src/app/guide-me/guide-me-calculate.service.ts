import { Injectable } from '@angular/core';

import { ICriticalIllnessData, ILongTermCareNeedsData, IOccupationalDisabilityData } from './../shared/interfaces/recommendations.request';
import { GUIDE_ME_CONSTANTS } from './guide-me.constants';
import { GuideMeService } from './guide-me.service';
import { IExistingCoverage } from './insurance-results/existing-coverage-modal/existing-coverage.interface';
import { ILifeProtectionNeedsData } from './life-protection/life-protection';

@Injectable({
  providedIn: 'root'
})
export class GuideMeCalculateService {
  existingCoverage: IExistingCoverage;
  constructor(private guideMeService: GuideMeService) {
    this.existingCoverage = this.guideMeService.getExistingCoverageValues();
  }
  // Support Functions:

  // ---Education Support Amounts
  // tslint:disable-next-line:cognitive-complexity
  getEducationSupportAmt(country: string, course: string, nationality: string): number[] {
    let educationSum: number[];
    
    educationSum = [];

    if (country && course && nationality) {
      if (country === GUIDE_ME_CONSTANTS.COUNTRY.SINGAPORE && course === GUIDE_ME_CONSTANTS.EDUCATION.NON_MEDICINE && nationality === GUIDE_ME_CONSTANTS.CITIZENSHIP.SINGAPOREAN) {
        educationSum[0] = 44000;
        educationSum[1] = 48000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.SINGAPORE && course === GUIDE_ME_CONSTANTS.EDUCATION.NON_MEDICINE && nationality === GUIDE_ME_CONSTANTS.CITIZENSHIP.SINGAPORE_PR) {
        educationSum[0] = 64000;
        educationSum[1] = 48000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.SINGAPORE && course === GUIDE_ME_CONSTANTS.EDUCATION.NON_MEDICINE && nationality === GUIDE_ME_CONSTANTS.CITIZENSHIP.FOREIGNER) {
        educationSum[0] = 96000;
        educationSum[1] = 48000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.AUSTRALIA && course === GUIDE_ME_CONSTANTS.EDUCATION.NON_MEDICINE) {
        educationSum[0] = 163600;
        educationSum[1] = 116800;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.UK && course === GUIDE_ME_CONSTANTS.EDUCATION.NON_MEDICINE) {
        educationSum[0] = 210800;
        educationSum[1] = 92000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.USA && course === GUIDE_ME_CONSTANTS.EDUCATION.NON_MEDICINE) {
        educationSum[0] = 252800;
        educationSum[1] = 96400;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.SINGAPORE && course === GUIDE_ME_CONSTANTS.EDUCATION.MEDICINE && nationality === GUIDE_ME_CONSTANTS.CITIZENSHIP.SINGAPOREAN) {
        educationSum[0] = 160000;
        educationSum[1] = 60000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.SINGAPORE && course === GUIDE_ME_CONSTANTS.EDUCATION.MEDICINE && nationality === GUIDE_ME_CONSTANTS.CITIZENSHIP.SINGAPORE_PR) {
        educationSum[0] = 220000;
        educationSum[1] = 60000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.SINGAPORE && course === GUIDE_ME_CONSTANTS.EDUCATION.MEDICINE && nationality === GUIDE_ME_CONSTANTS.CITIZENSHIP.FOREIGNER) {
        educationSum[0] = 335000;
        educationSum[1] = 60000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.AUSTRALIA && course === GUIDE_ME_CONSTANTS.EDUCATION.MEDICINE) {
        educationSum[0] = 489600;
        educationSum[1] = 175200;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.UK && course === GUIDE_ME_CONSTANTS.EDUCATION.MEDICINE) {
        educationSum[0] = 482400;
        educationSum[1] = 138000;
      } else if (country === GUIDE_ME_CONSTANTS.COUNTRY.USA && course === GUIDE_ME_CONSTANTS.EDUCATION.MEDICINE) {
        educationSum[0] = 676800;
        educationSum[1] = 192800;
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

  getDependantExpense(amount: number, percent: any, dependent: any) {
    let percentCal: any;
    let computedVal: any;
    let finalResult = 0;
    let aboutAge;
    if ((dependent.gender === GUIDE_ME_CONSTANTS.GENDER.MALE && dependent.age >= 21) || (dependent.gender === GUIDE_ME_CONSTANTS.GENDER.FEMALE && dependent.age >= 19)) {
      aboutAge = 0;
    } else {
      aboutAge = dependent.gender === GUIDE_ME_CONSTANTS.GENDER.MALE ? GUIDE_ME_CONSTANTS.MALE_AGE_LIMIT : GUIDE_ME_CONSTANTS.FEMALE_AGE_LIMIT;
      aboutAge = aboutAge - dependent.age;
    }
    if (!isNaN(amount) && !isNaN(percent) && !isNaN(aboutAge)) {
      percentCal = percent / 100;
      computedVal = Math.pow(1 + percentCal, aboutAge);
      finalResult = Math.round(computedVal * amount);
    }
    return finalResult;
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
        educationSupportSum += (this.getDependantExpense(eduAmt[0], GUIDE_ME_CONSTANTS.UNIVERSITY_FEES_PERCENTAGE, dependent) + this.getDependantExpense(eduAmt[1], GUIDE_ME_CONSTANTS.LIVING_EXPENSES_PERCENTAGE, dependent));
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
    myAssets = Math.floor(assets.cash) + Math.floor(assets.cpf) + Math.floor(assets.investmentProperties)
      + Math.floor(assets.otherInvestments);
    return myAssets;
  }

  getLifeProtectionSummary(): number {
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
    this.existingCoverage = this.guideMeService.getExistingCoverageValues();
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
    lifeProtectionData.isPremiumWaiver = false;
    return lifeProtectionData;
  }

  getCriticalIllnessData() {
    this.existingCoverage = this.guideMeService.getExistingCoverageValues();
    let exCoverage = 0;
    try {
      if (this.existingCoverage.criticalIllnessCoverage) {
        exCoverage = parseInt(this.existingCoverage.criticalIllnessCoverage + '', 10);
      }
    } catch (e) { }
    const data = this.guideMeService.getCiAssessment();
    const ciData: ICriticalIllnessData = {} as ICriticalIllnessData;
    ciData.annualSalary = data.annualSalary;
    ciData.ciMultiplier = data.ciMultiplier;
    ciData.isEarlyCriticalIllness = data.isEarlyCriticalIllness;
    ciData.coverageAmount = data.coverageAmount - exCoverage;
    ciData.coverageYears = 'Till Age ' + data.coverageYears;
    if (isNaN(ciData.coverageAmount) || ciData.coverageAmount < 0) {
      ciData.coverageAmount = 0;
    }
    return ciData;
  }

  getOcpData() {
    this.existingCoverage = this.guideMeService.getExistingCoverageValues();
    let exCoverage = 0;
    try {
      if (this.existingCoverage.occupationalDisabilityCoveragePerMonth) {
        exCoverage = parseInt(this.existingCoverage.occupationalDisabilityCoveragePerMonth + '', 10);
      }
    } catch (e) { }

    const ocpData = this.guideMeService.getMyOcpDisability();
    ocpData.coverageDuration = 'Till Age ' + ocpData.maxAge;
    ocpData.coverageAmount -= exCoverage;
    if (isNaN(ocpData.coverageAmount) || ocpData.coverageAmount < 0) {
      ocpData.coverageAmount = 0;
    }

    let empStatusId = 0;
    if (ocpData.selectedEmployee) {
      empStatusId = (ocpData.selectedEmployee.indexOf('Salaried') >= 0) ? 1 : 2;
    }
    const ocpRequestData: IOccupationalDisabilityData = {
      percentageCoverage: ocpData.percentageCoverage,
      coverageDuration: ocpData.coverageDuration,
      coverageAmount: ocpData.coverageAmount,
      employmentStatusId: empStatusId,
    } as IOccupationalDisabilityData;
    return ocpRequestData;
  }

  getLtcData() {
    this.existingCoverage = this.guideMeService.getExistingCoverageValues();
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
