import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LifeProtectionComponent } from './life-protection/life-protection.component';

import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from '../shared/http/api.service';
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
  // Support Functions:

    // ---Education Support Amounts
  getEducationSupportAmt(course: string, country: string, nationality: string): number[] {
    // tslint:disable-next-line:prefer-const
    let  educationSum: number[];
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

    switch ( course && country && nationality ) {
      case  nonmedicine && singapore && singaporean:
        educationSum[0] = 49600;
        educationSum[1] = 48000;
        break;
      case  nonmedicine && singapore && singaporePR:
        educationSum[0] = 69400;
        educationSum[1] = 48000;
        break;
      case nonmedicine && singapore && foreigner:
        educationSum[0] = 106200;
        educationSum[1] = 48000;
        break;
      case  nonmedicine && australia:
        educationSum[0] = 168000;
        educationSum[1] = 120900;
        break;
      case  nonmedicine && uk:
        educationSum[0] = 201600;
        educationSum[1] = 81200;
        break;
      case  nonmedicine && usa:
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
}
