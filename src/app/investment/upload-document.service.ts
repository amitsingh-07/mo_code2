import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { INVESTMENT_ACCOUNT_CONSTANTS } from './investment-account/investment-account.constant';

@Injectable({
  providedIn: 'root'
})

export class UploadDocumentService {
  constructor(
    public readonly translate: TranslateService,
    private modal: NgbModal,
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  getDocumentName(docType) {
    let docName;
    switch (docType) {
      case 'CKA_CERTIFICATE': {
        docName = this.translate.instant('UPLOAD_DOCUMENTS.CKA_CERTIFICATE');
        break;
      }
    }
    return docName;
  }

  getPayloadKey(controlname) {
    let payloadKey;
    switch (controlname) {
      case 'NRIC_FRONT': {
        payloadKey = 'nricFront';
        break;
      }
      case 'NRIC_BACK': {
        payloadKey = 'nricBack';
        break;
      }
      case 'MAILING_ADDRESS': {
        payloadKey = 'mailingAddressProof';
        break;
      }
      case 'RESIDENTIAL_ADDRESS': {
        payloadKey = 'residentialAddressProof';
        break;
      }
      case 'PASSPORT': {
        payloadKey = 'passport';
        break;
      }
      case 'PASSPORT_BO': {
        payloadKey = 'supportingDocument';
        break;
      }
      case 'BIRTH_CERTIFICATE': {
        payloadKey = 'supportingDocument';
        break;
      }
      case 'CKA_CERTIFICATE': {
        payloadKey = 'ckaCert';
        break;
      }
    }
    return payloadKey;
  }

  setThumbnail(thumbElem, file) {
    // Set Thumbnail
    const defaultThumb = INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.default_thumb;
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      thumbElem.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      thumbElem.src = window.location.origin + '/assets/images/' + defaultThumb;
    }
  }

  getFileName(fileElem) {
    let fileName = '';
    if (fileElem.files.length) {
      fileName = fileElem.files[0].name;
    }
    return fileName;
  }

  selectedFile(formData, controlname, fileElem, thumbElem?) {
    const selectedFile: File = fileElem.target.files[0];
    const fileSize: number = selectedFile.size / 1024 / 1024; // in MB
    const fileType = selectedFile.name.split('.')[selectedFile.name.split('.').length - 1].toUpperCase();
    const isValidFileSize =
      fileSize <= INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.max_file_size;
    const isValidFileType = INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.file_types.indexOf(
      fileType
    ) >= 0;
    if (isValidFileSize && isValidFileType) {
      const payloadKey = this.getPayloadKey(controlname);
      formData.append(payloadKey, selectedFile);
      if (fileType !== 'PDF') {
        this.setThumbnail(thumbElem, selectedFile);
      }
    } else {
      fileElem.currentTarget.value = '';
    }
    return {
      validFileSize: isValidFileSize,
      validFileType: isValidFileType
    };
  }

  fileSelect(formData, control, controlname, fileElem, thumbElem?) {
    const response = this.selectedFile(formData, controlname, fileElem, thumbElem);

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

  clearFileSelection(control, event, defaultThumb, thumbElem?, fileElem?) {
    event.stopPropagation();
    control.setValue('');
    fileElem.value = '';
    if (thumbElem) {
      thumbElem.src = 'assets/images/' + defaultThumb;
    }
  }
}
