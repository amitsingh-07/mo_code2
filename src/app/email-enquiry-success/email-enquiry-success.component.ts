import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from './../app-routes.constants';
import { AuthenticationService } from './../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';

import { FooterService } from '../shared/footer/footer.service';
import { NavbarService } from '../shared/navbar/navbar.service';
import { environment } from './../../environments/environment';
import { FBPixelService } from '../shared/analytics/fb-pixel.service';
import { GoogleAnalyticsService } from '../shared/analytics/google-analytics.service';
import { trackingConstants } from '../shared/analytics/tracking.constants';
import { AffiliateService } from '../shared/Services/affiliate.service';

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
    private fbPixelService: FBPixelService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private router: Router,
    private affiliateService: AffiliateService) {
    this.isSignedUser = this.authService.isSignedUser();
  }

  ngOnInit() {
    this.fbPixelService.track('Lead');
    this.googleAnalyticsService.emitConversionsTracker(trackingConstants.ga.emailEnquirySuccess);
    this.navbarService.setNavbarMode(2);
    this.footerService.setFooterVisibility(false);
    this.affiliateService.removeClickIdJson();
  }

  checkHideHomePageFlag() {
    if (environment.hideHomepage && !this.isSignedUser) {
      window.open('/', '_self');
    } else if(this.isSignedUser){
      this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
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
