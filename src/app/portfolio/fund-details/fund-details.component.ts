import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-fund-details',
  templateUrl: './fund-details.component.html',
  styleUrls: ['./fund-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundDetailsComponent implements OnInit {
  portfolio: any;
  name: string;
  pageTitle: string;
  fund;
  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private portfolioService: PortfolioService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FUND_DETAILS.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  ngOnInit() {
    this.fund = this.portfolioService.getSelectedFund();
  }
}
