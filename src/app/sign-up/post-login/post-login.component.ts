import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import {
    INVESTMENT_ACCOUNT_ROUTE_PATHS, INVESTMENT_ACCOUNT_ROUTES
} from '../../investment-account/investment-account-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss']
})
export class PostLoginComponent implements OnInit {

  constructor(
    // tslint:disable-next-line
    private modal: NgbModal,
    public authService: AuthenticationService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private translate: TranslateService) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
  }
  goBack() {
    this._location.back();
  }
  noButClick() {
     this.signUpService.clearData();
     this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
  }

  yesButClick() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      }

}
