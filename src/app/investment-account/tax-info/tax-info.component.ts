import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { InvestmentAccountCommon } from '../investment-account-common';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaxInfoComponent implements OnInit {
  taxInfoForm: FormGroup;
  countries: any;
  noTinReasonlist: any;
  taxInfoFormValues: any;
  nationalityObj: any;
  nationality: any;
  country: any;
  reason: any;
  pageTitle: string;
  translator: any;
  addTax: FormArray;
  singPlaceHolder;
  selectedCountries: any;
  formCount: number;
  investmentAccountCommon: InvestmentAccountCommon = new InvestmentAccountCommon();
  showNricHint = false;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('TAX_INFO.TITLE');
      this.translator = this.translate.instant('TAX_INFO');
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
    this.getReasonList();
    this.taxInfoFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.taxInfoForm = this.formBuilder.group({
      addTax: this.formBuilder.array([])
    });
    if (this.taxInfoFormValues.taxObj) {
      // Existing Value
      this.taxInfoFormValues.taxObj.addTax.map((item) => {
        this.addTaxForm(item);
      });
    } else {
      // New form
      this.addTaxForm(null);
    }
    this.singPlaceHolder = '';
    this.investmentAccountService.loadInvestmentAccountRoadmap();
  }

  addTaxForm(data): void {
    const control = this.taxInfoForm.controls['addTax'] as FormArray;
    const newFormGroup = this.createForm(data);
    this.showHint(newFormGroup.controls.taxCountry.value.countryCode, newFormGroup);
    control.push(newFormGroup);
    if (data) {
      this.isTinNumberAvailChanged(data.radioTin, newFormGroup, data);
    }
    this.formCount = this.taxInfoForm.controls.addTax.value.length;
  }

  createForm(data) {
    let formGroup;
    formGroup = this.formBuilder.group({
      radioTin: new FormControl(data ? data.radioTin : '', Validators.required),
      taxCountry: new FormControl(data ? data.taxCountry : '', Validators.required),
      showTinHint: new FormControl(false)
    });
    return formGroup;
  }

  getReasonList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.noTinReasonlist = data.objectList.noTinReason;
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  selectCountry(country, taxInfoItem) {
    taxInfoItem.controls.taxCountry.setValue(country);
    if (taxInfoItem.controls.tinNumber) {
      taxInfoItem.controls.tinNumber.updateValueAndValidity();
      if (country.countryCode === 'SG') {
        this.singPlaceHolder = 'e.g S****5678C';
      } else {
        this.singPlaceHolder = '';
      }
    }
    this.showHint(country.countryCode, taxInfoItem);
  }

  /*
  * Method to show TIN hint based on country code if singapore
  */
  showHint(countryCode, taxInfoItem) {
    this.showNricHint = countryCode === INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_COUNTRY_CODE;
    taxInfoItem.controls.showTinHint.setValue(this.showNricHint);
  }

  selectReason(reasonObj, taxInfoItem) {
    taxInfoItem.controls.noTinReason.setValue(reasonObj);
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
  showHelpModal() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.TAX_MODEL_TITLE;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.translator.TAX_MODEL_DESC;
    return false;
  }

  isTinNumberAvailChanged(flag, formgroup, data) {
    if (flag) {
      formgroup.addControl(
        'tinNumber',
        new FormControl(data ? data.tinNumber.toUpperCase() : '', [
          Validators.required,
          this.validateTin.bind(this)
        ])
      );
      formgroup.removeControl('noTinReason');
    } else {
      formgroup.addControl(
        'noTinReason',
        new FormControl(data ? data.noTinReason : '', Validators.required)
      );
      formgroup.removeControl('tinNumber');
    }
  }
  setDropDownValue(key, value) {
    this.taxInfoForm.controls[key].setValue(value);
  }
  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  goToNext(form) {
    const taxObj = form.getRawValue();
    const selCountryArr = [];
    if (taxObj) {
      // Existing Value
      taxObj.addTax.map((item) => {
        selCountryArr.push(item.taxCountry.countryCode);
      });
    }
    if (this.hasDuplicates(selCountryArr)) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = this.translate.instant('TAX_INFO.COUNTRY_ERROR');
      ref.componentInstance.errorMessage = this.translate.instant(
        'TAX_INFO.COUNTRY_ERROR_MSG'
      );
      return false;
    } else {
      if (!form.valid) {
        this.markAllFieldsDirty(form);
        const error = this.investmentAccountService.getFormErrorList(
          form.controls.addTax
        );
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        ref.componentInstance.errorTitle = error.title;
        ref.componentInstance.errorMessageList = error.errorMessages;
        return false;
      } else {
        this.investmentAccountService.setTaxInfoFormData(form.getRawValue());
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_DECLARATION]);
      }
    }
  }
  getBorder() {
    return this.taxInfoForm.get('addTax')['controls'].length > 1;
  }
  removeTaxForm(formGroup, index): void {
    const control = formGroup.controls['addTax'] as FormArray;
    control.removeAt(index);
    this.formCount = this.taxInfoForm.controls.addTax.value.length;
  }
  getPlaceholder(country, taxInfoItem) {
    if (taxInfoItem.controls.tinNumber && country) {
      if (country.countryCode === 'SG') {
        return 'e.g S****5678C';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  hasDuplicates(array) {
    return new Set(array).size !== array.length;
  }

  validateTin(control: AbstractControl) {
    const value = control.value;
    let isValidTin;
    if (value !== undefined) {
      if (control && control.parent && control.parent.controls && control.parent.controls['taxCountry'].value) {
        const countryCode = control.parent.controls['taxCountry'].value.countryCode;
        switch (countryCode) {
          case INVESTMENT_ACCOUNT_CONFIG.SINGAPORE_COUNTRY_CODE:
            isValidTin = this.investmentAccountCommon.isValidNric(value);
            break;
          case INVESTMENT_ACCOUNT_CONFIG.MALAYSIA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.MalaysianTin).test(value);
            break;
          case INVESTMENT_ACCOUNT_CONFIG.INDONESIA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.IndonesianTin).test(value);
            break;
          case INVESTMENT_ACCOUNT_CONFIG.INDIA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.IndianTin).test(value);
            break;
          case INVESTMENT_ACCOUNT_CONFIG.CHINA_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.ChineseTin).test(value);
            break;
          case INVESTMENT_ACCOUNT_CONFIG.PHILLIPINES_COUNTRY_CODE:
            isValidTin = new RegExp(RegexConstants.PhillipinesTin).test(value);
            break;
          default:
            isValidTin = true;
            break;
        }
      }
      if (!isValidTin) {
        return { tinFormat: true };
      }
    }
    return null;
  }
}
