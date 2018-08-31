import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  constructor(
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.verifyEmail(params.code);
    });
  }

  verifyEmail(code) {
    this.signUpService.verifyEmail(code).subscribe((data) => {

    });
  }

  redirectToLogin() {
    this.router.navigate([]);
  }
}
