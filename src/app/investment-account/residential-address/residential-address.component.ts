import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-residential-address',
  templateUrl: './residential-address.component.html',
  styleUrls: ['./residential-address.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResidentialAddressComponent implements OnInit {
  addressForm: FormGroup;
  pageTitle: string;
  formValues: any;
  countries: any;
  isUserNationalitySingapore: any;
  reasonList: any;
  showOtherTex = false;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESIDENTIAL_ADDRESS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getReasoneList(); // API CALLING FOR REASONLIST
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    if (this.formValues.isMyInfoEnabled) {
      if (this.formValues.countryCode) {
        this.formValues.country = this.investmentAccountService.getCountryFromCountryCode(
          this.formValues.countryCode
        );
      }
      if (this.formValues.mailCountryCode) {
        this.formValues.mailCountry = this.investmentAccountService.getCountryFromCountryCode(
          this.formValues.mailCountryCode
        );
      }
    }
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.addressForm = this.buildForm();
    this.addOrRemoveAdditionalControls(this.addressForm.get('country').value);
    this.observeCountryChange();
    this.addOrRemoveMailingAddress();
    if (this.addressForm.get('mailingAddress')) {
      this.observeMailCountryChange();
    }
    if (this.addressForm.get('mailingAddress')) {
      this.observeReasonChange();
    }
    if (this.addressForm.get('mailingAddress')) {
      this.addOrRemoveOtherControl(
        this.addressForm.get('mailingAddress').get('reason').value
      );
    }
  }
  getReasoneList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.reasonList = data.objectList.differentAddressReason;
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      country: [
        {
          value: this.getDefaultCountry(),
          disabled: this.investmentAccountService.isDisabled('country')
        },
        Validators.required
      ],
      address1: [
        {
          value: this.formValues.address1,
          disabled: this.investmentAccountService.isDisabled('address1')
        },
        [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSymbol)]
      ],
      address2: [
        {
          value: this.formValues.address2,
          disabled: this.investmentAccountService.isDisabled('address2')
        },
        [Validators.pattern(RegexConstants.AlphanumericWithSymbol)]
      ],
      isMailingAddressSame: [
        {
          value: this.formValues.isMailingAddressSame,
          disabled: this.investmentAccountService.isDisabled('isMailingAddressSame')
        }
      ]
    });
  }

  addOrRemoveAdditionalControls(country) {
    const isSingapore = this.investmentAccountService.isCountrySingapore(country);
    if (isSingapore) {
      this.addressForm.addControl(
        'postalCode',
        new FormControl(
          {
            value: this.formValues.postalCode,
            disabled: this.investmentAccountService.isDisabled('postalCode')
          },
          [Validators.required, Validators.pattern(RegexConstants.SixDigitNumber)]
        )
      );
      this.addressForm.addControl(
        'floor',
        new FormControl(
          {
            value: this.formValues.floor,
            disabled: this.investmentAccountService.isDisabled('floor')
          },
          [Validators.pattern(RegexConstants.SymbolNumber)]
        )
      );
      this.addressForm.addControl(
        'unitNo',
        new FormControl(
          {
            value: this.formValues.unitNo,
            disabled: this.investmentAccountService.isDisabled('unitNo')
          },
          [Validators.pattern(RegexConstants.SymbolNumber)]
        )
      );

      this.addressForm.removeControl('city');
      this.addressForm.removeControl('state');
      this.addressForm.removeControl('zipCode');
    } else {
      this.addressForm.addControl(
        'city',
        new FormControl(this.formValues.city, [
          Validators.required,
          Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)
        ])
      );
      this.addressForm.addControl(
        'state',
        new FormControl(this.formValues.state, [
          Validators.required,
          Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)
        ])
      );
      this.addressForm.addControl(
        'zipCode',
        new FormControl(
          {
            value: this.formValues.zipCode,
            disabled: this.investmentAccountService.isDisabled('zipCode')
          },
          [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]
        )
      );

      this.addressForm.removeControl('postalCode');
      this.addressForm.removeControl('floor');
      this.addressForm.removeControl('unitNo');
    }
  }

  observeCountryChange() {
    this.addressForm.get('country').valueChanges.subscribe((value) => {
      this.addOrRemoveAdditionalControls(value);
    });
  }

  addOrRemoveMailingAddress() {
    if (!this.addressForm.controls.isMailingAddressSame.value) {
      this.addressForm.addControl(
        'mailingAddress',
        this.formBuilder.group({
          reason: [this.formValues.reason, Validators.required],
          mailCountry: [
            {
              value: this.formValues.mailCountry
                ? this.formValues.mailCountry
                : this.investmentAccountService.getCountryFromNationalityCode(
                    this.formValues.nationalityCode
                  ),
              disabled: this.investmentAccountService.isDisabled('mailCountry')
            },
            Validators.required
          ],
          mailAddress1: [
            {
              value: this.formValues.mailAddress1,
              disabled: this.investmentAccountService.isDisabled('mailAddress1')
            },
            [
              Validators.required,
              Validators.pattern(RegexConstants.AlphanumericWithSymbol)
            ]
          ],
          mailAddress2: [
            {
              value: this.formValues.mailAddress2,
              disabled: this.investmentAccountService.isDisabled('mailAddress2')
            },
            [Validators.pattern(RegexConstants.AlphanumericWithSymbol)]
          ]
        })
      );
      this.addOrRemoveAdditionalControlsMailing(
        this.addressForm.get('mailingAddress').get('mailCountry').value
      );
      this.observeMailCountryChange();
      this.observeReasonChange();
    } else {
      this.addressForm.removeControl('mailingAddress');
    }
  }
  observeReasonChange() {
    this.addressForm
      .get('mailingAddress')
      .get('reason')
      .valueChanges.subscribe((value) => {
        this.addOrRemoveOtherControl(value);
      });
  }
  addOrRemoveOtherControl(value) {
    const mailFormGroup = this.addressForm.get('mailingAddress') as FormGroup;
    if (value.name === 'Others, please specify') {
      mailFormGroup.addControl(
        'reasonForOthers',
        new FormControl(
          {
            value: this.formValues.reasonForOthers,
            disabled: this.investmentAccountService.isDisabled('reasonForOthers')
          },
          Validators.required
        )
      );
    } else {
      mailFormGroup.removeControl('reasonForOthers');
    }
  }

  addOrRemoveAdditionalControlsMailing(country) {
    const isSingapore = this.investmentAccountService.isCountrySingapore(country);
    const mailFormGroup = this.addressForm.get('mailingAddress') as FormGroup;
    if (isSingapore) {
      mailFormGroup.addControl(
        'mailPostalCode',
        new FormControl(
          {
            value: this.formValues.mailPostalCode,
            disabled: this.investmentAccountService.isDisabled('mailPostalCode')
          },
          [Validators.required, Validators.pattern(RegexConstants.SixDigitNumber)]
        )
      );
      mailFormGroup.addControl(
        'mailFloor',
        new FormControl(
          {
            value: this.formValues.mailFloor,
            disabled: this.investmentAccountService.isDisabled('mailFloor')
          },
          [Validators.pattern(RegexConstants.SymbolNumber)]
        )
      );
      mailFormGroup.addControl(
        'mailUnitNo',
        new FormControl(
          {
            value: this.formValues.mailUnitNo,
            disabled: this.investmentAccountService.isDisabled('mailUnitNo')
          },
          [Validators.pattern(RegexConstants.SymbolNumber)]
        )
      );

      mailFormGroup.removeControl('mailCity');
      mailFormGroup.removeControl('mailState');
      mailFormGroup.removeControl('mailZipCode');
    } else {
      mailFormGroup.addControl(
        'mailCity',
        new FormControl(
          {
            value: this.formValues.mailCity,
            disabled: this.investmentAccountService.isDisabled('mailCity')
          },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        )
      );
      mailFormGroup.addControl(
        'mailState',
        new FormControl(
          {
            value: this.formValues.mailState,
            disabled: this.investmentAccountService.isDisabled('mailState')
          },
          [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]
        )
      );
      mailFormGroup.addControl(
        'mailZipCode',
        new FormControl(
          {
            value: this.formValues.mailZipCode,
            disabled: this.investmentAccountService.isDisabled('mailZipCode')
          },
          [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]
        )
      );

      mailFormGroup.removeControl('mailPostalCode');
      mailFormGroup.removeControl('mailFloor');
      mailFormGroup.removeControl('mailUnitNo');
    }
  }

  observeMailCountryChange() {
    this.addressForm
      .get('mailingAddress')
      .get('mailCountry')
      .valueChanges.subscribe((value) => {
        this.addOrRemoveAdditionalControlsMailing(value);
      });
  }

  getDefaultCountry() {
    let defaultCountry;
    if (this.isUserNationalitySingapore) {
      defaultCountry = this.investmentAccountService.getCountryFromNationalityCode(
        INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE
      );
    } else {
      if (this.formValues.country) {
        defaultCountry = this.formValues.country;
      } else {
        defaultCountry = this.investmentAccountService.getCountryFromNationalityCode(
          this.formValues.nationalityCode
        );
      }
    }
    return defaultCountry;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  setDropDownValue(key, value) {
    this.addressForm.controls[key].setValue(value);
  }
  setNestedDropDownValue(key, value, nestedKey) {
    this.addressForm.controls[nestedKey]['controls'][key].setValue(value);
  }
  setReason(key, value, nestedKey) {
    this.addressForm.controls[nestedKey]['controls'][key].setValue(value);
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

  retrieveAddress(postalCode, address1Control, address2Control) {
    if (postalCode) {
      this.investmentAccountService.getAddressUsingPostalCode(postalCode).subscribe(
        (response: any) => {
          if (response) {
            if (response.Status.code === 200) {
              const address1 =
                response.Placemark[0].AddressDetails.Country.Thoroughfare
                  .ThoroughfareName;
              const address2 = response.Placemark[0].AddressDetails.Country.AddressLine;
              address1Control.setValue(address1);
              address2Control.setValue(address2);
            } else {
              const ref = this.modal.open(ErrorModalComponent, { centered: true });
              ref.componentInstance.errorTitle = this.translate.instant(
                'RESIDENTIAL_ADDRESS.POSTALCODE_NOT_FOUND_ERROR.TITLE'
              );
              ref.componentInstance.errorMessage = this.translate.instant(
                'RESIDENTIAL_ADDRESS.POSTALCODE_NOT_FOUND_ERROR.MESSAGE'
              );
              address1Control.setValue('');
              address2Control.setValue('');
            }
          }
        },
        (err) => {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant(
            'RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE'
          );
          ref.componentInstance.errorMessage = this.translate.instant(
            'RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC'
          );
        }
      );
    } else {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.translate.instant(
        'RESIDENTIAL_ADDRESS.POSTALCODE_EMPTY_ERROR.TITLE'
      );
      ref.componentInstance.errorMessage = this.translate.instant(
        'RESIDENTIAL_ADDRESS.POSTALCODE_EMPTY_ERROR.MESSAGE'
      );
    }
  }

  goToNext(form) {
    if (form.status === 'DISABLED') {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS]);
    } else if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.investmentAccountService.setResidentialAddressFormData(form.getRawValue());
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS]);
    }
  }

  isDisabled(field) {
    return this.investmentAccountService.isDisabled(field);
  }
}
