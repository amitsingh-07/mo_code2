import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { TOPUP_AND_WITHDRAW_ROUTE_PATHS } from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

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
    public footerService: FooterService
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
    if (this.investmentAccountService.getAccountSuccussModalCounter() === 0) {
      this.investmentAccountService.setAccountSuccussModalCounter(1);
      this.time = setTimeout(() => {
        this.animateStaticModal = true;
      }, 3000);

      setTimeout(() => {
        this.hideStaticModal = true;
      }, 4000);
    } else {
      this.hideStaticModal = true;
    }
  }
  dismissFlashScreen() {
    clearTimeout(this.time);
    this.animateStaticModal = true;
    this.hideStaticModal = true;
   }
  goNext() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
  }
}
