import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SignUpApiService } from './../sign-up.api.service';
import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  constructor(
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.use('en');
  }

  /**
   * Getting email confirmation code from URL.
   */
  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      this.verifyEmail(queryParams.confirmation_token);
    });
  }

  /**
   * verify email.
   * @param code - email confirmation code
   */
  verifyEmail(verifyCode) {
    this.signUpApiService.verifyEmail(verifyCode).subscribe((data) => {
        if (data.responseMessage.responseCode !== 6000) {

        }
    });
  }

  /**
   * redirect to login page.
   */
  redirectToLogin() {
    this.router.navigate([]);
  }
}
