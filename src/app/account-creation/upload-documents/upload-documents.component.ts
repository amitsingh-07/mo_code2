import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { AccountCreationCommon } from '../account-creation-common';
import { ACCOUNT_CREATION_ROUTE_PATHS } from '../account-creation-routes.constants';
import { AccountCreationService } from '../account-creation-service';
import { ACCOUNT_CREATION_CONSTANTS } from '../account-creation.constant';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadDocumentsComponent implements OnInit {
  uploadForm: FormGroup;
  pageTitle: string;
  formValues: any;
  countries: any;
  isUserNationalitySingapore: any;
  defaultThumb: any;
  formData: FormData = new FormData();
  accountCreationCommon: AccountCreationCommon = new AccountCreationCommon();
  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public accountCreationService: AccountCreationService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPLOAD_DOCUMENTS.TITLE');
      this.setPageTitle(this.pageTitle);
      this.defaultThumb = ACCOUNT_CREATION_CONSTANTS.upload_documents.default_thumb;
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.isUserNationalitySingapore = this.accountCreationService.isSingaporeResident();
    this.formValues = this.accountCreationService.getInvestmentAccountFormData();
    this.uploadForm = this.isUserNationalitySingapore
      ? this.buildFormForSingapore()
      : this.buildFormForOtherCountry();
    this.addOrRemoveMailingAddressproof();
    this.accountCreationService.loadInvestmentAccountRoadmap(true);
  }

  buildFormForSingapore(): FormGroup {
    return this.formBuilder.group({
      nricFrontImage: [this.formValues.nricFrontImage, Validators.required],
      nricBackImage: [this.formValues.nricBackImage, Validators.required]
    });
  }

  buildFormForOtherCountry(): FormGroup {
    return this.formBuilder.group({
      passportImage: [this.formValues.passportImage, Validators.required],
      resAddressProof: [this.formValues.resAddressProof, Validators.required]
    });
  }
  addOrRemoveMailingAddressproof() {
    if (!this.formValues.isMailingAddressSame) {
      this.uploadForm.addControl(
        'mailAdressProof',
        new FormControl('', Validators.required)
      );
    }
  }
  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
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

  fileSelected(control, controlname, fileElem, thumbElem?) {
    const response = this.accountCreationCommon.fileSelected(
      this.formData,
      control,
      controlname,
      fileElem,
      thumbElem
    );
    if (!response.validFileSize) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      const errorTitle = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_SIZE_EXCEEDED.TITLE'
      );
      const errorDesc = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_SIZE_EXCEEDED.MESSAGE'
      );
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorDescription = errorDesc;
      control.setValue('');
    } else if (!response.validFileType) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      const errorTitle = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_TYPE_MISMATCH.TITLE'
      );
      const errorDesc = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_TYPE_MISMATCH.MESSAGE'
      );
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorDescription = errorDesc;
      control.setValue('');
    } else {
      const selFile = fileElem.target.files[0];
      control.setValue(selFile ? selFile.name : '');
    }
  }

  getPayloadKey(controlname) {
    return this.accountCreationCommon.getPayloadKey(controlname);
  }

  uploadDocument() {
    this.loaderService.showLoader({
      title: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.TITLE'),
      desc: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.MESSAGE')
    });
    this.accountCreationService.uploadDocument(this.formData).subscribe((response) => {
      this.loaderService.hideLoader();
      if (response) {
        this.redirectToNextPage();
      }
    },
    (err) => {
      this.loaderService.hideLoader();
      this.accountCreationService.showGenericErrorModal();
    });
  }

  setThumbnail(thumbElem, file) {
    // Set Thumbnail
    this.accountCreationCommon.setThumbnail(thumbElem, file);
  }

  getFileName(fileElem) {
    return this.accountCreationCommon.getFileName(fileElem);
  }

  clearFileSelection(control, controlName, event, thumbElem?, fileElem?) {
    const payloadKey = this.getPayloadKey(controlName);
    this.formData.delete(payloadKey);
    this.accountCreationCommon.clearFileSelection(control, event, thumbElem, fileElem);
  }

  showProofOfMailingDetails() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    const errorTitle = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.MAILING_ADDRESS_PROOF.TITLE'
    );
    const errorDesc = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.MAILING_ADDRESS_PROOF.MESSAGE'
    );
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorDescription = errorDesc;
  }

  // tslint:disable-next-line:no-identical-functions
  showProofOfResDetails() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    const errorTitle = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.RES_ADDRESS_PROOF.TITLE'
    );
    const errorDesc = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.RES_ADDRESS_PROOF.MESSAGE'
    );
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorDescription = errorDesc;
  }

  goToNext(form) {
    if (!form.valid) {
      const errorTitle = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.TITLE'
      );
      const errorMessage = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.MESSAGE'
      );
      const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorMessageHTML = errorMessage;
      ref.componentInstance.primaryActionLabel = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.UPLOAD_LATER.CONFIRM_PROCEED'
      );
      ref.componentInstance.primaryAction.subscribe(() => {
        this.accountCreationService.setAccountCreationStatus(
          ACCOUNT_CREATION_CONSTANTS.status.documents_pending
        );
        this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.SETUP_PENDING]);
      });
    } else {
      this.proceed(form);
    }
  }

  proceed(form) {
    this.uploadDocument();
  }

  redirectToNextPage() {
    const boStatus = this.accountCreationService.getBOStatus();
    if (boStatus) {
      this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.UPLOAD_DOCUMENTS_BO]);
    } else {
      this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.ACKNOWLEDGEMENT]);
    }
  }
}
