import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { DirectService } from './../direct.service';

@Component({
  selector: 'app-compare-plans',
  templateUrl: './compare-plans.component.html',
  styleUrls: ['./compare-plans.component.scss']
})
export class ComparePlansComponent implements OnInit {
  pageTitle: string;
  plansData: any[] = [];
  constructor(public headerService: HeaderService, public directService: DirectService, public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GET_STARTED.TITLE');
      this.setPageTitle(this.pageTitle);
   });
  }

  ngOnInit() {
    this.plansData = this.directService.getSelectedPlans();
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

}
