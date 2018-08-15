import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';

import { Router } from '../../../../node_modules/@angular/router';
import { HeaderService } from '../../shared/header/header.service';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { GuideMeService } from './../guide-me.service';

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

  // JSON
  protectionNeedsData = [{
    icon: 'life-protection-icon.svg',
    title: 'Life Protection',
    amount: 225364
  }, {
    icon: 'critical-illness-icon.svg',
    title: 'Critical Illness',
    amount: 293963
  }, {
    icon: 'occupational-disability-icon.svg',
    title: 'Occupational Disability',
    amount: 2939
  }, {
    icon: 'long-term-care-icon.svg',
    title: 'Long-Term Care',
    amount: 509
  }, {
    icon: 'hospital-plan-icon.svg',
    title: 'Hospital Plan',
    amount: 50965
  }];

  constructor(private router: Router, public headerService: HeaderService,
              private translate: TranslateService, private guideMeService: GuideMeService,
              public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('INSURANCE_RESULTS.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
    this.getProtectionNeeds();
  }

  ngOnInit() {
    this.getProtectionNeeds();
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  viewDetails(index) {
    alert('working' + index.title);
    // tslint:disable-next-line:no-commented-code
    // this.protectionNeedsData = this.protectionNeedsData.slice(0);
    // console.log(this.protectionNeedsData);
  }

  simpleChange() {
    this.protectionNeedsData[0].amount = 784674;
    this.protectionNeedsData[1].amount = 2786123;
  }

  getProtectionNeeds() {
    console.log('Service triggered');
    console.log(this.guideMeService.getLifeProtection());
    this.protectionNeeds = this.guideMeService.getProtectionNeeds();
    if (this.protectionNeeds) {
      console.log(this.protectionNeeds);
      console.log('It exists');
    }
  }

}
