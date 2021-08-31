import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';

@Component({
  selector: 'app-select-portfolio-type',
  templateUrl: './select-portfolio-type.component.html',
  styleUrls: ['./select-portfolio-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectPortfolioTypeComponent implements OnInit {

  pageTitle: string;
  isPersonalAccount: boolean;
  portfolioType: any;
  constructor(
    private router: Router,
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    ) { 
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
        this.pageTitle = this.translate.instant('SELECT_PORTFOLIO_TYPE.PAGE_TITLE');
        this.setPageTitle(this.pageTitle);
      });
    }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    console.log("account type", this.portfolioType);
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  goToNext() {
    this.portfolioType === 1 ? this.isPersonalAccount = true : this.isPersonalAccount = false;
    this.isPersonalAccount ? this.router.navigate(['../' + INVESTMENT_COMMON_ROUTE_PATHS.ADD_SECONDARY_HOLDER_DETAILS]) : this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
  }
}
