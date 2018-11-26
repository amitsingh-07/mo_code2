import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MailchimpApiService } from '../../Services/mailchimp.api.service';
import { SubscribeMember } from './../../Services/subscribeMember';

@Component({
  selector: 'app-subscribe-side',
  templateUrl: './subscribe-side.component.html',
  styleUrls: ['./subscribe-side.component.scss']
})
export class SubscribeSideComponent implements OnInit {

  subscribeSideForm: FormGroup;
  subscribeMessage = '';
  subscribeSuccess = false;
  formValues: SubscribeMember;

  constructor(public mailChimpApiService: MailchimpApiService) {
    this.mailChimpApiService.newSubscribeMessage.subscribe((data) => {
      if (data !== '') {
        if (data['errorMessage']) {
          this.subscribeSuccess = false;
          this.subscribeMessage = data['errorMessage'];
        } else {
          this.subscribeMessage = data;
          this.subscribeSuccess = true;
        }
      }
    });
  }

  ngOnInit() {
    this.formValues = this.mailChimpApiService.getSubscribeFormData();
    this.subscribeSideForm = new FormGroup({
      firstName: new FormControl(this.formValues.firstName),
      lastName: new FormControl(this.formValues.lastName),
      email: new FormControl(this.formValues.email),
    });
  }

  subscribeMember() {
    this.mailChimpApiService.registerUser(this.subscribeSideForm.value);
  }
}
