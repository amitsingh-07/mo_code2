import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AccountCreationService } from '../../account-creation/account-creation-service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpService } from '../../sign-up/sign-up.service';
import { ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../engagement-journey-routes.constants';

@Component({
  selector: 'app-get-started-step1',
  templateUrl: './get-started-step1.component.html',
  styleUrls: ['./get-started-step1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedStep1Component implements OnInit {
  pageTitle: string;
  title = this.translate.instant('INSURANCE_RESULTS.TITLE');
  description = this.translate.instant('GETSTARTED_STEP1.CAPTION');
  img = 'assets/images/portfolio/risk-step-1.svg';
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
    private accountCreationService: AccountCreationService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.title = this.translate.instant('GETSTARTED_STEP1.TITLE');
      this.description = this.translate.instant('GETSTARTED_STEP1.CAPTION');
      this.description2 = this.translate.instant('GETSTARTED_STEP1.DESCRIPTION');
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
        this.accountCreationService.showGenericErrorModal();
      });
    }
  }
  goBack() {
    this._location.back();
  }
  goNext() {
    this.router.navigate([ENGAGEMENT_JOURNEY_ROUTE_PATHS.PERSONAL_INFO]);
  }
}
