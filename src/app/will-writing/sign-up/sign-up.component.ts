import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  pageTitle: string;
  signUpRoutePaths = SIGN_UP_ROUTE_PATHS;

  constructor(
    private _location: Location,
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private translate: TranslateService) {
    this.pageTitle = this.translate.instant('WILL_WRITING.SIGN_UP.DESCRIPTION');
    this.setPageTitle(this.pageTitle);
    this.translate.use('en');
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(4);
    this.footerService.setFooterVisibility(false);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeBackPress();
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }

  goBack() {
    this._location.back();
  }

}
