import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ValidateRange } from '../create-account/range.validator';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  formValues: any;
  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public headerService: HeaderService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }
  buildResetPasswordForm() {
    this.formValues = this.signUpService.getResetPasswordInfo();
    this.resetPasswordForm = this.formBuilder.group({
      password1: [this.formValues.password, [Validators.required]],
      confirmpassword: [this.formValues.confirmpassword, [Validators.required]],
    });
  }
  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
    this.buildResetPasswordForm();
  }
}
