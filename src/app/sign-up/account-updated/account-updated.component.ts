import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SignUpService } from '../sign-up.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up.routes.constants';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { AppService } from './../../app.service';

@Component({
  selector: 'app-account-updated',
  templateUrl: './account-updated.component.html',
  styleUrls: ['./account-updated.component.scss']
})
export class AccountUpdatedComponent implements OnInit {
  formData;
  updateMobile;
  updateEmail;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private signUpService: SignUpService,
    private navbarService: NavbarService,
    private authService: AuthenticationService,
    private appService: AppService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.formData = this.signUpService.getAccountInfo();
    this.updateMobile = this.formData.updateMobile ? this.formData.updateMobile : false;
    this.updateEmail = this.formData.updateEmail ? this.formData.updateEmail : false;
    this.navbarService.clearSessionData();
  }

  redirectToEditProfile() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
  }

  redirectToLogin() {
    if (this.authService.isUserTypeCorporate) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: { orgID: this.appService.getCorporateDetails().uuid } });
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    }
  }

}
