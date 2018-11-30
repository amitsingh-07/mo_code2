import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { MailchimpApiService } from '../../Services/mailchimp.api.service';
import { ConfigService, IConfig } from './../../../config/config.service';
import { SubscribeMember } from './../../Services/subscribeMember';

import { FormError } from '../../Services/mailChimpError';

@Component({
  selector: 'app-subscribe-side',
  templateUrl: './subscribe-side.component.html',
  styleUrls: ['./subscribe-side.component.scss']
})
export class SubscribeSideComponent implements OnInit {
  private formError: any = new FormError();
  subscribeSideForm: FormGroup;
  subscribeMessage = '';
  subscribeSuccess = false;
  formValues: SubscribeMember;
  public emailPattern = '^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';

  isWillWritingEnabled: boolean;

  constructor(public mailChimpApiService: MailchimpApiService, private translate: TranslateService, private configService: ConfigService) {
    this.translate.use('en');
    this.mailChimpApiService.newSubscribeMessage.subscribe((data) => {
      if (data !== '') {
        if (data['errorMessage']) {
          this.subscribeSuccess = false;
          this.subscribeMessage = data['errorMessage'];
        } else {
          this.subscribeMessage = data;
          this.subscribeSuccess = true;
        }
        setTimeout(() => {this.subscribeMessage = ''; }, 3000);
      }
      this.configService.getConfig().subscribe((config: IConfig) => {
        this.isWillWritingEnabled = config.willWritingEnabled;
      });
    });
  }

  ngOnInit() {
    this.formValues = this.mailChimpApiService.getSubscribeFormData();
    this.subscribeSideForm = new FormGroup({
      firstName: new FormControl(this.formValues.firstName),
      lastName: new FormControl(this.formValues.lastName),
      email: new FormControl(this.formValues.email, [Validators.required, Validators.pattern(this.emailPattern)]),
    });
  }

  subscribeMember() {
    if ( this.subscribeSideForm.valid ) {
      this.mailChimpApiService.registerUser(this.subscribeSideForm.value);
    } else {
      this.subscribeSuccess = false;
      this.subscribeMessage = this.formError.subscribeFormErrors.INVALID.errorMessage;
      setTimeout(() => {this.subscribeMessage = ''; }, 3000);
    }
  }
}
