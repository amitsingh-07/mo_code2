import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SubscribeMember } from './subscribeMember';

@Injectable({
  providedIn: 'root'
})
export class MailchimpApiService {

  constructor(http: HttpClient) {}
  private subscribeFormData: SubscribeMember = new SubscribeMember();
  error = '';
  getSubscribeFormData() {
    return this.subscribeFormData;
  }

  setSubscribeFormData(data: SubscribeMember, redirect?: boolean) {
    this.subscribeFormData.email = data.email;
    this.subscribeFormData.firstName = data.firstName;
    this.subscribeFormData.lastName = data.lastName;
    console.log(this.subscribeFormData);

    if (!redirect) {
      this.registerUser();
    }
  }

  registerUser() {
    const subscriber = this.subscribeFormData;
    const mailchimp_username = 'marketing@moneyowl.com.sg';
    const mailchimp_dc = 'us-19';
    const mailchimp_u = '5c7ba1f442ce24bdd8e3aff3e74dfef5';
    const mailchimp_id = '976555b4d3';
    const mailChimpEndpoint = 'https://' + mailchimp_username + '.' + mailchimp_dc +
                              '.list-manage.com/subscribe/post-json?u=abc123&amp;id=' + mailchimp_id;
    const params = new HttpParams()
        .set('FNAME', subscriber.firstName)
        .set('LNAME', subscriber.lastName)
        .set('EMAIL', subscriber.email)
        .set(mailchimp_u, ''); // hidden input name

    const mailChimpUrl = mailChimpEndpoint + params.toString();

    console.log(mailChimpUrl);
  }

}
