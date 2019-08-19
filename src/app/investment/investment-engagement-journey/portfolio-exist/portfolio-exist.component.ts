import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { MANAGEMENT_ROUTE_PATHS } from '../../management/management-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';

@Component({
  selector: 'app-portfolio-exist',
  templateUrl: './portfolio-exist.component.html',
  styleUrls: ['./portfolio-exist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioExistComponent implements OnInit {
  pageTitle: string;
  constructor(
    private router: Router,
    private investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    const self = this;
    this.translate.get('COMMON').subscribe((result: string) => {
      self.pageTitle = 'Portfolio Already Exist';
      this.setPageTitle(self.pageTitle);
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
  proceed() {
    this.router.navigate([MANAGEMENT_ROUTE_PATHS.YOUR_INVESTMENT]);
  }
}
