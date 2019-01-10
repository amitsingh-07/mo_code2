import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { environment } from './../../../environments/environment';
import { FooterService } from './../../shared/footer/footer.service';
import { AuthenticationService } from './../../shared/http/auth/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

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
  captchaSrc = '';

  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private translate: TranslateService,
    private authService: AuthenticationService) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
      this.heighlightMobileNumber = params.heighlightMobileNumber;
    });

    this.translate.get('COMMON').subscribe((result: string) => {
      this.emailNotFoundTitle = this.translate.instant('FORGOTPASSWORD.EMAIL_NOT_FOUND');
      this.emailNotFoundDesc = this.translate.instant('FORGOTPASSWORD.EMAIL_NOT_FOUND_DESC');
      this.buttonTitle = this.translate.instant('COMMON.TRY_AGAIN');
    });
    if (!this.authService.isAuthenticated()) {
      this.authService.authenticate().subscribe((token) => {
      });
    }
  }

  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(5);
    this.navbarService.setNavbarMobileVisibility(false);
    this.navbarService.setNavbarShadowVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.buildForgotPasswordForm();
  }

  ngAfterViewInit() {
    this.refreshCaptcha();
  }

  buildForgotPasswordForm() {
    this.formValues = this.signUpService.getForgotPasswordInfo();
    this.forgotPasswordForm = this.formBuilder.group({
      email: [this.formValues.email, [Validators.required, Validators.email]],
      captcha: ['', [Validators.required]]
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
      this.signUpService.setForgotPasswordInfo(form.value.email, form.value.captcha).subscribe((data) => {
        // tslint:disable-next-line:triple-equals
        if (data.responseMessage.responseCode == 6004) {
          const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
          ref.componentInstance.errorTitle = this.emailNotFoundTitle;
          ref.componentInstance.errorMessage = this.emailNotFoundDesc;
          ref.componentInstance.primaryActionLabel = this.buttonTitle;
          // tslint:disable-next-line:triple-equals
        } else if (data.responseMessage.responseCode == 6000) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.FORGOT_PASSWORD_RESULT]);
        } else {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorMessage = data.responseMessage.responseDescription;
          this.refreshCaptcha();
        }
      });
    }
  }
  goBack() {
    this._location.back();
  }

  refreshCaptcha() {
    this.forgotPasswordForm.controls['captcha'].reset();
    this.captchaSrc = this.authService.getCaptchaUrl();
  }
}
