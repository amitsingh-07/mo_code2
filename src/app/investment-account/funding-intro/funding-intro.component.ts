import {
    TOPUP_AND_WITHDRAW_ROUTE_PATHS
} from 'src/app/topup-and-withdraw/topup-and-withdraw-routes.constants';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';

@Component({
  selector: 'app-funding-intro',
  templateUrl: './funding-intro.component.html',
  styleUrls: ['./funding-intro.component.scss']
})
export class FundingIntroComponent implements OnInit {

  pageTitle: string;
  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
    this.footerService.setFooterVisibility(false);
  }
  goNext() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.FUND_YOUR_ACCOUNT]);
}

}
