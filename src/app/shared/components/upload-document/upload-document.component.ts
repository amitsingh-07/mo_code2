import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, ControlContainer } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { UploadDocumentService } from '../../../shared/Services/upload-document.service';

export interface DocumentInfo {
  documentType: String;
  defaultThumb: String;
  formData: FormData;
  streamResponse?: any;
}
export interface EmitInfo {
  clearBtn: boolean;
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
  fileName: string;
  uploadForm: FormGroup;
  emitObject: EmitInfo = { clearBtn: false };
  
  @Input('documentInfo') documentInfo: DocumentInfo;
  @Output('eventTrigger') eventTrigger: EventEmitter<Object> = new EventEmitter();
  @ViewChild('documentThumb') documentThumb;
  
  constructor(public readonly translate: TranslateService,
    public modal: NgbModal,
    private uploadDocService: UploadDocumentService,
    private controlContainer: ControlContainer) {
  }

  ngOnInit(): void {
    this.uploadForm = this.controlContainer.control as FormGroup;
    this.documentName = this.uploadDocService.getDocumentName(this.documentInfo.documentType);

    this.uploadDocService.streamResponseObserv.subscribe((response) => {
      this.getBlob(response);
    });
  }

  getBlob(streamResponse) {
    this.uploadDocService.blobToThumbNail(streamResponse, this.uploadForm.controls.document, this.documentInfo, this.documentThumb);
    this.fileName = this.uploadDocService.blobToFile(streamResponse).name;   
  }

  openFileDialog(elem) {
    if (!elem.files.length) {
      elem.click();
    }
  }

  setFileName(fileElem) {
    this.fileName = this.uploadDocService.getFileName(fileElem);
  }

  fileSelect(control, controlname, fileElem, thumbElem?) {
    this.uploadDocService.fileSelect(this.documentInfo.formData, control, controlname, fileElem.target.files[0], thumbElem);
    this.setFileName(fileElem.target);
  }

  clearFileSelection(control, controlName, event, thumbElem?, fileElem?) {
    const defaultThumb = this.documentInfo.defaultThumb;
    const payloadKey = this.uploadDocService.getPayloadKey(controlName);
    this.documentInfo.formData.delete(payloadKey);
    this.uploadDocService.clearFileSelection(control, event, defaultThumb, thumbElem, fileElem);
    
    this.emitObject.clearBtn = true;
    this.eventTrigger.emit(this.emitObject);
  }
}
