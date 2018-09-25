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
queryParams;
tocken;

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
      // tslint:disable-next-line:max-line-length
      resetPassword1 : [this.formValues.resetPassword1, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!$%@#£€*?&]{8,20}$/)]],
      // tslint:disable-next-line:max-line-length
      confirmpassword: [this.formValues.confirmpassword, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!$%@#£€*?&]{8,20}$/)]]
    });
  }
  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.headerService.setHeaderVisibility(false);
    this.buildResetPasswordForm();
    console.log('the tocken is ' + this.queryParams.key);
    this.tocken = encodeURIComponent(this.queryParams.key);
    console.log('the tocken now is is ' + this.tocken);
  }
  showHidePassword(el) {
    if (el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
  }
   resetPassword(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.signUpService.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      return false;
    } else if (form.value.resetPassword1 !== form.value.confirmpassword) {
      const error = this.signUpService.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = 'Password Should Match';
      return false;
    } else {
      this.signUpService.setResetPasswordInfo(form.value.confirmpassword, this.tocken).subscribe((data) => {
        console.log('Error code is ' + data.responseMessage.responseCode);
        // tslint:disable-next-line:triple-equals
        if ( data.responseMessage.responseCode == 4) {
          // tslint:disable-next-line:max-line-length
        this.router.navigate([SIGN_UP_ROUTE_PATHS.SUCCESS_MESSAGE], {queryParams: {buttonTitle: 'Login Now', redir: SIGN_UP_ROUTE_PATHS.LOGIN, Message: 'Password Successfully Reset'}, fragment: 'loading'});
        }
      });
      console.log(form.value);
    }
  }
}