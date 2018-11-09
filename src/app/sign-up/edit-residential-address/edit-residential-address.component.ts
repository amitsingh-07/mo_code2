import { catchError } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../../investment-account/investment-account.constant';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SignUpApiService } from '../sign-up.api.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
@Component({
  selector: 'app-edit-residential-address',
  templateUrl: './edit-residential-address.component.html',
  styleUrls: ['./edit-residential-address.component.scss']
})
export class EditResidentialAddressComponent implements OnInit {

  addressForm: FormGroup;
  pageTitle: string;
  formValues;
  countries;
  isUserNationalitySingapore;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESIDENTIAL_ADDRESS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.getNationalityCountryList();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    //this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.isUserNationalitySingapore = true ;
    this.addressForm = this.isUserNationalitySingapore ? this.buildFormForSingapore() : this.buildFormForOtherCountry();
    this.addOrRemoveMailingAddress();
  }
  getNationalityCountryList() {
        this.investmentAccountService.getNationalityCountryList().subscribe((data) => {
            this.countries = this.getCountryList(data.objectList);
        });
}

getCountryList(data) {
    const countryList = [];
    data.forEach((nationality) => {
        nationality.countries.forEach((country) => {
            countryList.push(country);
        });
    });
    return countryList;
}
  buildFormForSingapore(): FormGroup {
    return this.formBuilder.group({
      country: [{value: this.investmentAccountService.getCountryFromNationalityCode(INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE),
        disabled: this.investmentAccountService.isDisabled('country')},
        Validators.required],
      postalCode: [{value: this.formValues.postalCode, disabled: this.investmentAccountService.isDisabled('postalCode')},
        [Validators.required, Validators.pattern(RegexConstants.SixDigitNumber)]],
      address1: [{value: this.formValues.address1, disabled: this.investmentAccountService.isDisabled('address1')},
        [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      address2: [{value: this.formValues.address2, disabled: this.investmentAccountService.isDisabled('address2')},
        [Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      floor: [{value: this.formValues.floor, disabled: this.investmentAccountService.isDisabled('floor')}, Validators.required],
      unitNo: [{value: this.formValues.unitNo, disabled: this.investmentAccountService.isDisabled('unitNo')}, Validators.required],
      isMailingAddressSame: [this.formValues.isMailingAddressSame]
    });
  }

  buildFormForOtherCountry(): FormGroup {
    return this.formBuilder.group({
      country: [{value: this.formValues.country ? this.formValues.country :
        this.investmentAccountService.getCountryFromNationalityCode(this.formValues.nationalityCode),
        disabled: this.investmentAccountService.isDisabled('country')}, Validators.required],
      address1: [{value: this.formValues.address1, disabled: this.investmentAccountService.isDisabled('address1')},
        [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      address2: [{value: this.formValues.address2,
        disabled: this.investmentAccountService.isDisabled('address2')}, [Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      city: [this.formValues.city, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      state: [this.formValues.state, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      zipCode: [{value: this.formValues.zipCode, disabled: this.investmentAccountService.isDisabled('zipCode')},
        [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      isMailingAddressSame: [this.formValues.isMailingAddressSame]
    });
  }

  addOrRemoveMailingAddress() {
    if (this.addressForm.controls.isMailingAddressSame.value !== true) {
      if (this.isUserNationalitySingapore) { // Singapore
        this.addressForm.addControl('mailingAddress', this.formBuilder.group({
          mailCountry: [{value:
            this.investmentAccountService.getCountryFromNationalityCode(INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE),
            disabled: this.investmentAccountService.isDisabled('mailCountry')}, Validators.required],
          mailPostalCode: [{value: this.formValues.mailPostalCode,
            disabled: this.investmentAccountService.isDisabled('mailPostalCode')}, Validators.required],
          mailAddress1: [{value: this.formValues.mailAddress1, disabled: this.investmentAccountService.isDisabled('mailAddress1')},
            [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          mailAddress2: [{value: this.formValues.mailAddress2, disabled: this.investmentAccountService.isDisabled('mailAddress2')},
            [Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          mailFloor: [{value: this.formValues.mailFloor,
            disabled: this.investmentAccountService.isDisabled('mailFloor')}, Validators.required],
          mailUnitNo: [{value: this.formValues.mailUnitNo,
            disabled: this.investmentAccountService.isDisabled('mailUnitNo')}, Validators.required]
        }));
      } else { // Other Countries
        this.addressForm.addControl('mailingAddress', this.formBuilder.group({
          mailCountry: [{value: this.formValues.mailCountry ? this.formValues.mailCountry :
            this.investmentAccountService.getCountryFromNationalityCode(this.formValues.nationalityCode),
            disabled: this.investmentAccountService.isDisabled('mailCountry')}, Validators.required],
          mailAddress1: [{value: this.formValues.mailAddress1, disabled: this.investmentAccountService.isDisabled('mailAddress1')},
            [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          mailAddress2: [{value: this.formValues.mailAddress2, disabled: this.investmentAccountService.isDisabled('mailAddress2')},
            [Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          mailCity: [{value: this.formValues.mailCity, disabled: this.investmentAccountService.isDisabled('mailCity')},
            [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
          mailState: [{value: this.formValues.mailState, disabled: this.investmentAccountService.isDisabled('mailState')},
            [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
          mailZipCode: [{value: this.formValues.mailZipCode, disabled: this.investmentAccountService.isDisabled('mailZipCode')},
            [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
        }));
      }
    } else {
      this.addressForm.removeControl('mailingAddress');
    }
  }

  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  setDropDownValue(key, value) {
    this.addressForm.controls[key].setValue(value);
  }
  setNestedDropDownValue(key, value, nestedKey) {
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
            const address1 = response.Placemark[0].AddressDetails.Country.Thoroughfare.ThoroughfareName;
            const address2 = response.Placemark[0].AddressDetails.Country.AddressLine;
            address1Control.setValue(address1);
            address2Control.setValue(address2);
          } else {
            const ref = this.modal.open(ErrorModalComponent, { centered: true });
            ref.componentInstance.errorTitle = this.translate.instant('RESIDENTIAL_ADDRESS.POSTALCODE_NOT_FOUND_ERROR.TITLE');
            ref.componentInstance.errorMessage = this.translate.instant('RESIDENTIAL_ADDRESS.POSTALCODE_NOT_FOUND_ERROR.MESSAGE');
            address1Control.setValue('');
            address2Control.setValue('');
          }
        }
      },
      (err) => {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE');
        ref.componentInstance.errorMessage = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC');
      });
    } else {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.translate.instant('RESIDENTIAL_ADDRESS.POSTALCODE_EMPTY_ERROR.TITLE');
      ref.componentInstance.errorMessage = this.translate.instant('RESIDENTIAL_ADDRESS.POSTALCODE_EMPTY_ERROR.MESSAGE');
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
      this.investmentAccountService.setResidentialAddressFormData(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS]);
    }
  }

  isDisabled(field) {
    return this.investmentAccountService.isDisabled(field);
  }
}
