import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from './../app-routes.constants';
import { appConstants } from '../app.constants';
import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';

import { FooterService } from '../shared/footer/footer.service';
import { NavbarService } from '../shared/navbar/navbar.service';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-email-enquiry-success',
  templateUrl: './email-enquiry-success.component.html',
  styleUrls: ['./email-enquiry-success.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailEnquirySuccessComponent implements OnInit {

  isSignedUser: boolean;
  routeName: string;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.router.navigate([this.routeName]);
  }

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService,
    public authService: AuthenticationService,
    private router: Router) {
    this.isSignedUser = this.authService.isSignedUser();
    if (environment.hideHomepage) {
      this.routeName = appConstants.homePageUrl;
    } else {
      this.routeName = APP_ROUTES.HOME;
    }
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(2);
    this.footerService.setFooterVisibility(false);
  }

  redirectTo() {
    if (!this.isSignedUser) {
      this.router.navigate([this.routeName]);
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    }
  }

}
