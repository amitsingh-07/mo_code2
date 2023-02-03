import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { ManageInvestmentsService } from '../manage-investments.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HoldingsComponent implements OnInit {
  pageTitle: string;
  formValues;
  holdings;
  portfolio;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    public authService: AuthenticationService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public manageInvestmentsService: ManageInvestmentsService
  ) {
    this.formValues = this.manageInvestmentsService.getTopUpFormData();
    this.portfolio = this.formValues.selectedCustomerPortfolio;
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('HOLDINGS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(105);
    } else {
      this.navbarService.setNavbarMode(103);
    }
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    const stepLabel = this.portfolio.portfolioName;
    this.navbarService.setPageTitle(
      title,
      undefined,
      undefined,
      undefined,
      undefined,
      stepLabel
    );
  }
}
