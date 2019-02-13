import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';

import { ErrorModalComponent } from '../shared/modal/error-modal/error-modal.component';
import { ComprehensiveFormData } from './comprehensive-form-data';
import { ComprehensiveFormError } from './comprehensive-form-error';

@Injectable({
  providedIn: 'root'
})
export class ComprehensiveService {
  private ComprehensiveFormData: ComprehensiveFormData = new ComprehensiveFormData();
  private ComprehensiveFormError: any = new ComprehensiveFormError();
  constructor(
    private http: HttpClient,
    private modal: NgbModal,
  ) { }

  getFormError(form, formName) {

    const controls = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.ComprehensiveFormError[formName].formFieldErrors.errorTitle;

    for (const name in controls) {
      if (controls[name].invalid) {
        errors.errorMessages.push(
          this.ComprehensiveFormError[formName].formFieldErrors[name][Object.keys(controls[name]['errors'])[0]].errorMessage);
      }
    }
    return errors;
  }
  getMultipleFormError(form, formName, formTitle) {
    const forms = form.controls;
    const errors: any = {};
    errors.errorMessages = [];
    errors.title = this.ComprehensiveFormError[formName].formFieldErrors.errorTitle;

    let index = 0;

    // tslint:disable-next-line:forin
    for (const field in forms) {
      for (const control of forms[field].controls) {
        const formGroup = { formName: '', errors: [] };
        // tslint:disable-next-line:forin
        for (const name in control.controls) {
          formGroup.formName = formTitle[index];
          if (control.controls[name].invalid) {

            formGroup.errors.push(
              this.ComprehensiveFormError[formName].formFieldErrors[name][Object.keys(control.controls[name]['errors'])
              [0]].errorMessage);
          }
        }
        if (formGroup.errors.length > 0) {
          errors.errorMessages.push(formGroup);
        }
        index++;
      }
    }
    return errors;
  }
  openErrorModal(title: string, message: string, isMultipleForm: boolean, formName?: string) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true, windowClass: 'will-custom-modal' });
    ref.componentInstance.errorTitle = title;
    if (!isMultipleForm) {
      ref.componentInstance.formName = formName;
      ref.componentInstance.errorMessageList = message;
    } else {
      ref.componentInstance.multipleFormErrors = message;
    }
    return false;
  }

}
