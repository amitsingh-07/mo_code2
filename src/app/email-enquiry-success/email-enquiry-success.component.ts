import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from './../app-routes.constants';
import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';

import { FooterService } from '../shared/footer/footer.service';
import { NavbarService } from '../shared/navbar/navbar.service';

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
    this.router.navigate(['/home']);
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

  redirectTo() {
    if (!this.isSignedUser) {
      this.router.navigate([APP_ROUTES.HOME]);
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
    }
  }

}
