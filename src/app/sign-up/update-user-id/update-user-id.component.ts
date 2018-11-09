import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { TermsComponent } from '../../shared/components/terms/terms.component';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { FooterService } from './../../shared/footer/footer.service';
import { SignUpApiService } from './../sign-up.api.service';
import { SignUpService } from './../sign-up.service';
import { ValidateRange } from './range.validator';

@Component({
  selector: 'app-update-user-id',
  templateUrl: './update-user-id.component.html',
  styleUrls: ['./update-user-id.component.scss']
})
export class UpdateUserIdComponent implements OnInit {
  private pageTitle: string;
  private description: string;

  updateUserIdForm: FormGroup;
  formValues: any;
  defaultCountryCode;
  countryCodeOptions;
  editNumber;

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
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPDATE_USER_ID.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.route.params.subscribe((params) => {
      this.editNumber = params.editNumber;
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  /**
   * Initialize tasks.
   */
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.buildAccountInfoForm();
    this.getCountryCode();
  }

  /**
   * build account form.
   */
  buildAccountInfoForm() {
    this.formValues = this.signUpService.getAccountInfo();
    this.formValues.countryCode = this.formValues.countryCode ? this.formValues.countryCode : this.defaultCountryCode;
    this.updateUserIdForm = this.formBuilder.group({
      countryCode: [this.formValues.countryCode, [Validators.required]],
      mobileNumber: [this.formValues.mobileNumber, [Validators.required, ValidateRange]],
      email: [this.formValues.email, [Validators.required, Validators.email]]
    });
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
      this.signUpService.setAccountInfo(form.value);
      this.openTermsOfConditions();
    }
  }

  /**
   * set country code.
   * @param countryCode - country code detail.
   */
  setCountryCode(countryCode) {
    const mobileControl = this.updateUserIdForm.controls['mobileNumber'];
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
  createAccount() {
    this.signUpApiService.createAccount(this.updateUserIdForm.value.captcha).subscribe((data: any) => {
      if (data.responseMessage.responseCode === 6000) {
        this.signUpService.setCustomerRef(data.objectList[0].customerRef);
        this.router.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_MOBILE]);
      } else {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorMessage = data.responseMessage.responseDescription;
      }
    });
  }

  onlyNumber(el) {
    this.updateUserIdForm.controls['mobileNumber'].setValue(el.value.replace(RegexConstants.OnlyNumeric, ''));
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
}
