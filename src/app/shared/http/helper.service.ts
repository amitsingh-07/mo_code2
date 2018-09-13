import { ErrorModalComponent } from './../modal/error-modal/error-modal.component';
import { IError } from './interfaces/error.interface';
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  loadingModalRef: NgbModalRef;

  constructor(private modal: NgbModal) { }

  /**
   * Add content type to HTTP header
   */
  addContentTypeHeader = true;

  showLoader() {
    // this.loadingModalRef = this.modalService.open(LoaderComponent);
  }

  hideLoader() {
    // this.loadingModalRef.close();
  }

  showCustomErrorModal(error: IError) {
    this.loadingModalRef = this.modal.open(ErrorModalComponent, { centered: true });
    this.loadingModalRef.componentInstance.errorTitle = error.error;
    this.loadingModalRef.componentInstance.errorMessage = error.message;
  }
}
