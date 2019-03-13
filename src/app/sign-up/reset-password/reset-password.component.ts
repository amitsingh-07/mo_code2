import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { APP_ROUTES } from './../../app-routes.constants';
import { FooterService } from './../../shared/footer/footer.service';
import { CustomErrorHandlerService } from './../../shared/http/custom-error-handler.service';

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
  token;

  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private translate: TranslateService, private errorHandler: CustomErrorHandlerService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }
  buildResetPasswordForm() {
    this.formValues = this.signUpService.getResetPasswordInfo();
    this.resetPasswordForm = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      resetPassword1: [this.formValues.resetPassword1, [Validators.required, Validators.pattern(RegexConstants.Password.Full)]],
      // tslint:disable-next-line:max-line-length
      confirmpassword: [this.formValues.confirmpassword, [Validators.required, Validators.pattern(RegexConstants.Password.Full)]]
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(101);
    this.navbarService.setNavbarMobileVisibility(false);
    this.navbarService.setNavbarShadowVisibility(false);
    this.footerService.setFooterVisibility(false);
    this.queryParams = this.route.snapshot.queryParams;
    this.buildResetPasswordForm();
    this.token = encodeURIComponent(this.queryParams.key);
    if (!this.token) {
      this.gotoHomePage(null);
    } else {
      this.authService.authenticate().subscribe(() => {
        this.signUpApiService.checkEmailValidity({ resetKey: `${this.token}` }).subscribe((data) => {
          if (data.responseMessage.responseCode < 6000) {
            this.gotoHomePage(data);
          }
        });
      });
    }
  }

  gotoHomePage(data) {
    this.router.navigate([APP_ROUTES.HOME]);
    if (data !== null) {
      this.errorHandler.handleCustomError(data);
    }
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
      ref.componentInstance.errorTitle = 'Passwords do not match';
      return false;
    } else {
      this.signUpService.setResetPasswordInfo(form.value.confirmpassword, this.token).subscribe((data) => {
        // tslint:disable-next-line:triple-equals
        if (data.responseMessage.responseCode == 6000) {
          // tslint:disable-next-line:max-line-length
          this.router.navigate([SIGN_UP_ROUTE_PATHS.SUCCESS_MESSAGE], { queryParams: { buttonTitle: 'Login Now', redir: SIGN_UP_ROUTE_PATHS.LOGIN, Message: 'Password Successfully Reset!' }, fragment: 'loading' });
        }
      });
    }
  }
}
