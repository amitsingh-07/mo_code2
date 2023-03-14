import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import {
  ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountCommon } from '../investment-account-common';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../investment-account.constant';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { CapacitorUtils } from 'src/app/shared/utils/capacitor.util';
import { UploadDocumentOptionsComponent } from 'src/app/shared/components/upload-document-options/upload-document-options.component';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadDocumentsComponent implements OnInit {
  @ViewChild('frontThumb') frontThumb : ElementRef;
  @ViewChild('backThumb') backThumb : ElementRef;
  uploadForm: FormGroup;
  pageTitle: string;
  formValues: any;
  countries: any;
  isUserNationalitySingapore: any;
  defaultThumb: any;
  formData: FormData = new FormData();
  investmentAccountCommon: InvestmentAccountCommon = new InvestmentAccountCommon();

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPLOAD_DOCUMENTS.TITLE');
      this.setPageTitle(this.pageTitle);
      this.defaultThumb = INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.default_thumb;
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.isUserNationalitySingapore = this.investmentAccountService.isSingaporeResident();
    this.formValues = this.investmentAccountService.getInvestmentAccountFormData();
    this.uploadForm = this.isUserNationalitySingapore
      ? this.buildFormForSingapore()
      : this.buildFormForOtherCountry();
    this.addOrRemoveMailingAddressproof();
    this.investmentAccountService.loadInvestmentAccountRoadmap(true);
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

  // openFileDialog(elem) {
  //   if (!elem.files.length) {
  //     this.investmentAccountService.uploadFileOption(elem);
  //   }
  // }

  openFileDialog(elem, controllerName?) {
    if (!elem.files.length) {
      if (CapacitorUtils.isApp && CapacitorUtils.isAndroidDevice) {
        const ref = this.modal.open(UploadDocumentOptionsComponent, { centered: true })
        ref.result.then(
          async result => {
            if (result === 'BROWSE') {
              elem.click();
            } else if (result === 'CAMERA') {
              const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: result,
              });
              const base64 = image.dataUrl;              
              const imageBlob = this.dataURItoBlob(base64);
              const imageName = `${new Date().getTime()}.${imageBlob.type && imageBlob.type.split('/')[1]}`;

              const cameraUploadedImageFile = new File([imageBlob], imageName, { type: imageBlob.type });
              console.log('.... ',cameraUploadedImageFile)
              let thumbElem =  this.backThumb;
              let controlname = 'NRIC_BACK';
              if (controllerName === 'nricFrontImage') {
                thumbElem = this.frontThumb;
                controlname = 'NRIC_FRONT';
              }              
              this.fileSelected(this.uploadForm.get(controllerName), controlname, null, thumbElem.nativeElement, cameraUploadedImageFile)
            } else {
              alert('cross clicked')
            }
          },
          reason => { }
        );
      } else {
        elem.click();
      }
    }
  }

  dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

  fileSelected(control, controlname, fileElem, thumbElem?, cameraUploadedImageFile?) {
    const response = this.investmentAccountCommon.fileSelected(
      this.formData,
      control,
      controlname,
      fileElem,
      thumbElem,
      cameraUploadedImageFile
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
      const selFile = cameraUploadedImageFile || fileElem.target.files[0];
      control.setValue(selFile ? selFile.name : '');
    }
  }

  getPayloadKey(controlname) {
    return this.investmentAccountCommon.getPayloadKey(controlname);
  }

  uploadDocument() {
    this.loaderService.showLoader({
      title: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.TITLE'),
      desc: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.MESSAGE')
    });
    this.investmentAccountService.uploadDocument(this.formData).subscribe((response) => {
      this.loaderService.hideLoader();
      if (response) {
        this.redirectToNextPage();
      }
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  setThumbnail(thumbElem, file) {
    // Set Thumbnail
    this.investmentAccountCommon.setThumbnail(thumbElem, file);
  }

  getFileName(fileElem) {
    return this.investmentAccountCommon.getFileName(fileElem);
  }

  clearFileSelection(control, controlName, event, thumbElem?, fileElem?) {
    const payloadKey = this.getPayloadKey(controlName);
    this.formData.delete(payloadKey);
    this.investmentAccountCommon.clearFileSelection(control, event, thumbElem, fileElem);
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
        this.investmentAccountService.setAccountCreationStatus(
          INVESTMENT_ACCOUNT_CONSTANTS.status.documents_pending
        );
        this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.STATUS]);
      });
    } else {
      this.proceed(form);
    }
  }

  proceed(form) {
    this.uploadDocument();
  }

  redirectToNextPage() {
    const boStatus = this.investmentAccountService.getBOStatus();
    if (boStatus) {
      this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS_BO]);
    } else {
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.CONFIRM_PORTFOLIO]);
    }
  }
}
