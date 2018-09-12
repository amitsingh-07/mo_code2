import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { GuideMeService } from '../guide-me.service';

@Component({
  selector: 'app-compare-plans',
  templateUrl: './compare-plans.component.html',
  styleUrls: ['./compare-plans.component.scss']
})
export class ComparePlansComponent implements OnInit {
  pageTitle: string;
  plansdata: any[] = [];
  constructor(public headerService: HeaderService, public guideMeService: GuideMeService, public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GET_STARTED.TITLE');
      this.setPageTitle(this.pageTitle);
   });
  }

  ngOnInit() {
    this.plansdata = this.guideMeService.getPlanDetails();
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

}
