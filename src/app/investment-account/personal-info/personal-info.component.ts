import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { FooterService } from '../../shared/footer/footer.service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { InvestmentAccountCommon } from '../investment-account-common';
import { InvestmentAccountService } from '../investment-account-service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { NgbDateCustomParserFormatter } from '../../shared/utils/ngb-date-custom-parser-formatter';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { Router } from '@angular/router';
import { SignUpService } from '../../sign-up/sign-up.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inv-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  encapsulation: ViewEncapsulation.None
})
export class PersonalInfoComponent implements IPageComponent, OnInit {
  @ViewChild('expiryInput') expiryInput;
  @ViewChild('dobInput') dobInput;
  pageTitle: string;
  invPersonalInfoForm: FormGroup;
  formValues: any;
  passportMinDate: any;
  passportMaxDate: any;
  unitedStatesResident: string;
  showPassport = false;
  showNric = true;
  disabledFullName: true;
  userProfileInfo;
  optionList: any;
  salutaionList: any;
  countries: any;
  raceList: any;
  investmentAccountCommon: InvestmentAccountCommon = new InvestmentAccountCommon();
  constructor(
    private router: Router,
    private myInfoService: MyInfoService,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private config: NgbDatepickerConfig,
    private modal: NgbModal,
    private signUpService: SignUpService,
    private investmentAccountService: InvestmentAccountService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PERSONAL_INFO.TITLE');
      this.setPageTitle(this.pageTitle);
      const today: Date = new Date();
      config.minDate = {
        year: today.getFullYear() - 100,
        month: today.getMonth() + 1,
        day: today.getDate()
      };
      config.maxDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      };
      this.passportMinDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      };
      this.passportMaxDate = {
        year: today.getFullYear() + 20,
        month: today.getMonth() + 1,
        day: today.getDate()
      };
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.setOptionList();
    // get profile
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.populateFullName();
    if (this.investmentAccountService.isSingaporeResident()) {
      this.invPersonalInfoForm = this.buildFormForNricNumber();
      this.showPassport = false;
      this.showNric = true;
    } else {
      this.invPersonalInfoForm = this.buildFormForPassportDetails();
      this.showPassport = true;
      this.showNric = false;
    }
  }

  buildFormForNricNumber(): FormGroup {
    return this.formBuilder.group(
      {
        salutation: [
          {
            value: this.formValues.salutation,
            disabled: this.investmentAccountService.isDisabled('salutation')
          },
          [Validators.required]
        ],
        fullName: [
          {
            value: this.formValues.fullName,
            disabled: this.investmentAccountService.isDisabled('fullName')
          },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        ],
        firstName: [
          { value: this.formValues.firstName, disabled: false },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        ],
        lastName: [
          { value: this.formValues.lastName, disabled: false },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        ],
        nricNumber: [
          {
            value: this.formValues.nricNumber,
            disabled: this.investmentAccountService.isDisabled('nricNumber')
          },
          [Validators.required, this.validateNric.bind(this)]
        ],
        dob: [
          {
            value: this.formValues.dob,
            disabled: this.investmentAccountService.isDisabled('dob')
          },
          [Validators.required, this.validateMinimumAge]
        ],
        gender: [
          {
            value: this.formValues.gender,
            disabled: this.investmentAccountService.isDisabled('gender')
          },
          Validators.required
        ],
        birthCountry: [
          {
            value: this.formValues.birthCountry,
            disabled: this.investmentAccountService.isDisabled('birthCountry')
          },
          Validators.required
        ],
        passportIssuedCountry: [
          {
            value: this.formValues.passportIssuedCountry
              ? this.formValues.passportIssuedCountry
              : this.investmentAccountService.getCountryFromNationalityCode(
                  this.formValues.nationalityCode
                ),
            disabled: this.investmentAccountService.isDisabled('passportIssuedCountry')
          },
          Validators.required
        ],
        race: [
          {
            value: this.formValues.race,
            disabled: this.investmentAccountService.isDisabled('race')
          },
          [Validators.required]
        ]
      },
      { validator: this.validateName() }
    );
  }
  buildFormForPassportDetails(): FormGroup {
    return this.formBuilder.group(
      {
        salutation: [
          {
            value: this.formValues.salutation,
            disabled: this.investmentAccountService.isDisabled('salutation')
          },
          [Validators.required]
        ],
        fullName: [
          {
            value: this.formValues.fullName,
            disabled: this.investmentAccountService.isDisabled('fullName')
          },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        ],
        firstName: [
          { value: this.formValues.firstName, disabled: false },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        ],
        lastName: [
          { value: this.formValues.lastName, disabled: false },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        ],
        dob: [
          {
            value: this.formValues.dob,
            disabled: this.investmentAccountService.isDisabled('dob')
          },
          [Validators.required, this.validateMinimumAge]
        ],
        gender: [
          {
            value: this.formValues.gender ? this.formValues.gender : 'male',
            disabled: this.investmentAccountService.isDisabled('gender')
          },
          Validators.required
        ],
        birthCountry: [
          {
            value: this.formValues.birthCountry,
            disabled: this.investmentAccountService.isDisabled('birthCountry')
          },
          Validators.required
        ],
        passportNumber: [
          {
            value: this.formValues.passportNumber,
            disabled: this.investmentAccountService.isDisabled('passportNumber')
          },
          [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]
        ],
        passportIssuedCountry: [
          {
            value: this.formValues.passportIssuedCountry
              ? this.formValues.passportIssuedCountry
              : this.investmentAccountService.getCountryFromNationalityCode(
                  this.formValues.nationalityCode
                ),
            disabled: this.investmentAccountService.isDisabled('passportIssuedCountry')
          },
          Validators.required
        ],
        passportExpiry: [
          {
            value: this.formValues.passportExpiry,
            disabled: this.investmentAccountService.isDisabled('passportExpiry')
          },
          [Validators.required, this.validateExpiry]
        ],
        race: [
          {
            value: this.formValues.race,
            disabled: this.investmentAccountService.isDisabled('race')
          },
          [Validators.required]
        ]
      },
      { validator: this.validateName() }
    );
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
  populateFullName() {
    this.userProfileInfo = this.signUpService.getUserProfileInfo();
    this.formValues.firstName = this.formValues.firstName
      ? this.formValues.firstName
      : this.userProfileInfo.firstName;
    this.formValues.lastName = this.formValues.lastName
      ? this.formValues.lastName
      : this.userProfileInfo.lastName;
    this.formValues.fullName = this.formValues.fullName
      ? this.formValues.fullName
      : this.userProfileInfo.firstName + ' ' + this.userProfileInfo.lastName;
  }
  toggleDate(openEle, closeEle) {
    if (openEle) {
      openEle.toggle();
    }
    if (closeEle) {
      closeEle.close();
    }
  }
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.investmentAccountService.setPersonalInfo(form.getRawValue());
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.RESIDENTIAL_ADDRESS]);
    }
  }
  private validateName() {
    return (group: FormGroup) => {
      const name =
        group.controls['firstName'].value + ' ' + group.controls['lastName'].value;
      const name1 =
        group.controls['lastName'].value + ' ' + group.controls['firstName'].value;
      const fullName = group.controls['fullName'].value;
      if (
        fullName.toUpperCase() === name.toUpperCase() ||
        fullName.toUpperCase() === name1.toUpperCase()
      ) {
        return group.controls['firstName'].setErrors(null);
      } else {
        return group.controls['firstName'].setErrors({ nameMatch: true });
      }
    };
  }

  private validateMinimumAge(control: AbstractControl) {
    const value = control.value;
    if (control.value !== undefined && isNaN(control.value)) {
      const isMinAge =
        new Date(
          value.year + INVESTMENT_ACCOUNT_CONFIG.personal_info.min_age,
          value.month - 1,
          value.day
        ) <= new Date();
      if (!isMinAge) {
        return { isMinAge: true };
      }
    }
    return null;
  }

  private validateExpiry(control: AbstractControl) {
    const value = control.value;
    const today = new Date();
    if (control.value !== undefined && isNaN(control.value)) {
      const isMinExpiry =
        new Date(value.year, value.month - 1, value.day) >=
        new Date(
          today.getFullYear(),
          today.getMonth() + INVESTMENT_ACCOUNT_CONFIG.personal_info.min_passport_expiry,
          today.getDate()
        );
      if (!isMinExpiry) {
        return { isMinExpiry: true };
      }
    }
    return null;
  }

  validateNric(control: AbstractControl) {
    const value = control.value;
    if (value !== undefined) {
      const isValidNric = this.investmentAccountCommon.isValidNric(value);
      if (!isValidNric) {
        return { nric: true };
      }
    }
    return null;
  }

  setOptionList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.investmentAccountService.setOptionList(data.objectList);
      this.optionList = this.investmentAccountService.getOptionList();
      this.salutaionList = this.optionList.salutation;
      this.raceList = this.optionList.race;
      this.countries = this.investmentAccountService.getCountriesFormData();
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  setDropDownValue(event, key, value) {
    this.invPersonalInfoForm.controls[key].setValue(value);
  }
}
