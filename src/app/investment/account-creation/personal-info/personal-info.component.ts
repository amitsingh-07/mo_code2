import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { NgbDateCustomParserFormatter } from '../../../shared/utils/ngb-date-custom-parser-formatter';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { AccountCreationCommon } from '../account-creation-common';
import { ACCOUNT_CREATION_ROUTE_PATHS } from '../account-creation-routes.constants';
import { AccountCreationService } from '../account-creation-service';
import { ACCOUNT_CREATION_CONSTANTS } from '../account-creation.constant';

@Component({
  selector: 'app-inv-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  encapsulation: ViewEncapsulation.None
})
export class PersonalInfoComponent implements OnInit {
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
  userProfileInfo;
  optionList: any;
  salutaionList: any;
  countries: any;
  raceList: any;
  accountCreationCommon: AccountCreationCommon = new AccountCreationCommon();
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private config: NgbDatepickerConfig,
    private modal: NgbModal,
    private signUpService: SignUpService,
    private accountCreationService: AccountCreationService,
    public readonly translate: TranslateService,
    private loaderService: LoaderService
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
    this.accountCreationService.loadInvestmentAccountRoadmap();
  }

  buildForm() {
    this.formValues = this.accountCreationService.getInvestmentAccountFormData();
    if (this.accountCreationService.isSingaporeResident()) {
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
            disabled: this.accountCreationService.isDisabled('salutation')
          }
        ],
        fullName: [
          {
            value: this.formValues.fullName,
            disabled: this.accountCreationService.isDisabled('fullName')
          },
          [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]
        ],
        nricNumber: [
          {
            value: this.formValues.nricNumber,
            disabled: this.accountCreationService.isDisabled('nricNumber')
          },
          [Validators.required, this.validateNric.bind(this)]
        ],
        dob: [
          {
            value: this.formValues.dob,
            disabled: this.accountCreationService.isDisabled('dob')
          },
          [Validators.required, this.validateMinimumAge]
        ],
        gender: [
          {
            value: this.formValues.gender,
            disabled: this.accountCreationService.isDisabled('gender')
          },
          Validators.required
        ],
        birthCountry: [
          {
            value: this.formValues.birthCountry,
            disabled: this.accountCreationService.isDisabled('birthCountry')
          },
          Validators.required
        ],
        passportIssuedCountry: [
          {
            value: this.formValues.passportIssuedCountry
              ? this.formValues.passportIssuedCountry
              : this.accountCreationService.getCountryFromNationalityCode(
                this.formValues.nationalityCode
              ),
            disabled: this.accountCreationService.isDisabled('passportIssuedCountry')
          },
          Validators.required
        ],
        race: [
          {
            value: this.formValues.race,
            disabled: this.accountCreationService.isDisabled('race')
          },
          [Validators.required]
        ]
      }
    );
  }
  buildFormForPassportDetails(): FormGroup {
    return this.formBuilder.group(
      {
        salutation: [
          {
            value: this.formValues.salutation,
            disabled: this.accountCreationService.isDisabled('salutation')
          }
        ],
        fullName: [
          {
            value: this.formValues.fullName,
            disabled: this.accountCreationService.isDisabled('fullName')
          },
          [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]
        ],
        dob: [
          {
            value: this.formValues.dob,
            disabled: this.accountCreationService.isDisabled('dob')
          },
          [Validators.required, this.validateMinimumAge]
        ],
        gender: [
          {
            value: this.formValues.gender,
            disabled: this.accountCreationService.isDisabled('gender')
          },
          Validators.required
        ],
        birthCountry: [
          {
            value: this.formValues.birthCountry,
            disabled: this.accountCreationService.isDisabled('birthCountry')
          },
          Validators.required
        ],
        passportNumber: [
          {
            value: this.formValues.passportNumber,
            disabled: this.accountCreationService.isDisabled('passportNumber')
          },
          [Validators.required, Validators.pattern(RegexConstants.PassportNumber)]
        ],
        passportIssuedCountry: [
          {
            value: this.formValues.passportIssuedCountry
              ? this.formValues.passportIssuedCountry
              : this.accountCreationService.getCountryFromNationalityCode(
                this.formValues.nationalityCode
              ),
            disabled: this.accountCreationService.isDisabled('passportIssuedCountry')
          },
          Validators.required
        ],
        passportExpiry: [
          {
            value: this.formValues.passportExpiry,
            disabled: this.accountCreationService.isDisabled('passportExpiry')
          },
          [Validators.required, this.validateExpiry]
        ],
        race: [
          {
            value: this.formValues.race,
            disabled: this.accountCreationService.isDisabled('race')
          },
          [Validators.required]
        ]
      }
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
      const error = this.accountCreationService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.accountCreationService.setPersonalInfo(form.getRawValue());
      this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.RESIDENTIAL_ADDRESS]);
    }
  }

  private validateMinimumAge(control: AbstractControl) {
    const value = control.value;
    if (control.value !== undefined && isNaN(control.value)) {
      const isMinAge =
        new Date(
          value.year + ACCOUNT_CREATION_CONSTANTS.personal_info.min_age,
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
          today.getMonth() + ACCOUNT_CREATION_CONSTANTS.personal_info.min_passport_expiry,
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
    if (value && value !== undefined) {
      const isValidNric = this.accountCreationCommon.isValidNric(value);
      if (!isValidNric) {
        return { nric: true };
      }
    }
    return null;
  }

  setOptionList() {
    this.loaderService.showLoader({
      title: this.translate.instant(
        'COMMON_LOADER.TITLE'
      ),
      desc: this.translate.instant(
        'COMMON_LOADER.DESC'
      )
    });
    this.accountCreationService.getAllDropDownList().subscribe((data) => {
      this.loaderService.hideLoader();
      this.accountCreationService.setOptionList(data.objectList);
      this.optionList = this.accountCreationService.getOptionList();
      this.salutaionList = this.optionList.salutation;
      this.raceList = this.optionList.race;
      this.countries = this.accountCreationService.getCountriesFormData();
      this.buildForm();
    },
      (err) => {
        this.loaderService.hideLoader();
        this.accountCreationService.showGenericErrorModal();
      });
  }

  setDropDownValue(event, key, value) {
    setTimeout(() => {
      this.invPersonalInfoForm.controls[key].setValue(value);
    }, 100);
  }

  isDisabled(fieldName) {
    return this.accountCreationService.isDisabled(fieldName);
  }

  setControlValue(value, controlName, formName) {
    this.accountCreationService.setControlValue(value, controlName, formName);
  }

  onKeyPressEvent(event: any, content: any) {
    this.accountCreationService.onKeyPressEvent(event , content);
  }

  @HostListener('input', ['$event'])
  onChange(event) {
    const id = event.target.id;
    if (id !== '') {
      const content = event.target.innerText;
      if (content.length >= 100) {
        const contentList = content.substring(0, 100);
        this.invPersonalInfoForm.controls.fullName.setValue(contentList);
        const el = document.querySelector('#' + id);
        this.accountCreationService.setCaratTo(el, 100, contentList);
      }
    }
  }
}
