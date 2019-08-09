import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from './../../shared/footer/footer.service';

import {
  ACCOUNT_CREATION_ROUTE_PATHS
} from '../../account-creation/account-creation-routes.constants';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpService } from '../../sign-up/sign-up.service';

@Component({
  selector: 'app-pre-login',
  templateUrl: './pre-login.component.html',
  styleUrls: ['./pre-login.component.scss']
})
export class PreLoginComponent implements OnInit {

  constructor(
    // tslint:disable-next-line
    private modal: NgbModal,
    public authService: AuthenticationService,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
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
    this.navbarService.setNavbarDirectGuided(false);
    this.footerService.setFooterVisibility(false);
  }
  goBack() {
    this._location.back();
  }
  navigateCreateAccount() {
    this.signUpService.setRedirectUrl(ACCOUNT_CREATION_ROUTE_PATHS.START);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
  }

  navigateLogin() {
    this.signUpService.setRedirectUrl(ACCOUNT_CREATION_ROUTE_PATHS.ROOT);
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
  }

}
