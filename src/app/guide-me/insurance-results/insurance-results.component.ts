import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { LifeProtectionComponent } from './../life-protection/life-protection.component';
import { IResultObject } from './insurance-result/insurance-result';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { GuideMeCalculateService } from './../guide-me-calculate.service';
import { GuideMeService } from './../guide-me.service';
import { ExistingCoverageModalComponent } from './existing-coverage-modal/existing-coverage-modal.component';
import { InsuranceResultModalComponent } from './insurance-result-modal/insurance-result-modal.component';

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

  // protectionNeedsData: any;

  // protectionNeedsArray: IResultObject[] = [];

  //JSON
  LifeProtection = {
    icon: 'life-protection-icon.svg',
    title: 'Life Protection',
    amount: '2939'
  };
  CriticalIllness = {
      icon: 'critical-illness-icon.svg',
      title: 'Critical Illness',
      amount: '2939'
  };
  occupationalDisability = {
    icon: 'occupational-disability-icon.svg',
    title: 'Occupational Disability',
    amount: '2939'
  };

  long_termCare = {
    icon: 'long-term-care-icon.svg',
    title: 'Long-Term Care',
    amount: '509'
  };
  hospital_plan = {
    icon: 'hospital-plan-icon.svg',
    title: 'Hospital Plan',
    amount: '50965'
  };

  constructor(private router: Router, public headerService: HeaderService,
              private translate: TranslateService, private guideMeService: GuideMeService,
              private guideMeCalculateService: GuideMeCalculateService, public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('INSURANCE_RESULTS.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
    this.getProtectionNeeds();
    this.criticalIllnessValues = this.guideMeService.getCiAssessment();
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
  // tslint:disable-next-line:prefer-const

  switch ( index.title ) {
      case 'Life Protection':
        this.showDetailsModal(index);
        break;
      case 'Critical Illness':
        this.showDetailsModal(index);
        break;
    }
    // tslint:disable-next-line:no-commented-code
    // this.protectionNeedsData = this.protectionNeedsData.slice(0);
    // console.log(this.protectionNeedsData);
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

  addExistingCoverageOutput(emittedValue) {
    this.protectionNeedsArray[0].amount  -= emittedValue.LIFEPROTECTION;
    this.protectionNeedsArray[0].amount <= 0 ? this.protectionNeedsArray[0].amount = 0 : '';
    this.protectionNeedsArray[1].amount -= emittedValue.CRITICAL_ILLNESS ? emittedValue.CRITICAL_ILLNESS : 0;
    this.protectionNeedsArray[1].amount <= 0 ? this.protectionNeedsArray[1].amount = 0 : '';
    this.protectionNeedsArray[2].amount -= emittedValue.OCCUPATION_DISABILITY ? emittedValue.OCCUPATION_DISABILITY : 0;
    this.protectionNeedsArray[2].amount <= 0 ? this.protectionNeedsArray[2].amount = 0 : '';
    this.protectionNeedsArray[3].amount -= emittedValue.LONG_TERMCARE ? emittedValue.LONG_TERMCARE : 0;
    this.protectionNeedsArray[3].amount <= 0 ? this.protectionNeedsArray[2].amount = 0 : '';
    console.log('working output');
  }

getProtectionNeeds() {
    this.protectionNeedsArray = [];
    const protectionNeeds = this.guideMeService.getProtectionNeeds().protectionNeedData;
    if (protectionNeeds !== undefined) {
       protectionNeeds.forEach( (protectionNeedData) => {
         if (protectionNeedData.status === true) {
           this.protectionNeedsArray.push(this.createProtectionNeedResult(protectionNeedData));
         }
       });
     }
  }

createProtectionNeedResult(data): IResultObject {
    let result_title: string;
    let result_icon: string;
    result_title = data.protectionType;
    result_icon = (data.protectionType.replace(/ /g, '-')).toLowerCase() + '-icon.svg';
    let result_value: string;
    switch (data.protectionType) {
      case 'Life Protection':
        //result_value = this.guideMeCalculateService.getLifeProtectionSummary().toString();
        return this.LifeProtection;
        break;
      case 'Critical Illness':
        return this.CriticalIllness;
        break;
      case 'Occupational Disability':
        return this.occupationalDisability;
        break;
      case 'Long-Term Care':
        return this.long_termCare;
        break;
      case 'Hospital Plan':
        return this.hospital_plan;
        result_value = null;
        break;
      default:
        result_value = null;
    }

    return {
      title: result_title,
      icon: result_icon,
      amount: result_value
    };
  }

}
