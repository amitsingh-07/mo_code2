import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';

import { LoaderService } from '../components/loader/loader.service';
import { ErrorModalComponent } from './../modal/error-modal/error-modal.component';
import { IError } from './interfaces/error.interface';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  loadingModalRef: NgbModalRef;

  constructor(private modal: NgbModal, private loaderService: LoaderService) { }

  /**
   * Add content type to HTTP header
   */
  addContentTypeHeader = true;

  showLoader() {
    // this.loadingModalRef = this.modalService.open(LoaderComponent);
  }

  hideLoader() {
    // this.loadingModalRef.close();
    this.loaderService.hideLoader();
  }

  handleError(error: HttpErrorResponse) {
    this.hideLoader();
    if (error) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`);
        return throwError('API returned error response');
      }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  showHttpErrorModal(error: IError) {
    this.hideLoader();
    if (error && error.error && error.message) {
      this.loadingModalRef = this.modal.open(ErrorModalComponent, { centered: true });
      this.loadingModalRef.componentInstance.errorTitle = error.error;
      this.loadingModalRef.componentInstance.errorMessage = error.message;
    }
  }

  showCustomErrorModal(error: IError) {
    this.hideLoader();
    let title = '';
    let message = '';
    if (error.message.indexOf(':') > -1) {
      const desc = error.message.split(':');
      title = desc[0];
      message = desc[1];
    } else {
      message = error.message;
    }
    this.loadingModalRef = this.modal.open(ErrorModalComponent, { centered: true });
    this.loadingModalRef.componentInstance.errorTitle = title;
    this.loadingModalRef.componentInstance.errorMessage = message;
  }
}
