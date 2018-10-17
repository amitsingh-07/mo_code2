import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  nationalitylist: any;
  noTinReasonlist: any;
  taxInfoFormValues: any;
  nationalityObj: any;
  nationality: any;
  country: any;
  reason: any;
  pageTitle: string;
  translator: any;
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
    this.country = 'Select Country' ;
    this.reason = 'Select' ;
    this.getNationalityList();
    this.getReasonList();
    this.taxInfoFormValues = this.investmentAccountService.getTaxInfo();
    this.taxInfoForm = new FormGroup({
      radioTin: new FormControl (this.taxInfoFormValues.haveTin, Validators.required),
      taxCountry: new FormControl (this.taxInfoFormValues.country, Validators.required),
      });
  }
  getNationalityList() {
    this.investmentAccountService.getNationalityList().subscribe((data) => {
        this.nationalitylist = data.objectList;
        console.log(this.nationalitylist);
    });
  }
  getReasonList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
        this.noTinReasonlist = data.objectList.noTinReason;
        console.log('Got Something' + this.noTinReasonlist);
    });
  }

selectCountry(nationalityObj) {
  this.nationalityObj = nationalityObj;
  this.nationality = this.nationalityObj.nationality;
  this.country = this.nationalityObj.country;
  this.taxInfoForm.controls['taxCountry'].setValue(this.country);
}
selectReason(reasonObj) {
  this.reason = reasonObj.name;
  this.taxInfoForm.controls.reasonDropdown['controls']['noTinReason'].setValue( this.reason);
}
goToNext(form) {
  if (!form.valid) {
    this.markAllFieldsDirty(form);
    const error = this.investmentAccountService.getFormErrorList(form);
    console.log(error);
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = error.title;
    ref.componentInstance.errorMessageList = error.errorMessages;
    return false;
  } else {
    this.investmentAccountService.setTaxInfoFormData(form.value);
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_DECLARATION]);
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
showHelpModal() {
  const ref = this.modal.open(ErrorModalComponent, { centered: true });
  ref.componentInstance.errorTitle = this.translator.TAX_MODEL_TITLE;
  // tslint:disable-next-line:max-line-length
  ref.componentInstance.errorDescription =  this.translator.TAX_MODEL_DESC;
  return false;
}
yesClick() {
  this.taxInfoForm.addControl('tinNumberText', this.formBuilder.group({
    tinNumber : new FormControl (this.taxInfoFormValues.Tin, Validators.required)
  }));
  this.taxInfoForm.removeControl('reasonDropdown');
}
noClick() {
  this.taxInfoForm.addControl('reasonDropdown', this.formBuilder.group({
    noTinReason : new FormControl (this.taxInfoFormValues.noTinReason, Validators.required)
  }));
  this.taxInfoForm.removeControl('tinNumberText');
}
setDropDownValue(key, value) {
  this.taxInfoForm.controls[key].setValue(value);
}

}