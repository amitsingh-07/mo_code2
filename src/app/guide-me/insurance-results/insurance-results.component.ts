import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
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

export class InsuranceResultsComponent implements OnInit, IPageComponent {
  pageTitle: string;
  protectionNeeds: any;
  protectionNeedsArray: any;
  criticalIllnessValues: any;

  constructor(
    private router: Router, public headerService: HeaderService,
    private translate: TranslateService, private guideMeService: GuideMeService,
    private guideMeCalculateService: GuideMeCalculateService, public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('INSURANCE_RESULTS.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
    this.criticalIllnessValues = this.guideMeService.getCiAssessment();
    this.getProtectionNeeds();
  }

  ngOnInit() {
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
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.data = data;
    ref.componentInstance.values = this.criticalIllnessValues;
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
          protectionNeed.existingCoverage.value = emittedValue.lifeProtection;
          break;
        case 2:
          protectionNeed.existingCoverage.value = emittedValue.criticalIllness;
          break;
        case 3:
          protectionNeed.existingCoverage.value = emittedValue.occupationalDisability;
          break;
        case 4:
          protectionNeed.existingCoverage.value = emittedValue.hospitalPlan;
          break;
        case 5:
          protectionNeed.existingCoverage.value = emittedValue.longTermCare;
          break;
      }
      return protectionNeed.existingCoverage.value;
    });
  }

  getProtectionNeeds() {
    this.protectionNeedsArray = [];
    const protectionNeeds = this.guideMeService.getProtectionNeeds().protectionNeedData;
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
        resultValue = this.constructLifeProtection(data.protectionTypeId);
        break;
      case 2:
        resultValue = this.constructCriticalIllness(data.protectionTypeId);
        break;
      case 3:
        resultValue = this.constructOccupationalDisability(data.protectionTypeId);
        break;
      case 4:
        resultValue = this.constructHospitalPlan(data.protectionTypeId);
        break;
      case 5:
        resultValue = this.constructLongTermCare(data.protectionTypeId);
        break;
      default:
        resultValue = null;
    }

    return resultValue;

  }

  constructLifeProtection(protectionNeedsId: number): IResultItem {
    const coverage = {
      title: 'Less Existing Coverage',
      value: null
    } as IResultItemEntry;

    return {
      id: protectionNeedsId,
      icon: 'life-protection-icon.svg',
      title: 'Life Protection',
      inputValues: [
        { title: 'Family Member', value: 600 }
      ],
      existingCoverage: coverage,
      total: {
        title: 'Coverage Needed',
        value: 6000
      }
    };
  }

  constructCriticalIllness(protectionNeedsId: number): IResultItem {
    const entries = [] as IResultItemEntry[];
    entries.push({ title: 'Family Member', value: 600 } as IResultItemEntry);
    entries.push({ title: 'Family Member 2', value: 400 } as IResultItemEntry);
    return {
      id: protectionNeedsId,
      icon: 'critical-illness-icon.svg',
      title: 'Critical Illness',
      inputValues: entries,
      existingCoverage: {
        title: 'Less Existing Coverage',
        value: 8000
      },
      yearsNeeded: {
        title: 'Years Needed',
        value: this.criticalIllnessValues.ciMultiplier
      },
      annualIncome: {
        title: 'Annual Income',
        value: this.criticalIllnessValues.annualSalary
      },
      total: {
        title: 'Coverage Needed',
        value: this.criticalIllnessValues.annualSalary * this.criticalIllnessValues.ciMultiplier
      }
    };
  }

  constructOccupationalDisability(protectionNeedsId: number): IResultItem {
    return {
      id: protectionNeedsId,
      icon: 'occupational-disability-icon.svg',
      title: 'Occupational Disability',
      inputValues: [
        { title: 'Family Member', value: 600 }
      ],
      existingCoverage: {
        title: 'Less Existing Coverage',
        value: 8000
      },
      total: {
        title: 'Coverage Needed',
        value: 6000
      }
    };
  }

  constructLongTermCare(protectionNeedsId: number): IResultItem {
    return {
      id: protectionNeedsId,
      icon: 'long-term-care-icon.svg',
      title: 'Long-Term Care',
      inputValues: [
        { title: 'Family Member', value: 600 }
      ],
      existingCoverage: {
        title: 'Less Existing Coverage',
        value: 8000
      },
      total: {
        title: 'Coverage Needed',
        value: 6000
      }
    };
  }

  constructHospitalPlan(protectionNeedsId): IResultItem {
    const hospitalPlanData = this.guideMeService.getHospitalPlan().hospitalPlanData;
    return {
      id: protectionNeedsId,
      icon: 'hospital-plan-icon.svg',
      title: 'Hospital Plan',
      content: 'private',
      inputValues: [
        { title: 'Family Member', value: 600 }
      ],
      existingCoverage: {
        title: 'Less Existing Coverage',
        value: 8000
      },
      total: {
        title: 'Coverage Needed',
        value: 6000
      }
    };
  }
}
