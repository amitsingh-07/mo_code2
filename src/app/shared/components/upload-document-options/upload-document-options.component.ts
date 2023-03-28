import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../../investment/investment-account/investment-account.constant';

@Component({
  selector: 'app-upload-document-options',
  templateUrl: './upload-document-options.component.html',
  styleUrls: ['./upload-document-options.component.scss']
})
export class UploadDocumentOptionsComponent {
  readonly UPLOAD_OPTION = INVESTMENT_ACCOUNT_CONSTANTS.UPLOAD_OPTION;
  
  constructor(
    public activeModal: NgbActiveModal
    ) { }

  uploadFile(selectedOption) {
    this.activeModal.close(selectedOption);
  }

}
