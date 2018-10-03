import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
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
      passportImage: [this.formValues.passportImage, Validators.required],
      resAddressProof: [this.formValues.resAddressProof, Validators.required],
      mailAdressProof: [this.formValues.mailAdressProof, Validators.required]
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

  fileSelected(controlname, fileElem, thumbElem?) {
    const selectedFile: File = fileElem.target.files[0];
    const fileSize: number = selectedFile.size;
    if (fileSize <= 10485760) {
      const formData: FormData = new FormData();
      switch (controlname) {
        case 'NRIC_FRONT': {
          formData.append('nricFront', selectedFile);
          break;
        }
        case 'NRIC_BACK': {
          formData.append('nricBack', selectedFile);
          break;
        }
        case 'MAILING_ADDRESS': {
          formData.append('mailingAddressProof', selectedFile);
          break;
        }
        case 'RESIDENTIAL_ADDRESS': {
          formData.append('residentialAddressProof', selectedFile);
          break;
        }
        case 'PASSPORT': {
          formData.append('passport', selectedFile);
          break;
        }
      }
      this.uploadDocument(formData, selectedFile, thumbElem);
    }
  }

  uploadDocument(formData, selectedFile, thumbElem?) {
    this.showUploadLoader();
    this.investmentAccountService.uploadDocument(formData).subscribe((data) => {
      if (data) {
        this.hideUploadLoader();
        if (thumbElem) {
          this.setThumbnail(thumbElem, selectedFile);
        }
      }
    });
  }

  setThumbnail(thumbElem, file) {
    // Set Thumbnail
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

  clearFileSelection(control, event, thumbElem?) {
    event.stopPropagation();
    control.setValue('');
    if (thumbElem) {
      thumbElem.src = window.location.origin + '/assets/images/' + this.defaultThumb;
    }
  }

  showProofOfMailingDetails() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    const errorTitle = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.MAILING_ADDRESS_PROOF.TITLE');
    const errorDesc = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.MAILING_ADDRESS_PROOF.MESSAGE');
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorDescription = errorDesc;
  }

  goToNext(form) {
    if (!form.valid) {
      const errorTitle = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.TITLE');
      const errorMessage = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.MESSAGE');
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorMessageHTML = errorMessage;
      ref.componentInstance.primaryActionLabel = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.CONFIRM_PROCEED');
      ref.componentInstance.primaryAction.subscribe(($e) => {
        this.proceed(form);
      });
    } else {
      this.proceed(form);
    }
  }

  proceed(form) {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS]);
  }

  showUploadLoader() {
    this.showLoader = true;
    this.loaderTitle = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.TITLE');
    this.loaderDesc = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.MESSAGE');
  }

  hideUploadLoader() {
    this.showLoader = false;
  }

}
