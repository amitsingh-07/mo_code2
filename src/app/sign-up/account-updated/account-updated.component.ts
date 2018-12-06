import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '../../../../node_modules/@angular/router';

import { SIGN_UP_ROUTE_PATHS } from './../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-account-updated',
  templateUrl: './account-updated.component.html',
  styleUrls: ['./account-updated.component.scss']
})
export class AccountUpdatedComponent implements OnInit, AfterViewInit {
  formData;
  updateMobile;
  updateEmail;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private signUpService: SignUpService
  ) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.formData = this.signUpService.getAccountInfo();
    this.updateMobile = this.formData.updateMobile ? this.formData.updateMobile : false;
    this.updateEmail = this.formData.updateEmail ? this.formData.updateEmail : false;
  }

  ngAfterViewInit() {
    this.signUpService.setEditContact(false, false, false);
  }

  redirectToEditProfile() {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
  }

}
