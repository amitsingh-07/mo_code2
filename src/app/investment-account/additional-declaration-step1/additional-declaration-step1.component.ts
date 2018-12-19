import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-additional-declaration-step1',
  templateUrl: './additional-declaration-step1.component.html',
  styleUrls: ['./additional-declaration-step1.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalDeclarationStep1Component implements OnInit {
  occupationList;
  pageTitle: string;
  translator: any;
  addInfoForm: FormGroup;
  addInfoFormValues: any;
  countries: any;
  isUserNationalitySingapore;

  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('ADDITIONAL_DECLARATION.TITLE');
      this.translator = this.translate.instant('PERSONAL_DECLARATION');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.getOccupationList();
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.addInfoFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.addInfoForm = this.buildForm();
    this.addOrRemoveAdditionalControls(this.addInfoForm.get('pepCountry').value);
    this.observeCountryChange();
  }

  buildForm() {
    return new FormGroup({
      fName: new FormControl(this.addInfoFormValues.fName, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]),
      lName: new FormControl(this.addInfoFormValues.lName, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]),
      cName: new FormControl(this.addInfoFormValues.cName, Validators.required),
      pepoccupation: new FormControl(this.addInfoFormValues.pepoccupation, Validators.required),

      pepCountry: new FormControl(this.getDefaultCountry(), Validators.required),
      pepAddress1: new FormControl(this.addInfoFormValues.pepAddress1,
        [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]),
      pepAddress2: new FormControl(this.addInfoFormValues.pepAddress2, [Validators.pattern(RegexConstants.AlphanumericWithSpaces)])
    });
  }

  addOrRemoveAdditionalControls(country) {
    const isSingapore = this.investmentAccountService.isCountrySingapore(country);
    if (isSingapore) {
      this.addInfoForm.addControl('pepPostalCode', new FormControl(this.addInfoFormValues.pepPostalCode,
        [Validators.required , Validators.pattern(RegexConstants.NumericOnly)]));
      this.addInfoForm.addControl('pepFloor', new FormControl(
        this.addInfoFormValues.pepFloor, Validators.required));
      this.addInfoForm.addControl('pepUnitNo', new FormControl(this.addInfoFormValues.pepUnitNo,
        [Validators.required, Validators.pattern(RegexConstants.SymbolNumber)]));

      this.addInfoForm.removeControl('pepCity');
      this.addInfoForm.removeControl('pepState');
      this.addInfoForm.removeControl('pepZipCode');
    } else {
      this.addInfoForm.addControl('pepCity', new FormControl(
        this.addInfoFormValues.pepCity, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]));
      this.addInfoForm.addControl('pepState', new FormControl(
        this.addInfoFormValues.pepState, [Validators.required, Validators.pattern(RegexConstants.OnlyAlphaWithoutLimit)]));
      this.addInfoForm.addControl('pepZipCode', new FormControl(
        this.addInfoFormValues.pepZipCode, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]));

      this.addInfoForm.removeControl('pepPostalCode');
      this.addInfoForm.removeControl('pepFloor');
      this.addInfoForm.removeControl('pepUnitNo');
    }
  }

  getDefaultCountry() {
    let defaultCountry;
    if (this.isUserNationalitySingapore) {
      defaultCountry = this.investmentAccountService.getCountryFromNationalityCode(INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_NATIONALITY_CODE);
    } else {
      if (this.addInfoFormValues.pepCountry) {
        defaultCountry = this.addInfoFormValues.pepCountry;
      } else {
        defaultCountry = this.investmentAccountService.getCountryFromNationalityCode(this.addInfoFormValues.nationalityCode);
      }
    }
    return defaultCountry;
  }

  observeCountryChange() {
    this.addInfoForm.get('pepCountry').valueChanges.subscribe((value) => {
      this.addOrRemoveAdditionalControls(value);
    });
  }

  getOccupationList() {
    this.investmentAccountService.getOccupationList().subscribe((data) => {
      this.occupationList = data.objectList;
    });
  }
  setOccupationValue(value) {
    this.addInfoForm.controls.pepoccupation.setValue(value);
  }

  setDropDownValue(key, value) {
    this.addInfoForm.controls[key].setValue(value);
  }
  showHelpModalPep() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.PEP;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.translator.PEP_DESC;
    return false;
  }
  retrieveAddress(postalCode, address1Control, address2Control) {
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
            ref.componentInstance.errorTitle = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_TITLE');
            ref.componentInstance.errorMessage = this.translate.instant('RESIDENTIAL_ADDRESS.ERROR.POSTAL_CODE_DESC');
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
  }
  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
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
      this.investmentAccountService.setAdditionalInfoFormData(form.getRawValue());
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2]);
    }
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
}
