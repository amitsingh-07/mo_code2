import { HttpClient, HttpClientJsonpModule, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { IServerResponse } from './../http/interfaces/server-response.interface';
import { SubscribeMember } from './subscribeMember';

@Injectable({
  providedIn: 'root'
})
export class MailchimpApiService {

  constructor(http: Http,  public httpClient: HttpClient) {}
  private subscribeFormData: SubscribeMember = new SubscribeMember();

  getSubscribeFormData() {
    return this.subscribeFormData;
  }

  setSubscribeFormData(data: SubscribeMember) {
    this.subscribeFormData.email = data.email;
    this.subscribeFormData.firstName = data.firstName;
    this.subscribeFormData.lastName = data.lastName;
    console.log(this.subscribeFormData);
    this.registerUser();
  }
  registerUser() {
    const subscriber = this.subscribeFormData;
    const headersIn = new HttpHeaders().set('Authorization', 'Basic ' + btoa('password:5c7ba1f442ce24bdd8e3aff3e74dfef5-us19'))
                                     .set('Content-Type', 'application/x-www-form-urlencoded');
    const url = 'https://us19.api.mailchimp.com/3.0/lists/';
    const list_id = '976555b4d3'; // To Hide in Env
    const list_type = 'members';
    let firstName = null;
    let lastName = null;

    // Configure Payload
    const email  = subscriber.email;
    firstName = subscriber.firstName;
    lastName = subscriber.lastName;

    const payload = {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
              FNAME: firstName,
              LNAME: lastName
          }
      };
    console.log(payload);
    this.httpClient.post(url, payload, {headers: headersIn})
              .subscribe((response) => {
                console.log(response);
          }, (err) => {
            console.log('User authentication failed!');
          });
  }

}
