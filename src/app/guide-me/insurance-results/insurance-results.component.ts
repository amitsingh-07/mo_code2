import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { IResultObject } from './insurance-result/insurance-result';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { GuideMeCalculateService } from './../guide-me-calculate.service';
import { GuideMeService } from './../guide-me.service';
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
  // protectionNeedsData: any;

  // protectionNeedsArray: IResultObject[] = [];

  //JSON
  protectionNeedsArray = [{
    icon: 'life-protection-icon.svg',
    title: 'Life Protection',
    amount: '225364'
  }, {
    icon: 'critical-illness-icon.svg',
    title: 'Critical Illness',
    amount: '293963'
  }, {
    icon: 'occupational-disability-icon.svg',
    title: 'Occupational Disability',
    amount: '2939'
  }, {
    icon: 'long-term-care-icon.svg',
    title: 'Long-Term Care',
    amount: '509'
  }, {
    icon: 'hospital-plan-icon.svg',
    title: 'Hospital Plan',
    amount: '50965'
  }];

  constructor(private router: Router, public headerService: HeaderService,
              private translate: TranslateService, private guideMeService: GuideMeService,
              private guideMeCalculateService: GuideMeCalculateService, public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('INSURANCE_RESULTS.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
    // this.getProtectionNeeds();
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
  ref.componentInstance.title = data.title;
}

simpleChange() {
    this.protectionNeedsArray[0].amount = '784674';
    this.protectionNeedsArray[1].amount = '2786123';
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
        result_value = this.guideMeCalculateService.getLifeProtectionSummary().toString();
        break;
      case 'Critical Illness':
        break;
      case 'Occupational Disability':
        break;
      case 'Long Term Care':
        break;
      case 'Hospital Plan':
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
