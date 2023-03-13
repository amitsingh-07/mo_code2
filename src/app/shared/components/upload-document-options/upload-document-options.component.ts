import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload-document-options',
  templateUrl: './upload-document-options.component.html',
  styleUrls: ['./upload-document-options.component.scss']
})
export class UploadDocumentOptionsComponent {

  constructor(
    public activeModal: NgbActiveModal
    ) { }

  uploadFile(selectedOption) {
    this.activeModal.close(selectedOption);
  }

}
