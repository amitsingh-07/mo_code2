import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpRoutePaths = SIGN_UP_ROUTE_PATHS;

  constructor(
    private _location: Location,
    private router: Router,
    private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }

  goBack() {
    this._location.back();
  }

}
