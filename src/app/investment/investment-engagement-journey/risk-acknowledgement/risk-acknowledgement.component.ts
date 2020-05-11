import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { AuthenticationService } from '../../../shared/http/auth/authentication.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';

@Component({
  selector: 'app-risk-acknowledgement',
  templateUrl: './risk-acknowledgement.component.html',
  styleUrls: ['./risk-acknowledgement.component.scss']
})
export class RiskAcknowledgementComponent implements OnInit {

  pageTitle: string;
  title = this.translate.instant('RISK_ACKNOWLEDGMENT.TITLE');
  description = this.translate.instant('RISK_ACKNOWLEDGMENT.DESC');
  img = 'assets/images/investment-account/risk-ack.svg';
  description2 = this.translate.instant('GETSTARTED_STEP1.DESCRIPTION');
  tab = '1';

  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    private _location: Location,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService,
    public signUpService: SignUpService,
    private investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.title = this.translate.instant('RISK_ACKNOWLEDGMENT.TITLE');
      this.description = this.translate.instant('RISK_ACKNOWLEDGMENT.DESC');
      
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(6);
    this.navbarService.setNavbarMobileVisibility(false);
    this.footerService.setFooterVisibility(false);
    if (!this.authService.isAuthenticated()) {
      this.authService.authenticate().subscribe((token) => {
      },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
    }
  }
  goBack() {
    this._location.back();
  }
  goNext() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.PERSONAL_INFO]);
  }

}
