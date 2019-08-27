import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../config/config.service';
import { GoogleAnalyticsService } from '../../shared/analytics/google-analytics.service';
import { WillWritingApiService } from '../../will-writing/will-writing.api.service';
import { WillWritingService } from '../../will-writing/will-writing.service';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { AppConfigService } from './../../app-config.service';

@Component({
  selector: 'app-account-created',
  templateUrl: './account-created.component.html',
  styleUrls: ['./account-created.component.scss']
})
export class AccountCreatedComponent implements OnInit {

  resendEmail: boolean;
  emailTriggered = false;
  emailSent = false;

  constructor(
    private translate: TranslateService,
    private modal: NgbModal,
    private googleAnalyticsService: GoogleAnalyticsService,
    private willWritingApiService: WillWritingApiService,
    private willWritingService: WillWritingService,
    private signUpService: SignUpService,
    private configService: ConfigService,
    private router: Router,
    private signUpApiService: SignUpApiService) {
    this.translate.use('en');
  }
  // constonts
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    // Environment
    if (AppConfigService.settings.gtagPropertyId) {
      this.googleAnalyticsService.emitConversionsTracker(AppConfigService.settings.gtagPropertyId + '/FF5kCLaf9aUBEP_VqfUC');
    }
    this.googleAnalyticsService.emitEvent('Sign-Up', 'Sign-Up', 'Success');

    if (this.signUpService.getUserMobileNo()) {
      this.resendEmail = true;
    }
  }

  /**
   * redirect to login page.
   */
  redirectToLogin() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
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
