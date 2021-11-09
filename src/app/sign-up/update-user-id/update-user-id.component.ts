import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfigService, IConfig } from '../../config/config.service';
import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { environment } from './../../../environments/environment';
import { FooterService } from './../../shared/footer/footer.service';
import { SignUpApiService } from './../sign-up.api.service';
import { SignUpService } from './../sign-up.service';
import { ValidateRange } from './range.validator';
import { ValidateMobileChange, ValidateEmailChange } from './formGroup.change.validator';
import { Util } from '../../shared/utils/util';
import { CryptoService } from '../../shared/utils/crypto';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';

@Component({
  selector: 'app-update-user-id',
  templateUrl: './update-user-id.component.html',
  styleUrls: ['./update-user-id.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateUserIdComponent implements OnInit, OnDestroy {
  private distribution: any;
  private pageTitle: string;

  updateUserIdForm: FormGroup;
  formValues: any;
  defaultCountryCode: any;
  countryCodeOptions: any;
  oldCountryCode: any;
  oldMobileNumber: any;
  oldEmail: any;
  updateMobile: boolean;
  updateEmail: boolean;
  capslockFocus: boolean;
  capsOn: boolean;
  editType;
  confirmEmailFocus = false;
  confirmMobileFocus = false;
  submitted = false;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    private investmentAccountService: InvestmentAccountService,
    private configService: ConfigService,
    public cryptoService: CryptoService,
    private loaderService: LoaderService,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPDATE_USER_ID.TITLE');
      this.setPageTitle(this.pageTitle);
      this.route.params.subscribe((params) => {
        this.editType = params.editType;
        if (this.checkEditType()) {
          this.pageTitle = this.translate.instant('UPDATE_USER_ID.EMAIL_TITLE');
          this.setPageTitle(this.pageTitle);
        }
      });
    });
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.distribution = config.distribution;
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  /**
   * Initialize tasks.
   */
  ngOnInit() {
    if (environment.hideHomepage) {
      this.navbarService.setNavbarMode(104);
    } else {
      this.navbarService.setNavbarMode(102);
    }
    this.buildUpdateAccountForm();
    if (!this.checkEditType()) {
      this.getCountryCode();
    }
    this.footerService.setFooterVisibility(false);

    this.signUpService.getEditProfileInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        const personalData = data.objectList.personalInformation;
        if (personalData) {
          if (this.updateUserIdForm) {
            if (this.checkEditType()) {
              this.updateUserIdForm.setValidators([
                this.validateMatchPasswordEmail(),
                ValidateEmailChange({
                  'email': personalData.email
                })]);
              this.updateUserIdForm.patchValue({
                email: personalData.email
              });
            } else {
              this.updateUserIdForm.setValidators([
                this.validateMatchPasswordEmail(),
                ValidateMobileChange({
                  'mobileNumber': personalData.mobileNumber,
                })]);
              this.updateUserIdForm.patchValue({
                countryCode: personalData.countryCode,
                mobileNumber: `${personalData.countryCode} ${personalData.mobileNumber}`,
              });
            }
          }

          this.signUpService.setContactDetails(personalData.countryCode, personalData.mobileNumber, personalData.email);
          this.oldCountryCode = personalData.countryCode;
          this.oldEmail = personalData.email;
          this.oldMobileNumber = personalData.mobileNumber;
        }
      });
  }

  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }

  ngOnDestroy() {
    if (this.signUpService.getRedirectUrl() !== SIGN_UP_ROUTE_PATHS.ACCOUNT_UPDATED) {
      this.signUpService.clearRedirectUrl();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  /**
   * build update account form.
   */
  buildUpdateAccountForm() {
    this.formValues = this.signUpService.getAccountInfo();
    this.formValues.countryCode = this.formValues.countryCode ? this.formValues.countryCode : this.defaultCountryCode;
    this.oldCountryCode = this.formValues.OldCountryCode;
    this.oldMobileNumber = this.formValues.OldMobileNumber;
    this.oldEmail = this.formValues.OldEmail;
    if (this.checkEditType()) {
      this.updateUserIdForm = this.formBuilder.group({
        email: [this.formValues.email],
        newEmail: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
        password: ['', Validators.required],
        encryptedPassword: ['']
      }, {
        validator: [this.validateMatchPasswordEmail(), ValidateEmailChange({
          'email': this.oldEmail
        })]
      });
    } else {
      this.updateUserIdForm = this.formBuilder.group({
        countryCode: [this.formValues.countryCode, [Validators.required]],
        mobileNumber: [`${this.formValues.countryCode} ${this.formValues.mobileNumber}`],
        newMobileNumber: ['', [Validators.required, ValidateRange]],
        confirmMobileNumber: ['', [Validators.required]],
        password: ['', Validators.required],
        encryptedPassword: ['']
      }, {
        validator: [this.validateMatchPasswordEmail(), ValidateMobileChange({
          'mobileNumber': this.oldMobileNumber,
        })]
      });
    }
  }

  /**
   * validate updateUserIdForm.
   * @param form - user account form detail.
   */
  save(form: any) {
    this.submitted = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.signUpService.getSignupFormError(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.updateUserIdForm.controls.encryptedPassword.setValue(this.cryptoService.encrypt(this.updateUserIdForm.controls.password.value));
      if (this.checkEditType()) {
        if (this.oldEmail !== form.value.newEmail) {
          this.updateEmail = true;
        }
      } else {
        if (this.oldMobileNumber !== form.value.newMobileNumber) {
          this.updateMobile = true;
        }
      }
      this.updateUserAccount();
    }
  }
  /**
   * set country code.
   * @param countryCode - country code detail.
   */
  setCountryCode(countryCode) {
    const mobileControl = this.updateUserIdForm.controls['newMobileNumber'];
    this.defaultCountryCode = countryCode;
    this.updateUserIdForm.controls['countryCode'].setValue(countryCode);
    if (countryCode === SIGN_UP_CONFIG.SINGAPORE_COUNTRY_CODE) {
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
    this.showLoader();
    this.signUpApiService.getCountryCodeList().subscribe((data) => {
      this.loaderService.hideLoaderForced();
      this.countryCodeOptions = [data[0]];
      const countryCode = this.formValues.countryCode ? this.formValues.countryCode : this.countryCodeOptions[0].code;
      this.setCountryCode(countryCode);
    }, (err) => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  /**
   * request one time password.
   */
  updateUserAccount() {
    let formValues: any = {};

    if (this.checkEditType()) {
      formValues = {
        email: this.updateUserIdForm.value.newEmail?.toLowerCase(),
        password: this.updateUserIdForm.controls.encryptedPassword.value
      }
    } else {
      formValues = {
        countryCode: this.updateUserIdForm.value.countryCode,
        mobileNumber: this.updateUserIdForm.value.newMobileNumber,
        password: this.updateUserIdForm.controls.encryptedPassword.value
      }
    }
    if (this.distribution) {
      let newValues = {}
      if (this.checkEditType()) {
        newValues = {
          'email': this.updateUserIdForm.controls['newEmail'].value,
          'password': this.updateUserIdForm.controls.encryptedPassword.value
        };
      } else {
        newValues = {
          'countryCode': this.updateUserIdForm.controls['countryCode'].value,
          'mobileNumber': this.updateUserIdForm.controls['mobileNumber'].value,
          'password': this.updateUserIdForm.controls.encryptedPassword.value
        };
      }
      formValues = newValues;
    }
    this.updateUserIdForm.controls.password.reset();
    this.updateUserIdForm.controls.encryptedPassword.reset();
    this.showLoader();
    this.signUpApiService.updateAccount(formValues, this.checkEditType()).subscribe((data: any) => {
      this.loaderService.hideLoaderForced();
      if (data.responseMessage.responseCode === 6000) {
        if (this.checkEditType()) {
          this.signUpService.setEmailDetails(this.updateUserIdForm.value.newEmail);
        } else {
          this.signUpService.setMobileDetails(this.updateUserIdForm.value.countryCode,
            this.updateUserIdForm.value.newMobileNumber);
        }
        this.signUpService.setEditContact(true, this.updateMobile, this.updateEmail);
        this.signUpService.setRedirectUrl(SIGN_UP_ROUTE_PATHS.ACCOUNT_UPDATED);
        if (data.objectList[0] && data.objectList[0].customerRef) {
          this.signUpService.setCustomerRef(data.objectList[0].customerRef);
        }
        if (this.updateMobile) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_MOBILE]);
        } else {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.ACCOUNT_UPDATED]);
        }
      } else if (data.responseMessage && data.responseMessage.responseDescription) {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorMessage = data.responseMessage.responseDescription;
      } else {
        this.investmentAccountService.showGenericErrorModal();
      }
    }, (err) => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    }).add(() => {
      this.submitted = false;
    });
  }

  onlyNumber(el, key) {
    this.updateUserIdForm.controls[key].setValue(el.value.replace(RegexConstants.OnlyNumeric, ''));
  }

  goBack() {
    this._location.back();
  }

  onFocus() {
    this.capslockFocus = true;
  }

  onBlur() {
    this.capslockFocus = false;
  }

  // CHECK ROUTE TYPE, EMAIL OR MOBILE
  checkEditType() {
    if (this.editType === SIGN_UP_CONFIG.EDIT_ROUTE_TYPE.EMAIL) {
      return true;
    }
    return false;
  }

  private validateMatchPasswordEmail() {
    return (group: FormGroup) => {
      const emailInput = group.controls['newEmail'];
      const emailConfirmationInput = group.controls['confirmEmail'];
      const mobileNumberInput = group.controls['newMobileNumber'];
      const confirmMbileNumberInput = group.controls['confirmMobileNumber'];

      // Confirm E-mail
      if (this.checkEditType()) {
        if (!emailConfirmationInput.value) {
          emailConfirmationInput.setErrors({ required: true });
        } else if (emailInput.value && emailInput.value.toLowerCase() !== emailConfirmationInput.value.toLowerCase()) {
          emailConfirmationInput.setErrors({ emailMismatch: true });
          return { emailNotEquivalent: true };
        } else {
          emailConfirmationInput.setErrors(null);
        }
      }

      // Mobile Number
      if (!this.checkEditType()) {
        if (!confirmMbileNumberInput.value) {
          confirmMbileNumberInput.setErrors({ required: true });
        } else if (mobileNumberInput.value && mobileNumberInput.value.toLowerCase() !== confirmMbileNumberInput.value.toLowerCase()) {
          confirmMbileNumberInput.setErrors({ mobileMismatch: true });
          return { mobileNotEquivalent: true };
        } else {
          confirmMbileNumberInput.setErrors(null);
        }
      }
      return null;
    };
  }

  onPaste(event: ClipboardEvent, key) {
    const pastedEmailText = event.clipboardData.getData('text').replace(/\s/g, '');
    this.updateUserIdForm.controls[key].setValue(pastedEmailText);
    event.preventDefault();
  }

  // DISABLE 'APPLY CHANGES' BTN IF EMPTY OR UNMATCHED FIELDS
  isApplyDisabled() {
    let isDisabled = false;
    if (this.checkEditType()) {
      if (Util.isEmptyOrNull(this.updateUserIdForm.controls.newEmail.value) ||
        Util.isEmptyOrNull(this.updateUserIdForm.controls.confirmEmail.value) ||
        Util.isEmptyOrNull(this.updateUserIdForm.controls.password.value) ||
        (this.updateUserIdForm.controls.newEmail.value.toLowerCase() !== this.updateUserIdForm.controls.confirmEmail.value.toLowerCase())) {
        isDisabled = true;
      }
    } else {
      if (Util.isEmptyOrNull(this.updateUserIdForm.controls.newMobileNumber.value) ||
        Util.isEmptyOrNull(this.updateUserIdForm.controls.confirmMobileNumber.value) ||
        Util.isEmptyOrNull(this.updateUserIdForm.controls.password.value) ||
        (this.updateUserIdForm.controls.newMobileNumber.value !== this.updateUserIdForm.controls.confirmMobileNumber.value)) {
        isDisabled = true;
      }
    }
    return isDisabled;
  }
  showValidity(controlName) {
    if (controlName === 'confirmEmail') {
      this.confirmEmailFocus = !this.confirmEmailFocus;
    } else if (controlName === 'confirmMobileNumber') {
      this.confirmMobileFocus = !this.confirmMobileFocus;
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

  onKeyupEvent(event, key) {
    if (event.target.value) {
      const enterEmail = event.target.value.replace(/\s/g, '');
      this.updateUserIdForm.controls[key].setValue(enterEmail);
    }
  }
}
