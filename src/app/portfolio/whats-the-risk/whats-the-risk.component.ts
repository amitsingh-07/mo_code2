import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { PORTFOLIO_ROUTE_PATHS, PORTFOLIO_ROUTES } from '../portfolio-routes.constants';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-whats-the-risk',
  templateUrl: './whats-the-risk.component.html',
  styleUrls: ['./whats-the-risk.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhatsTheRiskComponent implements OnInit {
  pageTitle: string;
  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public headerService: HeaderService, private portfolioService: PortfolioService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WHATS_THE_RISK.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
    });
  }
  setPageTitle(title: string, subTitle?: string, helpIcon?: boolean) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }
  ngOnInit() {
  }

}
