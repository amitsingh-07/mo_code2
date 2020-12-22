import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from '../../shared/analytics/google-analytics.service';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-account-created',
  templateUrl: './account-created.component.html',
  styleUrls: ['./account-created.component.scss']
})
export class AccountCreatedComponent implements OnInit, OnDestroy {

  resendEmail: boolean;
  emailTriggered = false;
  emailSent = false;
  finlitEnabled = false;
  routeSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private signUpService: SignUpService,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private signUpApiService: SignUpApiService,
    public authService: AuthenticationService) {
    this.translate.use('en');
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.authService.clearAuthDetails();
      }
    });
  }
  // constonts
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    if (this.routeSubscription instanceof Subscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    // Environment
    this.googleAnalyticsService.emitEvent('Sign-Up', 'Sign-Up', 'Success');
    if (this.signUpService.getUserMobileNo()) {
      this.resendEmail = true;
    }
    if (this.route.snapshot.data[0]) {
      this.finlitEnabled = this.route.snapshot.data[0]['finlitEnabled'];
      this.appService.clearJourneys();
      this.appService.clearPromoCode();
    }

  }

  /**
   * redirect to login page.
   */
  redirectToLogin() {
    if (this.finlitEnabled) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.FINLIT_LOGIN]);
    } else {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    }

  }

  resendEmailVerification() {
    if (!this.emailTriggered) {
      this.emailTriggered = true;
      const mobile = this.signUpService.getUserMobileNo();
      this.signUpApiService.resendEmailVerification(mobile, false).subscribe((data) => {
        if (data.responseMessage.responseCode === 6007) {
          this.emailTriggered = false;
          this.emailSent = true;
        }
      });
    }
  }

}
