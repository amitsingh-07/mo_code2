import 'rxjs/add/observable/timer';

import { AfterViewInit, Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { CriticalIllnessData } from '../ci-assessment/ci-assessment';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { IMyIncome } from '../income/income.interface';
import { IMyOcpDisability } from '../ocp-disability/ocp-disability.interface';
import { GuideMeCalculateService } from './../guide-me-calculate.service';
import { GuideMeService } from './../guide-me.service';
import { ExistingCoverageModalComponent } from './existing-coverage-modal/existing-coverage-modal.component';
import { IExistingCoverage } from './existing-coverage-modal/existing-coverage.interface';
import { InsuranceResultModalComponent } from './insurance-result-modal/insurance-result-modal.component';
import { IResultItem, IResultItemEntry, IResultObject } from './insurance-result/insurance-result';

const assetImgPath = './assets/images/';
@Component({
  selector: 'app-insurance-results',
  templateUrl: './insurance-results.component.html',
  styleUrls: ['./insurance-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InsuranceResultsComponent implements OnInit, IPageComponent, AfterViewInit {

  criticalIllnessValues: CriticalIllnessData;
  lifeProtectionValues: any;
  assetValues: any;
  liabilityValues: any;
  monthlySalary: IMyIncome;
  ocpDisabilityValues: IMyOcpDisability;
  pageTitle: string;
  protectionNeeds: any;
  protectionNeedsArray: any;
  animateStaticModal = false;
  hideStaticModal = false;

  constructor(
    private router: Router, public headerService: HeaderService,
    private translate: TranslateService, private guideMeService: GuideMeService,
    private guideMeCalculateService: GuideMeCalculateService, public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('INSURANCE_RESULTS.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
    this.ocpDisabilityValues = this.guideMeService.getMyOcpDisability();
    this.criticalIllnessValues = this.guideMeService.getCiAssessment();
    this.monthlySalary = this.guideMeService.getMyIncome();
    this.liabilityValues = this.guideMeCalculateService.getLiabilitiesSum();
    this.assetValues = this.guideMeCalculateService.getCurrentAssetsSum();
    this.lifeProtectionValues = {
      dependantsValue: this.guideMeCalculateService.getProtectionSupportSum(),
      coverageAmount: this.guideMeCalculateService.getLifeProtectionSummary(),
      educationSupportAmount: this.guideMeCalculateService.getEducationSupportSum()
    };
    this.getProtectionNeeds();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.guideMeService.getInsuranceResultsModalCounter() === 0) {
      this.guideMeService.setInsuranceResultsModalCounter(1);
      setInterval(() => {
        this.animateStaticModal = true;
      }, 2000);

      setInterval(() => {
        this.hideStaticModal = true;
      }, 3000);
    } else {
      this.hideStaticModal = true;
    }
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.protectionNeedsPageIndex--;
  }

  viewDetails(index) {
    switch (index.title) {
      case 'Life Protection':
        this.showDetailsModal(index);
        break;
      case 'Critical Illness':
        this.showDetailsModal(index);
        break;
    }
  }

  showDetailsModal(data: any) {
    const ref = this.modal.open(InsuranceResultModalComponent, {
      centered: true
    });
    ref.componentInstance.data = data;
  }

  openExistingCoverageModal() {
    const ref = this.modal.open(ExistingCoverageModalComponent, {
      centered: true
    });
    ref.componentInstance.data = this.protectionNeedsArray;
    ref.componentInstance.dataOutput.subscribe((emittedValue) => {
      console.log(emittedValue);
      this.addExistingCoverageOutput(emittedValue);
    });
  }

  addExistingCoverageOutput(emittedValue: IExistingCoverage) {
    this.protectionNeedsArray.forEach((protectionNeed: IResultItem, index) => {
      switch (protectionNeed.id) {
        case 1:
          protectionNeed.existingCoverage.value = emittedValue.lifeProtectionCoverage;
          break;
        case 2:
          protectionNeed.existingCoverage.value = emittedValue.criticalIllnessCoverage;
          break;
        case 3:
          protectionNeed.existingCoverage.value = emittedValue.occupationalDisabilityCoveragePerMonth;
          break;
        case 4:
          protectionNeed.existingCoverage.value = emittedValue.hospitalPlanCoverage;
          break;
        case 5:
          protectionNeed.existingCoverage.value = emittedValue.longTermCareCoveragePerMonth;
          break;
      }
      return protectionNeed.existingCoverage.value;
    });
  }

  getProtectionNeeds() {
    this.protectionNeedsArray = [];
    const protectionNeeds = this.guideMeService.getSelectedProtectionNeedsList();
    if (protectionNeeds !== undefined) {
      protectionNeeds.forEach((protectionNeedData) => {
        if (protectionNeedData.status === true) {
          this.protectionNeedsArray.push(this.createProtectionNeedResult(protectionNeedData));
        }
      });
      this.arrangeProtectionNeedsList();
    }
  }

  arrangeProtectionNeedsList() {
    let hospitalPlanItem: IResultItem = null;
    this.protectionNeedsArray.forEach((protectionNeed: IResultItem, index) => {
      if (protectionNeed.id === 4) {
        hospitalPlanItem = this.protectionNeedsArray.splice(index, 1);
        this.protectionNeedsArray = this.protectionNeedsArray.concat(hospitalPlanItem);
      }
    });
  }

  createProtectionNeedResult(data): IResultObject {
    let resultValue: any;
    switch (data.protectionTypeId) {
      case 1:
        resultValue = this.constructLifeProtection(data);
        break;
      case 2:
        resultValue = this.constructCriticalIllness(data);
        break;
      case 3:
        resultValue = this.constructOccupationalDisability(data);
        break;
      case 4:
        resultValue = this.constructHospitalPlan(data);
        break;
      case 5:
        resultValue = this.constructLongTermCare(data);
        break;
      default:
        resultValue = null;
    }

    return resultValue;

  }

  constructLifeProtection(data): IResultItem {
    const coverage = {
      title: 'Less Existing Coverage',
      value: 0
    } as IResultItemEntry;
    const entries = [] as IResultItemEntry[];
    entries.push({ title: 'For Dependants', value: this.lifeProtectionValues.dependantsValue , currency: '$' } as IResultItemEntry);
    entries.push({ title: 'Education Support',
                  value: this.lifeProtectionValues.educationSupportAmount, currency: '$' } as IResultItemEntry);
    entries.push({ title: 'Liabilities', value: this.liabilityValues, currency: '$' } as IResultItemEntry);
    entries.push({ title: 'Less Current Assets', value: this.assetValues, currency: '$' } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: 'life-protection-icon.svg',
      title: 'Life Protection',
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: 'Coverage Needed',
        value: this.lifeProtectionValues.coverageAmount
       }
    };
  }

  constructCriticalIllness(data): IResultItem {
    const coverage = {
      title: 'Less Existing Coverage',
      value: 0
    } as IResultItemEntry;
    const entries = [] as IResultItemEntry[];
    entries.push({ title: 'Years Needed', value: this.criticalIllnessValues.ciMultiplier , type: 'Years'} as IResultItemEntry);
    entries.push({ title: 'Annual Income', value: this.criticalIllnessValues.annualSalary , currency: '$' } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: 'critical-illness-icon.svg',
      title: 'Critical Illness',
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: 'Coverage Needed',
        // tslint:disable-next-line:max-line-length
        value: (this.criticalIllnessValues.annualSalary * this.criticalIllnessValues.ciMultiplier)
      }
    };
  }

  constructOccupationalDisability(data): IResultItem {
    const coverage = {
      title: 'Less Existing Coverage',
      value: 0
    } as IResultItemEntry;
    const entries = [] as IResultItemEntry[];
    entries.push({ title: 'Monthly Salary', value: this.monthlySalary.monthlySalary, currency: '$' } as IResultItemEntry);
    entries.push({ title: '% to Replace', value: this.ocpDisabilityValues.percentageCoverage, type: '%' } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: 'occupational-disability-icon.svg',
      title: 'Occupational Disability',
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: 'Coverage Needed',
        value: this.ocpDisabilityValues.coverageAmount
      }
    };
  }

  constructLongTermCare(data): IResultItem {
    const coverage = {
      title: 'Less Existing Coverage',
      value: 0
    } as IResultItemEntry;
    const entries = [] as IResultItemEntry[];
    entries.push({ title: 'Family Member', value: 600 , currency: '$' } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: 'long-term-care-icon.svg',
      title: 'Long-Term Care',
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: 'Coverage Needed',
        value: 6000
      }
    };
  }

  constructHospitalPlan(data): IResultItem {
    const coverage = {
      title: 'Less Existing Coverage',
      value: 0
    } as IResultItemEntry;
    const entries = [] as IResultItemEntry[];
    entries.push({ title: 'Family Member', value: 600 } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: 'hospital-plan-icon.svg',
      title: 'Hospital Plan',
      content: 'private',
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: 'Coverage Needed',
        value: 6000
      }
    };
  }
  goToNext() {
    this.router.navigate([GUIDE_ME_ROUTE_PATHS.RECOMMENDATIONS]);
  }
}
