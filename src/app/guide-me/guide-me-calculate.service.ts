import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from '../shared/http/api.service';
import { CiAssessment } from './ci-assessment/ci-assessment';
import { IMyExpenses } from './expenses/expenses.interface';
import { FormError } from './get-started/get-started-form/form-error';
import { UserInfo } from './get-started/get-started-form/user-info';
import { GuideMeFormData } from './guide-me-form-data';
import { GUIDE_ME_ROUTE_PATHS } from './guide-me-routes.constants';
import { GuideMeService } from './guide-me.service';
import { HospitalPlan } from './hospital-plan/hospital-plan';
import { IMyIncome } from './income/income.interface';
import { IMyLiabilities } from './liabilities/liabilities.interface';
import { IDependent } from './life-protection/life-protection-form/dependent.interface';
import { LongTermCare } from './ltc-assessment/ltc-assessment';
import { IMyAssets } from './my-assets/my-assets.interface';
import { IMyOcpDisability } from './ocp-disability/ocp-disability.interface';
import { Profile } from './profile/profile';
import { ProtectionNeeds } from './protection-needs/protection-needs';

@Injectable({
  providedIn: 'root'
})
export class GuideMeCalculateService {

  constructor(private http: HttpClient, private apiService: ApiService, private guideMeService: GuideMeService) {}
  // Math Regex Process
  summarizeCost( cost: number): string {
    let sum_string: string;
    sum_string = '$750K';

    if ((cost / 1000) >= 1) {
      // it's in the thousands
      Math.ceil(cost / 1000000);
    }
    return sum_string;
  }
  // Support Functions:

    // ---Education Support Amounts
  getEducationSupportAmt(course: string, country: string): number[] {
    // tslint:disable-next-line:prefer-const
    let  educationSum: number[];
    const nonmedicine = 'non-medicine';
    const medicine = 'medicine';

    switch ( course && country ) {
      case  nonmedicine && 'Singapore':
        educationSum[0] = 49600;
        educationSum[1] = 48000;
        break;
      case  nonmedicine && 'Singapore - PR':
        educationSum[0] = 69400;
        educationSum[1] = 48000;
        break;
      case  nonmedicine && 'Australia':
        educationSum[0] = 168000;
        educationSum[1] = 120900;
        break;
      case  nonmedicine && 'UK':
        educationSum[0] = 201600;
        educationSum[1] = 81200;
        break;
      case  nonmedicine && 'USA':
        educationSum[0] = 283000;
        educationSum[1] = 131600;
        break;
      case medicine && 'Singapore':
        educationSum[0] = 157500;
        educationSum[1] = 60000;
        break;
      case medicine && 'Singapore - PR':
        educationSum[0] = 220600;
        educationSum[1] = 60000;
        break;
      case medicine && 'Australia':
        educationSum[0] = 490600;
        educationSum[1] = 241700;
        break;
      case medicine && 'UK':
        educationSum[0] = 469000;
        educationSum[1] = 132100;
        break;
      case medicine && 'USA':
        educationSum[0] = 614600;
        educationSum[1] = 263100;
    }
    return educationSum;
  }

  // Dependents
  getProtectionSupportSum(): number {
    let protectionSupportSum: number;
    const lifeProtection = this.guideMeService.getLifeProtection().lifeProtectionData;
    lifeProtection.forEach((dependent) => {
        console.log(dependent);
        if (dependent.supportAmountRange) {
          console.log('triggered');
          protectionSupportSum += dependent.supportAmountRange;
        }
    });
    console.log(protectionSupportSum);
    return protectionSupportSum;
  }

  // Education Support
  getEducationSupportSum(): number {
    return 100124;
  }
  // Liabilities Amount
  getLiabilitiesSum(): any {
    const liabilities = this.guideMeService.getMyLiabilities();
    let myLiabilities: number;
    myLiabilities = liabilities.propertyLoan + liabilities.carLoan + liabilities.otherLiabilities; 
    return myLiabilities;
  }

  // Current Assets Amount
  getCurrentAssetsSum(): any {
    const assets = this.guideMeService.getMyAssets();
    let myAssets: number;
    myAssets = assets.cash + assets.cpf + assets.homeProperty + assets.investmentProperties + assets.investments;
    return myAssets;
  }

  getCriticalIllness() {
    const criticalIllnessFormValues = this.guideMeService.getCiAssessment();
    const criticalIllnessValues = {
      annualSalary : criticalIllnessFormValues.annualSalary,
      yearsNeeded: criticalIllnessFormValues.ciMultiplier,
      coverageAmount: criticalIllnessFormValues.ciCoverageAmt
    };
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
}
