import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
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
    public navbarService: NavbarService,
    public footerService: FooterService,
    public headerService: HeaderService,
    private portfolioService: PortfolioService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('WHATS_THE_RISK.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }
}
