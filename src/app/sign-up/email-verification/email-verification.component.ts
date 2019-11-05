import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from './../../config/config.service';

import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';
import { SignUpApiService } from './../sign-up.api.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  email: string;
  showLoader: boolean = true;
  statusMessages: any = {};
  message: string;

  constructor(
    private signUpApiService: SignUpApiService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private footerService: FooterService,
    private authService: AuthenticationService, private configService: ConfigService
  ) {
    this.translate.use('en');
    this.translate.get('EMAIL_VERIFICATION').subscribe((result: any) => {
      this.statusMessages['verified'] = result.LOADING.VERIFIED;
      this.statusMessages['alreadyVerified'] = result.LOADING.ALREADY_VERIFIED;
      this.statusMessages['expired'] = result.LOADING.LINK_EXPIRED;
      this.message = result.LOADING.VERIFYING;
    });
  }

  /**
   * Getting email confirmation code from URL.
   */
  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      if (!this.authService.isAuthenticated()) {
        this.authService.authenticate().subscribe(() => {
          this.verifyEmail(queryParams.confirmation_token);
        });
      } else {
        this.verifyEmail(queryParams.confirmation_token);
      }
      this.footerService.setFooterVisibility(false);
    });
  }

  /**
   * verify email.
   * @param code - email confirmation code
   */
  verifyEmail(verifyCode) {
    this.signUpApiService.verifyEmail(verifyCode).subscribe((data) => {
      if (data.responseMessage.responseCode === 6000) {
        this.email = data.objectList[0].email;
        this.message = this.statusMessages['verified'];
      } else if (data.responseMessage.responseCode === 5022) {
        this.message = this.statusMessages['expired'];
      } else if (data.responseMessage.responseCode === 5023) {
        this.message = this.statusMessages['alreadyVerified'];
      } else if (data.responseMessage.responseCode === 5010) {
        this.message = data.responseMessage.responseDescription;
        this.email = '';
      }
    }).add(() => {
      this.showLoader = false;
    });
  }

  /**
   * redirect to login page.
   */
  redirectToLogin() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
  }
}
