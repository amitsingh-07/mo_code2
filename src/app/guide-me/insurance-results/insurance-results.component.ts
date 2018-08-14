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
  constructor(private router: Router, public headerService: HeaderService,
              private translate: TranslateService, private guideMeService: GuideMeService,
              public modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('INSURANCE_RESULTS.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
  }

  ngOnInit() {
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }
}
