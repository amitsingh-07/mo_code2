import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

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
  defaultThumb;
  showLoader;
  loaderTitle;
  loaderDesc;

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
      this.defaultThumb = INVESTMENT_ACCOUNT_CONFIG.upload_documents.default_thumb;
      this.showLoader = false;
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
      nricFrontImage: [this.formValues.nricFrontImage, Validators.required],
      nricBackImage: [this.formValues.nricBackImage, Validators.required],
      mailAdressProof: [this.formValues.mailAdressProof, Validators.required]
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
    if (!elem.files.length) {
      elem.click();
    }
  }

  setThumbnail(fileElem, thumbElem) {
    const file: File = fileElem.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      thumbElem.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      thumbElem.src = window.location.origin + '/assets/images/' + this.defaultThumb;
    }
  }

  getFileName(fileElem) {
    let fileName = '';
    if (fileElem.files.length) {
      fileName = fileElem.files[0].name;
    }
    return fileName;
  }

  clearFileSelection(control, event, thumbElem) {
    event.stopPropagation();
    control.setValue('');
    debugger;
    if (thumbElem) {
      thumbElem.src = window.location.origin + '/assets/images/' + this.defaultThumb;
    }
  }

  showProofOfMailingDetails() {
    const errorTitle = this.translate.instant('UPLOAD_DOCUMENTS.MAILING_ADDRESS_PROOF.MODAL.TITLE');
    const errorDesc = this.translate.instant('UPLOAD_DOCUMENTS.MAILING_ADDRESS_PROOF.MODAL.MESSAGE');
    this.showModal(errorTitle, errorDesc);
  }

  showModal(errorTitle, errorDesc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorDescription = errorDesc;
  }

  goToNext(form) {
    this.showLoader = true;
    this.loaderTitle = 'Uploading';
    this.loaderDesc = 'Please be patient, upload may take a few minutes.';
    setTimeout(() => {
      this.showLoader = false;
    }, 5000);

  }

}
