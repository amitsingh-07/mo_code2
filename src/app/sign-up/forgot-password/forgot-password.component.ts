import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
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
  emailNotFoundTitle: any;
  emailNotFoundDesc: any;
  forgotPasswordForm: FormGroup;
  formValues: any;
  defaultCountryCode;
  countryCodeOptions;
  heighlightMobileNumber;
  buttonTitle;
  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private translate: TranslateService) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
      this.heighlightMobileNumber = params.heighlightMobileNumber;
    });

    this.translate.get('COMMON').subscribe((result: string) => {
      this.emailNotFoundTitle = this.translate.instant('FORGOTPASSWORD.EMAIL_NOT_FOUND');
      this.emailNotFoundDesc = this.translate.instant('FORGOTPASSWORD.EMAIL_NOT_FOUND_DESC');
      this.buttonTitle = this.translate.instant('COMMON.TRY_AGAIN');
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(1);
    this.buildForgotPasswordForm();
  }

  buildForgotPasswordForm() {
    this.formValues = this.signUpService.getForgotPasswordInfo();
    this.forgotPasswordForm = this.formBuilder.group({
      email: [this.formValues.email, [Validators.required, Validators.email]],
    });
  }
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
    this.signUpService.setForgotPasswordInfo(form.value.email).subscribe((data) => {
      console.log('incomingData' + data.responseMessage.responseCode);
      // tslint:disable-next-line:triple-equals
      if ( data.responseMessage.responseCode == 6004) {
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = this.emailNotFoundTitle ;
      ref.componentInstance.errorMessage = this.emailNotFoundDesc;
      ref.componentInstance.primaryActionLabel = this.buttonTitle;
      // tslint:disable-next-line:triple-equals
      } else if (data.responseMessage.responseCode == 6000) {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.FORGOT_PASSWORD_RESULT]);
      }
    });
  }
}
goBack() {
  this._location.back();
}
}
