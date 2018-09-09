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
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {

  private pageTitle: string;
  private description: string;

  forgotPasswordForm: FormGroup;
  formValues: any;
  defaultCountryCode;
  countryCodeOptions;
  heighlightMobileNumber;

  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public headerService: HeaderService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
      this.heighlightMobileNumber = params.heighlightMobileNumber;
    });
  }

  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
    this.buildForgotPasswordForm();
  }

  buildForgotPasswordForm() {
    this.formValues = this.signUpService.getForgotPasswordInfo();
    this.forgotPasswordForm = this.formBuilder.group({
      email: [this.formValues.email, [Validators.required, Validators.email]],
    });
  }

  /**
  * validate ForgotPassword Form.
  * @param form - email form detail.
  */

 save(form: any) {
  if (!form.valid) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
    const error = this.signUpService.currentFormError(form);
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = error.errorTitle;
    ref.componentInstance.errorMessage = error.errorMessage;
    return false;
  } else {
    this.signUpService.setForgotPasswordInfo(form.value.email);
  }
}

}
