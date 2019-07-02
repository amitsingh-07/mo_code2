import { flatMap } from 'rxjs/operators';

import { Location } from '@angular/common';
import {
    AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from '../../../app/shared/http/api.service';
import { appConstants } from '../../app.constants';
import { AppService } from '../../app.service';
import { ConfigService } from '../../config/config.service';
import { TermsComponent } from '../../shared/components/terms/terms.component';
import { FooterService } from '../../shared/footer/footer.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SelectedPlansService } from '../../shared/Services/selected-plans.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { Formatter } from '../../shared/utils/formatter.util';
import { WillWritingApiService } from '../../will-writing/will-writing.api.service';
import { WillWritingService } from '../../will-writing/will-writing.service';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { LoaderService } from './../../shared/components/loader/loader.service';
import { SignUpService } from '../sign-up.service';
import { IEnquiryUpdate } from '../signup-types';
import { ValidatePassword } from './password.validator';
import { ValidateRange } from './range.validator';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAccountComponent implements OnInit, AfterViewInit {
  private distribution: any;
  private pageTitle: string;
  private description: string;

  createAccountForm: FormGroup;
  formValues: any;
  defaultCountryCode;
  countryCodeOptions;
  captchaSrc: any = '';
  isPasswordValid = true;
  createAccountTriggered = false;

  confirmEmailFocus = false;
  confirmPwdFocus = false;
  passwordFocus = false;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private loaderService: LoaderService,
    private configService: ConfigService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    private authService: AuthenticationService,
    private willWritingApiService: WillWritingApiService,
    private willWritingService: WillWritingService,
    private appService: AppService,
    private apiService: ApiService,
    private selectedPlansService: SelectedPlansService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.translate.use('en');
    this.configService.getConfig().subscribe((config) => {
      this.distribution = config.distribution;
    });
  }

  /**
   * Initialize tasks.
   */
  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.refreshToken();
    }
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.buildAccountInfoForm();
    this.getCountryCode();
  }

  ngAfterViewInit() {
    if (!this.authService.isAuthenticated()) {
      this.loaderService.showLoader({title: 'Loading'});
      this.authService.authenticate().subscribe((token) => {
        this.refreshCaptcha();
        this.loaderService.hideLoader();
      });
    } else {
      this.refreshCaptcha();
      this.loaderService.hideLoader();
    }
  }

  refreshToken() {
    this.authService.authenticate().subscribe((token) => {
      this.refreshCaptcha();
    });
  }

  /**
   * build account form.
   */
  buildAccountInfoForm() {
    this.formValues = this.signUpService.getAccountInfo();
    this.formValues.countryCode = this.formValues.countryCode ? this.formValues.countryCode : this.defaultCountryCode;
    this.formValues.termsOfConditions = this.formValues.termsOfConditions ? this.formValues.termsOfConditions : true;
    this.formValues.marketingAcceptance = this.formValues.marketingAcceptance ? this.formValues.marketingAcceptance : false;
    if(this.distribution) {
      let email_in: string;
      if (this.formValues.email) {
        email_in = this.formValues.email;
      }
      this.createAccountForm = this.formBuilder.group({
        countryCode: [this.formValues.countryCode, [Validators.required]],
        mobileNumber: [this.formValues.mobileNumber, [Validators.required, ValidateRange]],
        firstName: [this.formValues.firstName, [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
        lastName: [this.formValues.lastName, [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
        email: [email_in, [Validators.required, Validators.pattern(this.distribution.login.regex)]],
        confirmEmail: [this.formValues.email],
        password: ['', [Validators.required, ValidatePassword]],
        confirmPassword: [''],
        termsOfConditions: [this.formValues.termsOfConditions],
        marketingAcceptance: [this.formValues.marketingAcceptance],
        captcha: ['', [Validators.required]]
      }, { validator: this.validateMatchPasswordEmail() });
      return false;
    }
    this.createAccountForm = this.formBuilder.group({
      countryCode: [this.formValues.countryCode, [Validators.required]],
      mobileNumber: [this.formValues.mobileNumber, [Validators.required, ValidateRange]],
      firstName: [this.formValues.firstName, [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
      lastName: [this.formValues.lastName, [Validators.required, Validators.pattern(RegexConstants.AlphaWithSymbol)]],
      email: [this.formValues.email, [Validators.required, Validators.email]],
      confirmEmail: [this.formValues.email],
      password: ['', [Validators.required, ValidatePassword]],
      confirmPassword: [''],
      termsOfConditions: [this.formValues.termsOfConditions],
      marketingAcceptance: [this.formValues.marketingAcceptance],
      captcha: ['', [Validators.required]]
    }, { validator: this.validateMatchPasswordEmail() });
    return true;
  }

  /**
   * validate createAccountForm.
   * @param form - user account form detail.
   */
  save(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.signUpService.getSignupFormError(form);
      if (error.errorMessages.length > 0) {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = error.title;
        ref.componentInstance.errorMessageList = error.errorMessages;
      }
      return false;
    } else {
      this.signUpService.setAccountInfo(form.value);
      this.openTermsOfConditions();
    }
  }

  /**
   * set country code.
   * @param countryCode - country code detail.
   */
  setCountryCode(countryCode) {
    const mobileControl = this.createAccountForm.controls['mobileNumber'];
    this.defaultCountryCode = countryCode;
    this.createAccountForm.controls['countryCode'].setValue(countryCode);
    if (countryCode === '+65') {
      mobileControl.setValidators([Validators.required, ValidateRange]);
    } else {
      mobileControl.setValidators([Validators.required, Validators.pattern(RegexConstants.CharactersLimit)]);
    }
    mobileControl.updateValueAndValidity();
  }

  /**
   * get country code.
   */
  getCountryCode() {
    this.signUpApiService.getCountryCodeList().subscribe((data) => {
      this.countryCodeOptions = [data[0]];
      const countryCode = this.formValues.countryCode ? this.formValues.countryCode : this.countryCodeOptions[0].code;
      this.setCountryCode(countryCode);
    });
  }

  /**
   * request one time password.
   */
  createAccount() {
    if (!this.createAccountTriggered) {
      this.createAccountTriggered = true;
      this.signUpApiService.createAccount(this.createAccountForm.value.captcha, this.createAccountForm.value.password)
        .subscribe((data: any) => {
          this.createAccountTriggered = false;
          const responseCode = [6000, 6008, 5006];
          if (responseCode.includes(data.responseMessage.responseCode)) {
            if (data.responseMessage.responseCode === 6000 ||
              data.responseMessage.responseCode === 6008) {
              this.signUpService.setCustomerRef(data.objectList[0].customerRef);
            }
            const insuranceEnquiry = this.selectedPlansService.getSelectedPlan();
            if ((this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_DIRECT ||
              this.appService.getJourneyType() === appConstants.JOURNEY_TYPE_GUIDED) &&
              (insuranceEnquiry &&
                insuranceEnquiry.plans && insuranceEnquiry.plans.length > 0)) {
              const redirect = data.responseMessage.responseCode === 6000;
              this.updateInsuranceEnquiry(insuranceEnquiry, data, redirect);
            } else if (data.responseMessage.responseCode === 6000) {
              this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_MOBILE]);
            } else if (data.responseMessage.responseCode === 6008 ||
              data.responseMessage.responseCode === 5006) {
              this.callErrorModal(data);
            }
          } else {
            this.showErrorModal('', data.responseMessage.responseDescription, '', '', false);
          }
        }, (err) => {
          this.createAccountTriggered = false;
        });
    }
  }

  callErrorModal(data: any) {
    if (data.responseMessage.responseCode === 6008) {
      this.signUpService.setUserMobileNo(this.createAccountForm.controls['mobileNumber'].value);
      this.showErrorModal(this.translate.instant('SIGNUP_ERRORS.TITLE'),
        this.translate.instant('SIGNUP_ERRORS.VERIFY_EMAIL_OTP'),
        this.translate.instant('COMMON.VERIFY_NOW'),
        SIGN_UP_ROUTE_PATHS.VERIFY_MOBILE, false);
    } else if (data.objectList[0].accountAlreadyCreated) {
      this.showErrorModal(this.translate.instant('SIGNUP_ERRORS.TITLE'),
        this.translate.instant('SIGNUP_ERRORS.ACCOUNT_EXIST_MESSAGE'),
        this.translate.instant('COMMON.LOG_IN'),
        SIGN_UP_ROUTE_PATHS.LOGIN, false);
    } else if (!data.objectList[0].emailVerified) {
      this.signUpService.setUserMobileNo(this.createAccountForm.controls['mobileNumber'].value);
      this.showErrorModal(this.translate.instant('SIGNUP_ERRORS.TITLE'),
        this.translate.instant('SIGNUP_ERRORS.VERIFY_EMAIL_MESSAGE'),
        this.translate.instant('COMMON.LOG_IN'),
        SIGN_UP_ROUTE_PATHS.LOGIN, true);
    }
  }

  showErrorModal(title: string, message: string, buttonLabel: string, redirect: string, emailResend: boolean) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorMessage = message;
    ref.result.then((data) => {
      if (!data && redirect) {
        this.router.navigate([redirect]);
      }
    });
    if (title) {
      ref.componentInstance.errorTitle = title;
      ref.componentInstance.buttonLabel = buttonLabel;
    }
    if (emailResend) {
      ref.componentInstance.enableResendEmail = true;
      ref.componentInstance.resendEmail.pipe(
        flatMap(($e) =>
          this.resendEmailVerification()))
        .subscribe((data) => {
          if (data.responseMessage.responseCode === 6007) {
            ref.componentInstance.emailSent = true;
          } else if (data.responseMessage.responseCode === 5114) {
            ref.close('close');
            this.showErrorModal('', data.responseMessage.responseDescription, '', '', false);
          }
        });
    }
    this.refreshCaptcha();
    this.createAccountForm.controls['password'].reset();
    this.createAccountForm.controls['confirmPassword'].reset();
  }

  updateInsuranceEnquiry(insuranceEnquiry, data: any, redirect: boolean) {
    const payload: IEnquiryUpdate = {
      customerId: data.objectList[0].customerRef,
      enquiryId: Formatter.getIntValue(insuranceEnquiry.enquiryId),
      newCustomer: true,
      selectedProducts: insuranceEnquiry.plans
    };
    this.apiService.updateInsuranceEnquiry(payload).subscribe(() => {
      if (redirect) {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_MOBILE]);
      } else {
        this.callErrorModal(data);
      }
    });
  }

  onPasswordInputChange() {
    if (this.createAccountForm.controls.password.errors && this.createAccountForm.controls.password.dirty
      && this.createAccountForm.controls.password.value) {
      this.isPasswordValid = false;
    } else {
      const _self = this;
      setTimeout(() => {
        _self.isPasswordValid = true;
      }, 500);
    }
  }

  resendEmailVerification() {
    return this.signUpApiService.resendEmailVerification(this.createAccountForm.controls['email'].value, true);
  }

  onlyNumber(el) {
    this.createAccountForm.controls['mobileNumber'].setValue(el.value.replace(RegexConstants.OnlyNumeric, ''));
  }

  goBack() {
    this._location.back();
  }

  openTermsOfConditions() {
    const ref = this.modal.open(TermsComponent, { centered: true, windowClass: 'sign-up-terms-modal-dialog' });
    ref.result.then((data) => {
      if (data === 'proceed') {
        this.createAccount();
      }
    });
  }

  refreshCaptcha() {
    if (!this.authService.isAuthenticated()) {
      this.refreshToken();
    } else {
      this.createAccountForm.controls['captcha'].reset();
      this.captchaSrc = this.authService.getCaptchaUrl();
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * show / hide password field.
   * @param el - selected element.
   */
  showHidePassword(el) {
    if (el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
  }

  /**
   * validate confirm password.
   */
  private validateMatchPasswordEmail() {
    return (group: FormGroup) => {
      const passwordInput = group.controls['password'];
      const passwordConfirmationInput = group.controls['confirmPassword'];
      const emailInput = group.controls['email'];
      const emailConfirmationInput = group.controls['confirmEmail'];

      // Confirm Password
      if (!passwordConfirmationInput.value) {
        passwordConfirmationInput.setErrors({ required: true });
      } else if (passwordInput.value !== passwordConfirmationInput.value) {
        passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        passwordConfirmationInput.setErrors(null);
      }

      // Confirm E-mail
      if (!emailConfirmationInput.value) {
        emailConfirmationInput.setErrors({ required: true });
      } else if (emailInput.value && emailInput.value.toLowerCase() !== emailConfirmationInput.value.toLowerCase()) {
        emailConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        emailConfirmationInput.setErrors(null);
      }
    };
  }

  showValidity(from) {
    if (from === 'confirmEmail') {
      this.confirmEmailFocus = !this.confirmEmailFocus;
    } else if (from === 'confirmPassword') {
      this.confirmPwdFocus = !this.confirmPwdFocus;
    } else {
      this.passwordFocus = !this.passwordFocus;
    }
  }
}
