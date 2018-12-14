import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.scss']
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
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public readonly translate: TranslateService) {
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
    this.navbarService.setNavbarMode(2);
    this.getReasonList();
    this.taxInfoFormValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.countries = this.investmentAccountService.getCountriesFormData();
    this.taxInfoForm = this.formBuilder.group({
      addTax: this.formBuilder.array([this.createForm()])
    });
    this.singPlaceHolder = '';
   //this.isTinNumberAvailChanged(this.taxInfoForm.controls.radioTin.value);
  //this.isTinNumberAvailChanged( this.taxInfoForm.controls['addTax'].controls.radioTin.value);
  
  }

  getReasonList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.noTinReasonlist = data.objectList.noTinReason;
    });
  }

  selectCountry(country , taxInfoItem) {
    taxInfoItem.controls.taxCountry.setValue(country);
    if ( taxInfoItem.controls.tinNumberText) {
      if (country.countryCode === 'SG') {
        this.singPlaceHolder =  'E.g S9840139C';
        } else {
          this.singPlaceHolder =  '';
        }
    }
    //this.taxInfoForm.controls.taxCountry.setValue(country);
  }

  selectReason(reasonObj ,  taxInfoItem) {
    taxInfoItem.controls.reasonDropdown['controls']['noTinReason'].setValue(reasonObj);
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

  isTinNumberAvailChanged(flag ,  formgroup) {
    if (flag) {
      formgroup.addControl('tinNumberText', this.formBuilder.group({
        tinNumber: new FormControl(this.taxInfoFormValues.tinNumber, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)])
      }));
      formgroup.removeControl('reasonDropdown');
    } else {
      formgroup.addControl('reasonDropdown', this.formBuilder.group({
        noTinReason: new FormControl(this.taxInfoFormValues.noTinReason, Validators.required)
      }));
      formgroup.removeControl('tinNumberText');
    }
  }
  setDropDownValue(key, value) {
    this.taxInfoForm.controls[key].setValue(value);
  }
  getInlineErrorStatus(control) {
    //return (!control.pristine && !control.valid);
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
      this.investmentAccountService.setTaxInfoFormData(form.getRawValue());
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_DECLARATION]);
    }
  }
  createForm() {
    let formGroup;
    formGroup = this.formBuilder.group({
    radioTin: new FormControl(this.taxInfoFormValues.radioTin, Validators.required),
    taxCountry: new FormControl(this.taxInfoFormValues.taxCountry, Validators.required),
  });
    return formGroup;
  }
  addTaxForm(): void {
    const control =  this.taxInfoForm.controls['addTax'] as FormArray;
    control.push(this.createForm());
  }
  removeTaxForm(formGroup , index): void {
    const control =  formGroup.controls['addTax'] as FormArray;
    control.removeAt(index);
  }
  getPlaceholder(nationalityCode) {
    if (nationalityCode === 'SG') {
      return true;
      } else {
        return false;
      }
  }

}
