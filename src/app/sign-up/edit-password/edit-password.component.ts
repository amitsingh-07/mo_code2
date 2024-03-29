import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { environment } from './../../../environments/environment';
import { FooterService } from './../../shared/footer/footer.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  formValues: any;
  pageTitle: string;
  organisationEnabled = false;
  constructor(
    // tslint:disable-next-line
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public headerService: HeaderService,
    private footerService: FooterService,
    public navbarService: NavbarService,
    private signUpService: SignUpService,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthenticationService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = 'Change Password';
      this.setPageTitle(this.pageTitle);
    });
    this.organisationEnabled = authService.isUserTypeCorporate;
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(104);
    } else {
      this.navbarService.setNavbarMode(102);
    }
    this.footerService.setFooterVisibility(false);
    this.buildForgotPasswordForm();
  }
  buildForgotPasswordForm() {
    this.formValues = this.signUpService.getForgotPasswordInfo();
    this.resetPasswordForm = this.formBuilder.group({
      oldPassword: [this.formValues.oldPassword, [Validators.required]],
      newPassword: [this.formValues.oldPassword, [Validators.required, Validators.pattern(RegexConstants.Password.Full)]],
      confirmPassword: [this.formValues.oldPassword, [Validators.required, Validators.pattern(RegexConstants.Password.Full)]]
    });
  }
  showHidePassword(el) {
    if (el.type === 'password') {
      el.type = 'text';
    } else {
      el.type = 'password';
    }
  }
  applyChanges(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.signUpService.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      return false;
    } else if (form.value.newPassword !== form.value.confirmPassword) {
      const error = this.signUpService.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorMessage = 'Passwords do not match.';
      return false;
      // tslint:disable-next-line:no-duplicated-branches
    } else if (form.value.newPassword === form.value.oldPassword) {
      const error = this.signUpService.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorMessage = 'The old password and the new password cannot be the same.';
      return false;
    } else {
      this.signUpService.setEditPasswordInfo(form.value.oldPassword, form.value.newPassword).subscribe((data) => {
        // tslint:disable-next-line:triple-equals
        if (data.responseMessage.responseCode === 6000) {
          this.navbarService.logoutUser();
          // tslint:disable-next-line:max-line-length
          const redirectTo = this.authService.isUserTypeCorporate ? SIGN_UP_ROUTE_PATHS.CORP_SUCCESS_MESSAGE : SIGN_UP_ROUTE_PATHS.SUCCESS_MESSAGE;
          this.router.navigate([redirectTo], { queryParams: { buttonTitle: 'Login Now', redir: SIGN_UP_ROUTE_PATHS.LOGIN, Message: 'Password Successfully Reset!' }, fragment: 'loading' });
        }
      });
    }
  }
}
