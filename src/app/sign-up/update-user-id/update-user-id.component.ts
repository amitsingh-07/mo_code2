import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService, IConfig } from '../../config/config.service';
import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { environment } from './../../../environments/environment';
import { FooterService } from './../../shared/footer/footer.service';
import { SignUpApiService } from './../sign-up.api.service';
import { SignUpService } from './../sign-up.service';
import { ValidateRange } from './range.validator';
import { ValidateMobileChange } from './formGroup.change.validator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Util } from '../../shared/utils/util';

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
  defaultCountryCode;
  countryCodeOptions;
  OldCountryCode;
  OldMobileNumber;
  OldEmail;
  updateMobile: boolean;
  updateEmail: boolean;
  capslockFocus: boolean;
  capsOn: boolean;
  editType;
  confirmEmailFocus: boolean = false;
  confirmMobileFocus: boolean = false;

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private signUpApiService: SignUpApiService,
    private signUpService: SignUpService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private _location: Location,
    private investmentAccountService: InvestmentAccountService,
    private configService: ConfigService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPDATE_USER_ID.TITLE');
      this.setPageTitle(this.pageTitle);
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

    // this.authService.get2faAuthEvent
    // .pipe(takeUntil(this.ngUnsubscribe))
    // .subscribe((token) => {
    //   if (!token) {
    //     this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
    //   }
    // });
    this.signUpService.getEditProfileInfo()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        const personalData = data.objectList.personalInformation;
        if (personalData) {
          if (this.updateUserIdForm) {
            if (this.checkEditType()) {
              
            } else {
              this.updateUserIdForm.setValidators([
                this.validateMatchPasswordEmail(),
                ValidateMobileChange({
                  'mobileNumber': personalData.mobileNumber
                })]);
            }
            this.updateUserIdForm.patchValue({
              countryCode: personalData.countryCode,
              mobileNumber: `${personalData.countryCode} ${personalData.mobileNumber}`
            });
          }
          this.signUpService.setContactDetails(personalData.countryCode, personalData.mobileNumber, personalData.email);
          this.OldCountryCode = personalData.countryCode;
          this.OldEmail = personalData.email;
          this.OldMobileNumber = personalData.mobileNumber;
        }
      });
    // this.translate.get('ERROR').subscribe((results) => {
    //   this.authService.get2faErrorEvent
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((data) => {
    //     if(data) {
    //       this.authService.openErrorModal(
    //         results.SESSION_2FA_EXPIRED.TITLE,
    //         results.SESSION_2FA_EXPIRED.SUB_TITLE,
    //         results.SESSION_2FA_EXPIRED.BUTTON
    //         );
    //     }
    //   });
    // });
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
    this.OldCountryCode = this.formValues.OldCountryCode;
    this.OldMobileNumber = this.formValues.OldMobileNumber;
    this.OldEmail = this.formValues.OldEmail;
    if (this.checkEditType()) {

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
          'mobileNumber': this.OldMobileNumber,
        })]
      });
    }
  }

  /**
   * validate updateUserIdForm.
   * @param form - user account form detail.
   */
  save(form: any) {
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
      if (this.checkEditType()) {
        if (this.OldEmail !== form.value.email) {
          this.updateEmail = true;
        }
      } else{
        if (this.OldMobileNumber !== form.value.mobileNumber) {
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
  updateUserAccount() {
    let formValues = {};
    if(this.checkEditType){

    } else{
      formValues = {
        countryCode: this.updateUserIdForm.value.countryCode,
        mobileNumber: this.updateUserIdForm.value.newMobileNumber,
        password: this.updateUserIdForm.controls.encryptedPassword.value
      }
    }
    if (this.distribution) {
      const newValues = {
        'countryCode': this.updateUserIdForm.controls['countryCode'].value,
        'mobileNumber': this.updateUserIdForm.controls['mobileNumber'].value,
        'email': this.updateUserIdForm.controls['email'].value
      };
      formValues = newValues;
    }
    this.signUpApiService.updateAccount(formValues).subscribe((data: any) => {
      if (data.responseMessage.responseCode === 6000) {
        this.signUpService.setContactDetails(this.updateUserIdForm.value.countryCode,
          this.updateUserIdForm.value.mobileNumber, this.updateUserIdForm.value.email);
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
    });
  }

  onlyNumber(el) {
    this.updateUserIdForm.controls['newMobileNumber'].setValue(el.value.replace(RegexConstants.OnlyNumeric, ''));
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
  checkEditType() {
    if (this.editType === 'email') {
      return true;
    }
    return false;
  }
  private validateMatchPasswordEmail() {
    return (group: FormGroup) => {
      const mobileNumberInput = group.controls['newMobileNumber'];
      const confirmMbileNumberInput = group.controls['confirmMobileNumber'];
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
  isApplyDisabled() {
    let isDisabled = false;
    if (this.checkEditType()) {

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
}
