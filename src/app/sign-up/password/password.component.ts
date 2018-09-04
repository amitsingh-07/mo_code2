import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from './../sign-up.service';
import { ValidatePassword } from './password.validator';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
pwdShow,pwdVisibility,confirmPwdShow,confirmPwdVisibility: boolean;
  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private modal: NgbModal,
              private signUpService: SignUpService,
              private router: Router,
              private translate: TranslateService) {
    this.translate.use('en');
    this.pwdShow = false;
     this.pwdVisibility = false;
     this.confirmPwdShow = false;
     this.confirmPwdVisibility = false;
  }

  /**
   * Initialize tasks.
   */
  ngOnInit() {
    this.buildPasswordForm();
  }

  showPassword(args) {
  if(args == "confirmPwd"){
          this.confirmPwdShow = !this.confirmPwdShow;
          this.confirmPwdVisibility = !this.confirmPwdVisibility;
    }else if(args == "pwd"){
          this.pwdShow = !this.pwdShow;
          this.pwdVisibility = !this.pwdVisibility;
    }
  }
  /**
   * build password form.
   */
  buildPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [ValidatePassword]],
      confirmPassword: [''],
    }, {validator: this.validateMatchPassword('password', 'confirmPassword')});
  }

  /**
   * validate confirm password.
   * @param password - password field.
   * @param confirmPassword - confirm password field.
   */
  private validateMatchPassword(password: string, confirmPassword: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls['password'];
      const passwordConfirmationInput = group.controls['confirmPassword'];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  save(form: any) {
    if (!form.valid) {
      console.log(form);
    } else {
      this.signUpService.setPassword(form.value.password);
      this.createAccount();
    }
  }

  /**
   * create user account.
   */
  createAccount() {
    this.signUpService.createAccount().subscribe((data) => {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.ACCOUNT_CREATED]);
    });
  }

}
