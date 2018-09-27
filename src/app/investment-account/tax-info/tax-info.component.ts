import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { IPageComponent } from './../../shared/interfaces/page-component.interface';
@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.scss']
})
export class TaxInfoComponent implements OnInit {
  taxInfoForm: FormGroup;
  nationalitylist: any;
  taxInfoFormValues: any;
  nationalityObj: any;
  nationality: any;
  country: any;
  reason: any;
  constructor(
    public headerService: HeaderService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
    });
  }

  ngOnInit() {
    this.country = 'Select Country' ;
    this.reason = 'Select' ;
    this.getNationalityList();
    this.taxInfoFormValues = this.investmentAccountService.getTaxInfo();
    this.taxInfoForm = new FormGroup({
      radioTin: new FormControl (this.taxInfoFormValues.haveTin, Validators.required),
     // reason: new FormControl (this.taxInfoFormValues.reason, Validators.required),
      tinNumber : new FormControl (this.taxInfoFormValues.tinNumber, Validators.required)
      });
  }
  getNationalityList() {
    this.investmentAccountService.getNationalityList().subscribe((data) => {
        this.nationalitylist = data.objectList;
        console.log(this.nationalitylist);
    });

}
selectCountry(nationalityObj) {
  this.nationalityObj = nationalityObj;
  this.nationality = this.nationalityObj.nationality;
  this.country = this.nationalityObj.country;
}
selectReason(nationalityObj) {
  this.reason = this.nationalityObj.country;
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
   // this.investmentAccountService.setResidentialAddressFormData(form.value);
   // this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS]);
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
  ref.componentInstance.errorTitle = 'Taxpayer Identification No.';
  // tslint:disable-next-line:max-line-length
  ref.componentInstance.errorDescription = 'This is a personal tax account number that has been assigned to you by the country that you are a tax resident of. For more information, please refer to www.oecd.org.For Singapore Tax Residents, please note that your NRIC/FIN No. is your Taxpayer Identification No. ';
  return false;
}

}
