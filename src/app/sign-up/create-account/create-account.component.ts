import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from './../sign-up.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAccountComponent implements OnInit {
  private pageTitle: string;
  private description: string;

  createAccountForm: FormGroup;
  formValues: any;
  defaultCountryCode;
  countryCodeOptions;

  constructor(private formBuilder: FormBuilder,
              private modal: NgbModal,
              private signUpService: SignUpService,
              private router: Router,
              private translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CREATE_ACCOUNT.TITLE');
      this.description = this.translate.instant('CREATE_ACCOUNT.DESCRIPTION');
     });
  }

  /**
   * Initialize tasks.
   */
  ngOnInit() {
    this.buildAccountInfoForm();
    this.getCountryCode();
  }

  /**
   * build account form.
   */
  buildAccountInfoForm() {
    this.formValues = this.signUpService.getAccountInfo();
    this.formValues.countryCode = this.formValues.countryCode ? this.formValues.countryCode : this.defaultCountryCode;
    this.formValues.termsOfConditions = this.formValues.termsOfConditions ? this.formValues.termsOfConditions : false;
    this.formValues.marketingAcceptance = this.formValues.marketingAcceptance ? this.formValues.marketingAcceptance : false;
    this.createAccountForm = this.formBuilder.group({
      countryCode: [this.formValues.countryCode, [Validators.required]],
      mobileNumber: [this.formValues.mobileNumber, [Validators.required, Validators.pattern('[0-9]\\d{7,9}')]],
      firstName: [this.formValues.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+')]],
      lastName: [this.formValues.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+')]],
      email: [this.formValues.email, [Validators.required, Validators.email]],
      termsOfConditions: [this.formValues.termsOfConditions],
      marketingAcceptance: [this.formValues.marketingAcceptance]
    });
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
      form.name = 'createAccountForm';
      const error = this.signUpService.currentFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.errorTitle;
      ref.componentInstance.errorMessage = error.errorMessage;
      return false;
    } else {
      this.signUpService.setAccountInfo(form.value);
      this.requestOneTimePassword();
    }
  }

  /**
   * set country code.
   * @param countryCode - country code detail.
   */
  setCountryCode(countryCode) {
    this.defaultCountryCode = countryCode;
    this.createAccountForm.controls['countryCode'].setValue(countryCode);
  }

  /**
   * get country code.
   */
  getCountryCode() {
    this.signUpService.getCountryCode().subscribe((data) => {
      this.countryCodeOptions = data;
      this.setCountryCode(this.countryCodeOptions[0].code);
    });
  }

  /**
   * request one time password.
   */
  requestOneTimePassword() {
    this.signUpService.requestOneTimePassword().subscribe((data) => {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_MOBILE]);
    });
  }
}
