import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { MailchimpApiService } from '../../Services/mailchimp.api.service';
import { ConfigService, IConfig } from './../../../config/config.service';
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
      email: new FormControl(this.formValues.email),
    });
  }

  subscribeMember() {
    this.mailChimpApiService.registerUser(this.subscribeSideForm.value);
  }
}
