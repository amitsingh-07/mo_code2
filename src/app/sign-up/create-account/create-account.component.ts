import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpApiService } from './../sign-up.api.service';
import { SignUpService } from './../sign-up.service';
import { ValidateRange } from './range.validator';

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
  heighlightMobileNumber;

  constructor(private formBuilder: FormBuilder,
              private modal: NgbModal,
              public headerService: HeaderService,
              private signUpApiService: SignUpApiService,
              private signUpService: SignUpService,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private _location: Location ) {
    this.translate.use('en');
    this.route.params.subscribe((params) => {
      this.heighlightMobileNumber = params.heighlightMobileNumber;
    });
  }

  /**
   * Initialize tasks.
   */
  ngOnInit() {
    this.headerService.setHeaderVisibility(false);
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
      mobileNumber: [this.formValues.mobileNumber, [Validators.required, ValidateRange]],
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
    const mobileControl = this.createAccountForm.controls['mobileNumber'];
    this.defaultCountryCode = countryCode;
    this.createAccountForm.controls['countryCode'].setValue(countryCode);
    if (countryCode === '+65') {
      mobileControl.setValidators([Validators.required, ValidateRange]);
    } else {
      mobileControl.setValidators([Validators.required, Validators.pattern('\\d{8,10}')]);
    }
    mobileControl.updateValueAndValidity();
  }

  /**
   * get country code.
   */
  getCountryCode() {
    this.signUpApiService.getCountryCodeList().subscribe((data) => {
      this.countryCodeOptions = data;
      const countryCode = this.formValues.countryCode ? this.formValues.countryCode : this.countryCodeOptions[0].code;
      this.setCountryCode(countryCode);
    });
  }

  /**
   * request one time password.
   */
  requestOneTimePassword() {
    this.signUpApiService.requestOneTimePassword().subscribe((data: any) => {
      if (data.responseCode === 6000) {
        this.signUpService.otpRequested = true;
        this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_MOBILE]);
      }
    });
  }

  onlyNumber(el) {
    this.createAccountForm.controls['mobileNumber'].setValue(el.value.replace(/[^0-9]/g, ''));
  }
  
  goBack() {
    this._location.back();
  }
}
