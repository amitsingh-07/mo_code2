import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
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
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('RESIDENTIAL_ADDRESS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.isUserNationalitySingapore = this.investmentAccountService.isUserNationalitySingapore();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.addressForm = this.isUserNationalitySingapore ? this.buildFormForSingapore() : this.buildFormForOtherCountry();
    this.addOrRemoveMailingAddress();
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  setDropDownValue(key, value) {
    this.addressForm.controls[key].setValue(value);
  }
  setNestedDropDownValue(key, value, nestedKey) {
    this.addressForm.controls[nestedKey]['controls'][key].setValue(value);
  }

  addOrRemoveMailingAddress() {
    if (this.addressForm.controls.isMailingAddressSame.value !== true) {
      if (this.isUserNationalitySingapore) { // Singapore
        this.addressForm.addControl('mailingAddress', this.formBuilder.group({
          mailCountry: [this.formValues.mailCountry ? this.formValues.mailCountry : this.countries[0], Validators.required],
          mailPostalCode: [this.formValues.mailPostalCode, Validators.required],
          mailAddress1: [this.formValues.mailAddress1, Validators.required],
          mailAddress2: [this.formValues.mailAddress2],
          mailUnitNo: [this.formValues.mailUnitNo, Validators.required]
        }));
      } else { // Other Countries
        this.addressForm.addControl('mailingAddress', this.formBuilder.group({
          mailCountry: [this.formValues.mailCountry ? this.formValues.mailCountry : this.countries[0], Validators.required],
          mailAddress1: [this.formValues.mailAddress1, Validators.required],
          mailAddress2: [this.formValues.mailAddress2],
          mailCity: [this.formValues.mailCity, Validators.required],
          mailState: [this.formValues.mailState, Validators.required],
          mailZipCode: [this.formValues.mailZipCode, Validators.required],
        }));
      }
    } else {
      this.addressForm.removeControl('mailingAddress');
    }
  }

  goToNext(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      return false;
    } else {
      this.investmentAccountService.setResidentialAddressFormData(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
    }
  }

  buildFormForSingapore(): FormGroup {
    return this.formBuilder.group({
      country: [this.formValues.country ? this.formValues.country : this.countries[0] , Validators.required],
      postalCode: [this.formValues.postalCode, Validators.required],
      address1: [this.formValues.address1, Validators.required],
      address2: [this.formValues.address2],
      unitNo: [this.formValues.unitNo, Validators.required],
      isMailingAddressSame: [this.formValues.isMailingAddressSame, Validators.required],

    });
  }

  buildFormForOtherCountry(): FormGroup {
    return this.formBuilder.group({
      country: [this.formValues.country ? this.formValues.country : this.countries[0], Validators.required],
      address1: [this.formValues.address1, Validators.required],
      address2: [this.formValues.address2],
      city: [this.formValues.city, Validators.required],
      state: [this.formValues.state, Validators.required],
      zipCode: [this.formValues.zipCode, Validators.required],
      isMailingAddressSame: [this.formValues.isMailingAddressSame, Validators.required]
    });
  }

}
