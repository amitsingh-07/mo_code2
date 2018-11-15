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

  }
  private subscribeFormData: SubscribeMember = new SubscribeMember();
  error = '';
  getSubscribeFormData() {
    return this.subscribeFormData;
  }

  registerUser(subscriber_data) {
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
    console.log(data);
    if (data) {
      if (data.status === 400) {
        this.handleSubscribeError(data);
      } else
      if (data.status === 'pending') {
        console.log('pending success');
        this.subscribeMessage.next('A verification email has been sent. Do verify to receive our newsletters');
      }
    }
  }

  handleSubscribeError(data) {
    const errorMap = this.formError.subscribeFormErrors;
    let message = '';
    try {
      message = errorMap[data.status][data.title];
    } catch {
      message = errorMap['DEFAULT'];
    }
    this.subscribeMessage.next(message);
  }
}
