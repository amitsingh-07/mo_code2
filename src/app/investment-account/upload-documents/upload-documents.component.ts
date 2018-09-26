import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss']
})
export class UploadDocumentsComponent implements OnInit {

  uploadForm: FormGroup;
  pageTitle: string;
  formValues;
  countries;
  isUserNationalitySingapore;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPLOAD_DOCUMENTS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  setPageTitle(title: string) {
    this.headerService.setPageTitle(title);
  }

  ngOnInit() {
    this.isUserNationalitySingapore = this.investmentAccountService.isUserNationalitySingapore();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.uploadForm = this.isUserNationalitySingapore ? this.buildFormForSingapore() : this.buildFormForOtherCountry();
  }

  buildFormForSingapore(): FormGroup {
    return this.formBuilder.group({
      nricFrontImage: [this.formValues.nationality.country, Validators.required],
      nricBackImage: [this.formValues.postalCode, Validators.required],
      proofOfAddress: [this.formValues.address1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]]
    });
  }

  buildFormForOtherCountry(): FormGroup {
    return this.formBuilder.group({
      passportImage: [this.formValues.nationality.country ? this.formValues.nationality.country : this.countries[0], Validators.required],
      proofOfAddress: [this.formValues.address1, [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSpaces)]],
      proofOf: [this.formValues.address2],
      city: [this.formValues.city, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      state: [this.formValues.state, [Validators.required, Validators.pattern(RegexConstants.OnlyAlpha)]],
      zipCode: [this.formValues.zipCode, [Validators.required, Validators.pattern(RegexConstants.Alphanumeric)]],
      isMailingAddressSame: [this.formValues.isMailingAddressSame]
    });
  }

  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  setNestedDropDownValue(key, value, nestedKey) {
    this.uploadForm.controls[nestedKey]['controls'][key].setValue(value);
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


  selectFile() {

  }
}
