import 'rxjs/add/observable/timer';

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { GoogleAnalyticsService } from '../../shared/analytics/google-analytics.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { Formatter } from '../../shared/utils/formatter.util';
import { CriticalIllnessData } from '../ci-assessment/ci-assessment';
import { GuideMeCalculateService } from '../guide-me-calculate.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { GuideMeService } from '../guide-me.service';
import { IMyIncome } from '../income/income.interface';
import { IMyOcpDisability } from '../ocp-disability/ocp-disability.interface';
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

export class InsuranceResultsComponent implements OnInit, IPageComponent, AfterViewInit, OnDestroy {

  existingCoverageValues: IExistingCoverage;
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
  planData;
  lblPerMonth;

  constructor(
    private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, public guideMeService: GuideMeService,
    private guideMeCalculateService: GuideMeCalculateService, public modal: NgbModal,
    private googleAnalyticsService: GoogleAnalyticsService, private cdr: ChangeDetectorRef) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('INSURANCE_RESULTS.TITLE');
      this.planData = this.translate.instant('INSURANCE_RESULTS.PLANS');
      this.lblPerMonth = this.translate.instant('SUFFIX.PER_MONTH');
      this.setPageTitle(this.pageTitle, null, false);
      setTimeout(() => {
        this.getProtectionNeeds();
      }, 500);
    });
    this.ocpDisabilityValues = this.guideMeService.getMyOcpDisability();
    this.criticalIllnessValues = this.guideMeService.getCiAssessment();
    this.monthlySalary = this.guideMeService.getMyIncome();
    this.liabilityValues = this.guideMeCalculateService.getLiabilitiesSum();
    this.assetValues = this.guideMeCalculateService.getCurrentAssetsSum();
    this.existingCoverageValues = this.guideMeService.getExistingCoverageValues();

    const eduSupportAmount = this.guideMeCalculateService.getEducationSupportSum();
    const lifeProtectionAmount = this.guideMeCalculateService.getProtectionSupportSum();
    this.lifeProtectionValues = {
      dependantsValue: lifeProtectionAmount ? lifeProtectionAmount : 0,
      coverageAmount: this.guideMeCalculateService.getLifeProtectionSummary(),
      educationSupportAmount: eduSupportAmount ? eduSupportAmount : 0
    };
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
  }

  ngAfterViewInit() {
    if (this.guideMeService.getInsuranceResultsModalCounter() === 0) {
      this.guideMeService.setInsuranceResultsModalCounter(1);
      setInterval(() => {
        this.animateStaticModal = true;
      }, 2000);

      setInterval(() => {
        this.hideStaticModal = true;
        this.detectChanges();
      }, 3000);
    } else {
      this.hideStaticModal = true;
      this.detectChanges();
    }
  }

  detectChanges() {
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.navbarService.setPageTitle(title, null, helpIcon);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.guideMeService.decrementProtectionNeedsIndex();
  }

  ngOnDestroy() {
    this.cdr.detach();
  }

  viewDetails(index) {
    switch (index.title) {
      case this.planData.LIFE_PROTECTION.TITLE:
        this.showDetailsModal(index);
        break;
      case this.planData.CRITICAL_ILLNESS.TITLE:
        this.showDetailsModal(index);
        break;
      case this.planData.OCCUPATIONAL_DISABILITY.TITLE:
        this.showDetailsModal(index);
        break;
      case this.planData.LONG_TERM_CARE.TITLE:
        this.showDetailsModal(index);
        break;
    }
  }

  showDetailsModal(data: any) {
    const ref = this.modal.open(InsuranceResultModalComponent, {
      centered: true
    });
    ref.componentInstance.data = data;
    this.dismissPopup(ref);
  }

  openExistingCoverageModal() {
    const ref = this.modal.open(ExistingCoverageModalComponent, {
      centered: true,
      windowClass: 'guided-existing-coverage'
    });
    ref.componentInstance.data = this.protectionNeedsArray;
    ref.componentInstance.dataOutput.subscribe((emittedValue) => {
      this.addExistingCoverageOutput(emittedValue);
    });
    this.dismissPopup(ref);
  }

  dismissPopup(ref: NgbModalRef) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ref.close();
      }
    });
  }

  addExistingCoverageOutput(emittedValue: IExistingCoverage) {
    this.existingCoverageValues = this.guideMeService.getExistingCoverageValues();
    this.protectionNeedsArray.forEach((protectionNeed: IResultItem, index) => {
      if (!protectionNeed.existingCoverage) {
        protectionNeed.existingCoverage = {
          title: this.planData.LESS_EXISTING_COVERAGE,
          value: 0
        } as IResultItemEntry;
      }
      switch (protectionNeed.id) {
        case 1:
          protectionNeed.existingCoverage.value = Formatter.getIntValue(emittedValue.lifeProtectionCoverage);
          break;
        case 2:
          protectionNeed.existingCoverage.value = Formatter.getIntValue(emittedValue.criticalIllnessCoverage);
          break;
        case 3:
          protectionNeed.existingCoverage.value = Formatter.getIntValue(emittedValue.occupationalDisabilityCoveragePerMonth);
          break;
        case 4:
          protectionNeed.existingCoverage.value = emittedValue.selectedHospitalPlan;
          break;
        case 5:
          protectionNeed.existingCoverage.value = Formatter.getIntValue(emittedValue.longTermCareCoveragePerMonth);
          break;
      }
      return protectionNeed.existingCoverage.value;
    });

    this.getProtectionNeeds();
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
    let coverage;
    if (this.existingCoverageValues) {
      coverage = {
        title: this.planData.LESS_EXISTING_COVERAGE,
        value: this.existingCoverageValues.lifeProtectionCoverage ? this.existingCoverageValues.lifeProtectionCoverage : 0
      } as IResultItemEntry;
    }
    const entries = [] as IResultItemEntry[];
    entries.push({
      title: this.planData.LIFE_PROTECTION.FOR_DEPENDENTS,
      value: this.lifeProtectionValues.dependantsValue, currency: this.planData.DOLLER
    } as IResultItemEntry);
    entries.push({
      title: this.planData.LIFE_PROTECTION.EDUCATION_SUPPORT,
      value: this.lifeProtectionValues.educationSupportAmount, currency: this.planData.DOLLER
    } as IResultItemEntry);
    entries.push({
      title: this.planData.LIFE_PROTECTION.LIABILITIES,
      value: this.liabilityValues, currency: this.planData.DOLLER
    } as IResultItemEntry);
    entries.push({
      title: this.planData.LIFE_PROTECTION.LESS_CURRENT_ASSETS,
      value: this.assetValues, currency: this.planData.DOLLER
    } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: this.planData.LIFE_PROTECTION.ICON,
      title: this.planData.LIFE_PROTECTION.TITLE,
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: this.planData.COVARAGE_NEEDED,
        value: this.lifeProtectionValues.coverageAmount
      }
    };
  }

  constructCriticalIllness(data): IResultItem {
    let coverage;
    if (this.existingCoverageValues) {
      coverage = {
        title: this.planData.LESS_EXISTING_COVERAGE,
        value: this.existingCoverageValues.criticalIllnessCoverage ? this.existingCoverageValues.criticalIllnessCoverage : 0
      } as IResultItemEntry;
    }
    const entries = [] as IResultItemEntry[];
    entries.push({
      title: this.planData.CRITICAL_ILLNESS.ANNUAL_INCOME,
      value: this.criticalIllnessValues.annualSalary + Number(this.monthlySalary.annualBonus), currency: this.planData.DOLLER
    } as IResultItemEntry);
    entries.push({
      title: this.planData.CRITICAL_ILLNESS.YEARS_TO_REPLACE,
      value: this.criticalIllnessValues.ciMultiplier, type: this.planData.CRITICAL_ILLNESS.YEARS
    } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: this.planData.CRITICAL_ILLNESS.ICON,
      title: this.planData.CRITICAL_ILLNESS.TITLE,
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: this.planData.COVARAGE_NEEDED,
        // tslint:disable-next-line:max-line-length
        value: ((this.criticalIllnessValues.annualSalary + Number(this.monthlySalary.annualBonus)) * this.criticalIllnessValues.ciMultiplier)
      }
    };
  }

  constructOccupationalDisability(data): IResultItem {
    let coverage;
    if (this.existingCoverageValues) {
      coverage = {
        title: this.planData.LESS_EXISTING_COVERAGE,
        value: this.existingCoverageValues.occupationalDisabilityCoveragePerMonth ?
          this.existingCoverageValues.occupationalDisabilityCoveragePerMonth : 0,
          monthEnabled: this.lblPerMonth
      } as IResultItemEntry;
    }
    const entries = [] as IResultItemEntry[];
    entries.push({
      title: this.planData.OCCUPATIONAL_DISABILITY.MONTHLY_SALARY,
      value: this.monthlySalary.monthlySalary, currency: this.planData.DOLLER
    } as IResultItemEntry);
    entries.push({
      title: this.planData.OCCUPATIONAL_DISABILITY.PERSENTAGE_TO_REPLACE,
      value: this.ocpDisabilityValues.percentageCoverage, type: this.planData.PERSENTAGE
    } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: this.planData.OCCUPATIONAL_DISABILITY.ICON,
      title: this.planData.OCCUPATIONAL_DISABILITY.TITLE,
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: this.planData.COVARAGE_NEEDED,
        value: this.ocpDisabilityValues.coverageAmount
      }
    };
  }

  constructLongTermCare(data): IResultItem {
    let coverage;
    if (this.existingCoverageValues) {
      coverage = {
        title: this.planData.LESS_EXISTING_COVERAGE,
        value: this.existingCoverageValues.longTermCareCoveragePerMonth ? this.existingCoverageValues.longTermCareCoveragePerMonth : 0
      } as IResultItemEntry;
    }
    const entries = [] as IResultItemEntry[];
    entries.push({
      title: this.guideMeService.getLongTermCare().careGiverType,
      value: this.guideMeService.selectLongTermCareValues(),
      currency: this.planData.DOLLER, monthEnabled: this.planData.LONG_TERM_CARE.FOR_MONTH
    } as IResultItemEntry);
    return {
      id: data.protectionTypeId,
      icon: this.planData.LONG_TERM_CARE.ICON,
      title: this.planData.LONG_TERM_CARE.TITLE,
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: this.planData.COVARAGE_NEEDED,
        value: this.guideMeService.selectLongTermCareValues()
      }
    };
  }

  constructHospitalPlan(data): IResultItem {
    let coverage;
    if (this.existingCoverageValues) {
      coverage = {
        title: this.planData.LESS_EXISTING_COVERAGE,
        value: this.existingCoverageValues.selectedHospitalPlan ? this.existingCoverageValues.selectedHospitalPlan : ''
      } as IResultItemEntry;
    }
    const entries = [] as IResultItemEntry[];
    entries.push({ title: this.planData.HOSPITAL_PLAN.FAMILY_MEMBER, value: 0 } as IResultItemEntry);
    const hospitalPlanClass = this.guideMeService.getHospitalPlan().hospitalClass;
    return {
      id: data.protectionTypeId,
      icon: this.planData.HOSPITAL_PLAN.ICON,
      title: this.planData.HOSPITAL_PLAN.TITLE,
      content: hospitalPlanClass,
      inputValues: entries,
      existingCoverage: coverage,
      total: {
        title: this.planData.COVARAGE_NEEDED,
        value: 0
      }
    };
  }
  goToNext() {
    // GA Tracking
    this.googleAnalyticsService.emitTime('guideMe', 'Guided', 'Success');
    this.googleAnalyticsService.endTime('guideMe');
    this.googleAnalyticsService.emitEvent('Guided', 'Recommend', 'Success');

    this.router.navigate([GUIDE_ME_ROUTE_PATHS.RECOMMENDATIONS]);
  }
}
