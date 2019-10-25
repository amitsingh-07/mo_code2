import {
    AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import {
    MANAGE_INVESTMENTS_ROUTE_PATHS
} from '../../manage-investments/manage-investments-routes.constants';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';

@Component({
  selector: 'app-funding-intro',
  templateUrl: './funding-intro.component.html',
  styleUrls: ['./funding-intro.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FundingIntroComponent implements OnInit, AfterViewInit {
  animateStaticModal = false;
  hideStaticModal = false;
  pageTitle: string;
  time: any;

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private investmentAccountService: InvestmentAccountService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    private cd: ChangeDetectorRef
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
  }
  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.investmentAccountService.clearInvestmentAccountFormData();
    this.investmentAccountService.restrictBackNavigation();
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  goNext() {
    this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.FUNDING_INSTRUCTIONS]);
  }
}
