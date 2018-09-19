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
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  setDropDownValue(key, value, i) {
    this.addressForm.controls[key].setValue(value);
  }

  goToNext(form) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      return false;
    } else {
      this.setValidatorsForMailingAddress();
      this.investmentAccountService.setResidentialAddressFormData(form.value);
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO]);
    }
  }

  setValidatorsForMailingAddress() {
    if (this.isUserNationalitySingapore) {
      if (this.addressForm.controls.isMailingAddressSame.value === true) {
        this.addressForm.controls.mailCountry.clearValidators();
        this.addressForm.controls.mailPostalCode.clearValidators();
        this.addressForm.controls.mailAddress1.clearValidators();
        this.addressForm.controls.mailAddress2.clearValidators();
        this.addressForm.controls.mailUnitNo.clearValidators();
      }
    } else {
      if (this.addressForm.controls.isMailingAddressSame.value === true) {
        this.addressForm.controls.mailCountry.clearValidators();
        this.addressForm.controls.mailAddress1.clearValidators();
        this.addressForm.controls.mailAddress2.clearValidators();
        this.addressForm.controls.mailCity.clearValidators();
        this.addressForm.controls.mailState.clearValidators();
        this.addressForm.controls.mailZipCode.clearValidators();
      }
    }
    this.addressForm.updateValueAndValidity();
  }

  buildFormForSingapore() {
    return this.formBuilder.group({
      country: [this.countries[0], Validators.required],
      postalCode: [this.formValues.postalCode, Validators.required],
      address1: [this.formValues.address1, Validators.required],
      address2: [this.formValues.address2],
      unitNo: [this.formValues.unitNo, Validators.required],
      isMailingAddressSame: [true, Validators.required],
      mailCountry: [this.countries[0], Validators.required],
      mailPostalCode: [this.formValues.postalCode, Validators.required],
      mailAddress1: [this.formValues.address1, Validators.required],
      mailAddress2: [this.formValues.address2],
      mailUnitNo: [this.formValues.unitNo, Validators.required],
    });
  }

  buildFormForOtherCountry() {
    return this.formBuilder.group({
      country: [this.countries[0], Validators.required],
      address1: [this.formValues.address1, Validators.required],
      address2: [this.formValues.address2],
      city: [this.formValues.city, Validators.required],
      state: [this.formValues.state, Validators.required],
      zipCode: [this.formValues.zipCode, Validators.required],
      isMailingAddressSame: [true, Validators.required],
      mailCountry: [this.countries[0], Validators.required],
      mailAddress1: [this.formValues.address1, Validators.required],
      mailAddress2: [this.formValues.address2],
      mailCity: [this.formValues.city, Validators.required],
      mailState: [this.formValues.state, Validators.required],
      mailZipCode: [this.formValues.zipCode, Validators.required],
    });
  }

}
