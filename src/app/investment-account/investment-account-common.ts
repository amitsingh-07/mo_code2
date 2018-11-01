import { INVESTMENT_ACCOUNT_CONFIG } from './investment-account.constant';
export class InvestmentAccountCommon {

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
    }
    return payloadKey;
  }

  setThumbnail(thumbElem, file) {
    // Set Thumbnail
    const defaultThumb = INVESTMENT_ACCOUNT_CONFIG.upload_documents.default_thumb;
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

  fileSelected(formData, control, controlname, fileElem, thumbElem?) {
    const selectedFile: File = fileElem.target.files[0];
    const fileSize: number = selectedFile.size / 1024 / 1024; // in MB
    const fileType = selectedFile.name.split('.')[1].toUpperCase();
    const isValidFileSize = fileSize <= INVESTMENT_ACCOUNT_CONFIG.upload_documents.max_file_size;
    const isValidFileType = thumbElem ? INVESTMENT_ACCOUNT_CONFIG.upload_documents.image_file_types.includes(fileType)
      : INVESTMENT_ACCOUNT_CONFIG.upload_documents.doc_file_types.includes(fileType);
    if (isValidFileSize && isValidFileType) {
      const payloadKey = this.getPayloadKey(controlname);
      formData.append(payloadKey, selectedFile);
      if (thumbElem) {
        this.setThumbnail(thumbElem, selectedFile);
      }
    }
    return {
      validFileSize: isValidFileSize,
      validFileType: isValidFileType
    };
  }

  clearFileSelection(control, event, thumbElem?) {
    const defaultThumb = INVESTMENT_ACCOUNT_CONFIG.upload_documents.default_thumb;
    event.stopPropagation();
    control.setValue('');
    if (thumbElem) {
      thumbElem.src = window.location.origin + '/assets/images/' + defaultThumb;
    }
  }

}
