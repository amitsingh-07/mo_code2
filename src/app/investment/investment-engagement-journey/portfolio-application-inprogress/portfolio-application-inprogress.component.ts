import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';

@Component({
  selector: 'app-portfolio-application-inprogress',
  templateUrl: './portfolio-application-inprogress.component.html',
  styleUrls: ['./portfolio-application-inprogress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioApplicationInprogressComponent implements OnInit {

  constructor(
    public readonly translate: TranslateService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.investmentAccountService.restrictBackNavigation();
    this.investmentAccountService.deactivateReassess();
  }
  goBack() {
    this.navbarService.goBack();
  }

  goToNext() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD])
  }

}
