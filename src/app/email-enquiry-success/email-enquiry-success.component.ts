import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from './../app-routes.constants';
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

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.checkHideHomePageFlag();
  }

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService,
    public authService: AuthenticationService,
    private router: Router) {
    this.isSignedUser = this.authService.isSignedUser();
  }

  ngOnInit() {
    this.navbarService.setNavbarMode(2);
    this.footerService.setFooterVisibility(false);
  }

  checkHideHomePageFlag() {
    if (environment.hideHomepage) {
      window.open('/', '_self')
    } else {
      this.router.navigate([APP_ROUTES.HOME]);
    }
  }

  redirectTo() {
    if (!this.isSignedUser) {
      this.checkHideHomePageFlag();
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    }
  }

}
