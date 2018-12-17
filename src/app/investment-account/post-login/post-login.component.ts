import { InvestmentAccountService } from './../investment-account-service';
import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS
} from '../../investment-account/investment-account-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { FooterService } from './../../shared/footer/footer.service';
@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostLoginComponent implements OnInit {
  singPassLinkTitle;

  constructor(
    // tslint:disable-next-line
    public authService: AuthenticationService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private investmentAccountService: InvestmentAccountService,
    private translate: TranslateService) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
    });

    this.translate.get('COMMON').subscribe((result: string) => {
      this.singPassLinkTitle = this.translate.instant('POSTLOGIN.PROCEED');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
    this.footerService.setFooterVisibility(false);
  }
  goBack() {
    this._location.back();
  }
  myInfoManual() {
    this.investmentAccountService.setMyInfoStatus(false);
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.SELECT_NATIONALITY]);
  }
}
