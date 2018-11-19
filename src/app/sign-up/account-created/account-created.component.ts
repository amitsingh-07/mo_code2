import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { WillWritingApiService } from 'src/app/will-writing/will-writing.api.service';
import { WillWritingService } from 'src/app/will-writing/will-writing.service';
import { GoogleAnalyticsService } from './../../shared/ga/google-analytics.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up.routes.constants';

@Component({
  selector: 'app-account-created',
  templateUrl: './account-created.component.html',
  styleUrls: ['./account-created.component.scss']
})
export class AccountCreatedComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private willWritingApiService: WillWritingApiService,
    private willWritingService: WillWritingService,
    private router: Router) {
    this.translate.use('en');
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.googleAnalyticsService.emitEvent('Sign-Up', 'Sign-Up', 'Success');
    if (this.willWritingService.getWillWritingFormData() && !this.willWritingService.getIsWillCreated()) {
      this.willWritingApiService.createWill().subscribe((data) => {
        if (data.responseMessage && data.responseMessage.responseCode >= 6000) {
          this.willWritingService.setIsWillCreated(true);
        }
      });
    }
  }

  /**
   * redirect to login page.
   */
  redirectToLogin() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
  }

}
