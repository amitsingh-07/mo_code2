import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlContainer } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { UploadDocumentService } from '../../../investment/upload-document.service';

export interface DocumentInfo {
  documentType: String;
  defaultThumb: String;
  formData: FormData;
}

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UploadDocComponent implements OnInit {
  defaultThumb: any;
  documentName: String;
  uploadForm: FormGroup;

  @Input('documentInfo') documentInfo: DocumentInfo;

  constructor(public readonly translate: TranslateService,
    public modal: NgbModal,
    private uploadDocService: UploadDocumentService,
    private controlContainer: ControlContainer) {
  }

  ngOnInit(): void {
    this.uploadForm = this.controlContainer.control as FormGroup;
    this.documentName = this.uploadDocService.getDocumentName(this.documentInfo.documentType);
  }

  openFileDialog(elem) {
    if (!elem.files.length) {
      elem.click();
    }
  }

  getFileName(fileElem) {
    return this.uploadDocService.getFileName(fileElem);
  }

  fileSelect(control, controlname, fileElem, thumbElem?) {
    this.uploadDocService.fileSelect(this.documentInfo.formData, control, controlname, fileElem, thumbElem);
  }

  clearFileSelection(control, controlName, event, thumbElem?, fileElem?) {
    const defaultThumb = this.documentInfo.defaultThumb;
    const payloadKey = this.uploadDocService.getPayloadKey(controlName);
    this.documentInfo.formData.delete(payloadKey);
    this.uploadDocService.clearFileSelection(control, event, defaultThumb, thumbElem, fileElem);
  }
}
