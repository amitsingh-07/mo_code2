import { ConfigService } from './../../config/config.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
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
  emailVerified: boolean;

  constructor(
    private signUpApiService: SignUpApiService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthenticationService, private configService: ConfigService
  ) {
    this.translate.use('en');
  }

  /**
   * Getting email confirmation code from URL.
   */
  ngOnInit() {
    this.emailVerified = false;
    this.route.queryParams.subscribe((queryParams) => {
      this.verifyEmail(queryParams.confirmation_token);
    });
  }

  /**
   * verify email.
   * @param code - email confirmation code
   */
  verifyEmail(verifyCode) {
    this.authService.authenticate().subscribe((token) => {
      this.signUpApiService.verifyEmail(verifyCode).subscribe((data) => {
        if (data.responseMessage.responseCode === 6000) {
          this.emailVerified = true;
          this.email = data.objectList[0].email;
        }
      });
    });
  }

  /**
   * redirect to login page.
   */
  redirectToLogin() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
  }
}
