import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-residential-address',
  templateUrl: './residential-address.component.html',
  styleUrls: ['./residential-address.component.scss']
})
export class ResidentialAddressComponent implements OnInit {
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
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.isUserNationalitySingapore = this.investmentAccountService.isUserNationalitySingapore();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.addressForm = this.isUserNationalitySingapore ? this.buildFormForSingapore() : this.buildFormForOtherCountry();
    this.addOrRemoveMailingAddress();
  }

  buildFormForSingapore(): FormGroup {
    return this.formBuilder.group({
      country: [this.formValues.nationality.country, Validators.required],
      postalCode: [this.formValues.postalCode, [Validators.required, Validators.pattern(RegexConstants.SixDigitNumber)]],
      address1: [this.formValues.address1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      address2: [this.formValues.address2],
      unitNo: [this.formValues.unitNo, Validators.required],
      isMailingAddressSame: [this.formValues.isMailingAddressSame]
    });
  }

  buildFormForOtherCountry(): FormGroup {
    return this.formBuilder.group({
      country: [this.formValues.nationality.country ? this.formValues.nationality.country : this.countries[0], Validators.required],
      address1: [this.formValues.address1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      address2: [this.formValues.address2],
      city: [this.formValues.city, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      state: [this.formValues.state, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
      zipCode: [this.formValues.zipCode, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      isMailingAddressSame: [this.formValues.isMailingAddressSame]
    });
  }

  addOrRemoveMailingAddress() {
    if (this.addressForm.controls.isMailingAddressSame.value !== true) {
      if (this.isUserNationalitySingapore) { // Singapore
        this.addressForm.addControl('mailingAddress', this.formBuilder.group({
          mailCountry: [this.formValues.nationality.country, Validators.required],
          mailPostalCode: [this.formValues.mailPostalCode, Validators.required],
          mailAddress1: [this.formValues.mailAddress1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          mailAddress2: [this.formValues.mailAddress2],
          mailUnitNo: [this.formValues.mailUnitNo, Validators.required]
        }));
      } else { // Other Countries
        this.addressForm.addControl('mailingAddress', this.formBuilder.group({
          mailCountry: [this.formValues.nationality.country ? this.formValues.nationality.country : this.countries[0], Validators.required],
          mailAddress1: [this.formValues.mailAddress1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
          mailAddress2: [this.formValues.mailAddress2],
          mailCity: [this.formValues.mailCity, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
          mailState: [this.formValues.mailState, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]],
          mailZipCode: [this.formValues.mailZipCode, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
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
    this.investmentAccountService.getAddressUsingPostalCode(postalCode).subscribe((response: any) => {
      if (response) {
        if (response.Status.code === 200) {
          const address1 = response.Placemark[0].AddressDetails.Country.Thoroughfare.ThoroughfareName;
          const address2 = response.Placemark[0].AddressDetails.Country.AddressLine;
          address1Control.setValue(address1);
          address2Control.setValue(address2);
        } else {
          const ref = this.modal.open(ErrorModalComponent, { centered: true });
          ref.componentInstance.errorTitle = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE');
          ref.componentInstance.errorMessage = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC');
          address1Control.setValue('');
          address2Control.setValue('');
        }
      }
    });
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

}
