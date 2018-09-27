import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    this.isUserNationalitySingapore = true;
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.uploadForm = this.isUserNationalitySingapore ? this.buildFormForSingapore() : this.buildFormForOtherCountry();
  }

  buildFormForSingapore(): FormGroup {
    return this.formBuilder.group({
      nricFrontImage: [this.formValues.nricFrontImage],
      nricBackImage: [this.formValues.nricBackImage],
      mailAdressProof: [this.formValues.mailAdressProof]
    });
  }

  buildFormForOtherCountry(): FormGroup {
    return this.formBuilder.group({
      passportImage: [this.formValues.passportImage],
      resAddressProof: [this.formValues.resAddressProof],
      mailAdressProof: [this.formValues.mailAdressProof]
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

  openFileDialog(elem) {
    elem.click();
  }

  setThumbnail(fileElem, thumbElem) {
    const file: File = fileElem.target.files[0];
    const reader: FileReader  = new FileReader();
    reader.onloadend = () => {
      thumbElem.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      thumbElem.src = '';
    }
  }

  getFileName(fileElem) {
    return fileElem.files[0].name;
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
    }
  }

}
