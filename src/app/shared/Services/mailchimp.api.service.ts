import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from './../http/api.service';
import { ErrorModalComponent } from './../modal/error-modal/error-modal.component';
import { SuccessModalComponent } from './../modal/success-modal/success-modal.component';
import { FormError } from './mailChimpError';
import { SubscribeMember } from './subscribeMember';

@Injectable({
  providedIn: 'root'
})
export class MailchimpApiService {
  private formError: any = new FormError();

  private subscribeMessage = new BehaviorSubject('');
  public newSubscribeMessage = this.subscribeMessage.asObservable();

  constructor(private modal: NgbModal, public apiService: ApiService) {
    this.apiService.newErrorMessage.subscribe((data) => {
      this.handleSubscribeResponse(data);
    });
  }
  private subscribeFormData: SubscribeMember = new SubscribeMember();
  error = '';
  getSubscribeFormData() {
    return this.subscribeFormData;
  }

  registerUser(subscriber_data) {
    if (subscriber_data.firstName === null) {
      subscriber_data.firstName = '';
    }
    if (subscriber_data.lastName === null) {
      subscriber_data.lastName = '';
    }
    const payload = {
      emailAddress: subscriber_data.email,
      firstName: subscriber_data.firstName,
      lastName: subscriber_data.lastName
      };
    this.apiService.subscribeNewsletter(payload).subscribe((data) => {
      this.handleSubscribeResponse(data);
    });
  }

  handleSubscribeResponse(data: any) {
    if (data) {
      if (data.status === 400 || data.status === 500) {
        this.handleSubscribeError(data);
      } else
      if (data.status === 'pending') {
        this.subscribeMessage.next('To confirm your subscription, please click on the verification link sent to your email.');
      }
    }
  }

  handleSubscribeError(data) {
    const errorMap = this.formError.subscribeFormErrors;
    let message = '';
    try {
      if ( errorMap[data.status] ) {
        const errorList = errorMap[data.status];
        const detail = data.detail;
        errorList.forEach((element) => {
          const regex = element.errorRegex;
          const res = detail.match(regex);
          if ( res ) {
            message = element.errorMessage;
          }
        });
        if (message === '') {
          message = errorMap['DEFAULT'].errorMessage;
        }
      }
    } catch {
      message = errorMap['DEFAULT'].errorMessage;
    }
    this.subscribeMessage.next(message);
  }
}
