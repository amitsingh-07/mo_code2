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
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { InvestmentAccountCommon } from '../investment-account-common';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONFIG } from '../investment-account.constant';

@Component({
  selector: 'app-upload-document-bo',
  templateUrl: './upload-document-bo.component.html',
  styleUrls: ['./upload-document-bo.component.scss']
})
export class UploadDocumentBOComponent implements OnInit {
  uploadForm: FormGroup;
  pageTitle: string;
  formData: FormData = new FormData();
  investmentAccountCommon: InvestmentAccountCommon = new InvestmentAccountCommon();
  defaultThumb;
  showLoader;
  formValues;
  loaderTitle;
  loaderDesc;
  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
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
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.uploadForm = new FormGroup({
      passportImage: new FormControl (this.formValues.passportImageBO, Validators.required),
      });
  }
  openFileDialog(elem) {
    if (!elem.files.length) {
      elem.click();
    }
  }

  fileSelected(control, controlname, fileElem, thumbElem?) {
    const response = this.investmentAccountCommon.fileSelected(this.formData , control, controlname, fileElem, thumbElem);
    if (!response.validFileSize) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      const errorTitle = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.FILE_SIZE_EXCEEDED.TITLE');
      const errorDesc = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.FILE_SIZE_EXCEEDED.MESSAGE');
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorDescription = errorDesc;
      control.setValue('');
    } else if (!response.validFileType) {
        const ref = this.modal.open(ErrorModalComponent, { centered: true });
        const errorTitle = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.FILE_TYPE_MISMATCH.TITLE');
        const errorDesc = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.FILE_TYPE_MISMATCH.MESSAGE');
        ref.componentInstance.errorTitle = errorTitle;
        ref.componentInstance.errorDescription = errorDesc;
        control.setValue('');
    }
  }

  getPayloadKey(controlname) {
    const payloadKey = this.investmentAccountCommon.getPayloadKey(controlname);
    return payloadKey;
  }

  uploadDocument() {
    this.showUploadLoader();
    this.investmentAccountService.uploadDocumentBO(this.formData).subscribe((data) => {
      if (data) {
        this.hideUploadLoader();
        this.redirectToNextPage();
      }
    });
  }

  setThumbnail(thumbElem, file) {
    // Set Thumbnail
    this.investmentAccountCommon.setThumbnail(thumbElem, file);
  }

  getFileName(fileElem) {
    const fileName = this.investmentAccountCommon.getFileName(fileElem);
    return fileName;
  }

  clearFileSelection(control, event, thumbElem?) {
    this.investmentAccountCommon.clearFileSelection(control, event, thumbElem);
  }
  showUploadLoader() {
    this.showLoader = true;
    this.loaderTitle = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.TITLE');
    this.loaderDesc = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.MESSAGE');
  }

  hideUploadLoader() {
    this.showLoader = false;
  }
  goToNext(form) {
    if (!form.valid) {
      // Add an error message saying that need to uplopad passport
      const errorTitle = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.TITLE');
      const errorMessage = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.MESSAGE');
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorMessageHTML = errorMessage;
      ref.componentInstance.primaryActionLabel = this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.CONFIRM_PROCEED');
      ref.componentInstance.primaryAction.subscribe(() => {
        this.redirectToNextPage();
      });
    } else {
      this.proceed(form);
    }
  }

  proceed(form) {
    this.uploadDocument();
  }

  redirectToNextPage() {
    this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ACKNOWLEDGEMENT]);
  }

}
