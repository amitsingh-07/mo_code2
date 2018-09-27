import { HttpClient, HttpClientJsonpModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ISubscriber } from './subscriber';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MailchimpApiService {

  constructor(http: Http,  public httpClient: HttpClient) {}

  registerUser(subscriber: ISubscriber) {
    const headers = new HttpHeaders();
    headers.append('Authorization', 'Basic ' + btoa('password:5c7ba1f442ce24bdd8e3aff3e74dfef5-us19'));
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const url = 'https://us19.api.mailchimp.com/3.0/lists/';
    const list_id = '976555b4d3'; // To Hide in Env
    const list_type = 'members';

    // Configure Payload
    const payload = subscriber;

    return this.httpClient.post(url, payload ).pipe(
    );
  }

}
