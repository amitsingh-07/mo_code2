import { AppService } from './../../app.service';
import { FooterService } from './../../shared/footer/footer.service';
import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import {
  INVESTMENT_ACCOUNT_ROUTE_PATHS, INVESTMENT_ACCOUNT_ROUTES
} from '../../investment-account/investment-account-routes.constants';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { LoginFormError } from './login-form-error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, AfterViewInit {
  private loginFormError: any = new LoginFormError();
  private pageTitle: string;
  private description: string;

  loginForm: FormGroup;
  formValues: any;
  defaultCountryCode;
  countryCodeOptions;
  heighlightMobileNumber;
  captchaSrc: any;
  showCaptcha: boolean;

  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder, private appService: AppService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public navbarService: NavbarService,
    public footerService: FooterService,
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
  }

  /**
   * Initialize tasks.
   */
  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.footerService.setFooterVisibility(false);
    this.buildLoginForm();
    this.authService.authenticate().subscribe((token) => {
    });
  }

  ngAfterViewInit() {
    if (this.signUpService.isCaptchaShown()) {
      this.showCaptcha = true;
      const captchaControl = this.loginForm.controls['captcha'];
      captchaControl.setValidators([Validators.required]);
      this.refreshCaptcha();
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
   * build login form.
   */
  buildLoginForm() {
    this.formValues = this.signUpService.getLoginInfo();
    this.loginForm = this.formBuilder.group({
      loginUsername: [this.formValues.loginUsername, [Validators.required, Validators.pattern(RegexConstants.EmailOrMobile)]],
      loginPassword: [this.formValues.loginPassword, [Validators.required]],
      captcha: ['']
    });
  }

  /**
   * Show or hide inline error.
   * @param form - form control.
   */
  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  /**
   * login submit.
   * @param form - login form.
   */
  // tslint:disable-next-line:cognitive-complexity
  doLogin(form: any) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      return false;
    } else {
      this.signUpApiService.verifyLogin(this.loginForm.value.loginUsername, this.loginForm.value.loginPassword).subscribe((data) => {
        if (data.responseMessage && data.responseMessage.responseCode >= 6000) {
          try {
            if (data.objectList[0].customerId) {
              this.appService.setCustomerId(data.objectList[0].customerId);
            }
          } catch (e) {
            console.log(e);
          }
          this.signUpApiService.getUserProfileInfo().subscribe((userInfo) => {
            this.signUpService.setUserProfileInfo(userInfo.objectList);
            const redirect_url = this.signUpService.getRedirectUrl();
            if (redirect_url) {
              this.signUpService.clearRedirectUrl();
              this.router.navigate([redirect_url]);
            } else {
              this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
            }
          });
        } else if (data.responseMessage.responseCode === 5016) {
            const captchaControl = this.loginForm.controls['captcha'];
            captchaControl.setErrors({notEquivalent: true});
            captchaControl.reset();
            this.refreshCaptcha();
            this.doLogin(this.loginForm);
        } else if (data.responseMessage.responseCode === 5011) {
          const captchaControl = this.loginForm.controls['loginUsername'];
          captchaControl.setErrors({invalidMatch: true});
          this.doLogin(this.loginForm);
          if (data.objectList[0].attempt >= 3) {
            this.signUpService.isCaptchaShown();
            this.showCaptcha = true;
            captchaControl.setValidators([Validators.required]);
          }
        }
      });
    }
  }

  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }

  currentFormError(form) {
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        return this.loginFormError.formFieldErrors[name][Object.keys(controls[name]['errors'])[0]];
      }
    }
  }

  goBack() {
    this._location.back();
  }

  refreshCaptcha() {
    const time = new Date().getMilliseconds();
    this.captchaSrc = '/assets/images/captcha.png?sessionId=' + this.authService.getSessionId() + '&time=' + time;
  }
}
