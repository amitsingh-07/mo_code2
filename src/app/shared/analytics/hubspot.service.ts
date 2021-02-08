import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IPage } from './page.interface';
import { environment } from './../../../../environments/environment';

declare global {
  interface Window { _hsq: any; }
}

@Injectable({
  providedIn: 'root'
})
export class HubspotService {

  constructor(
    public router: Router,
    public httpClient: HttpClient) {
  }

  // Registering Identifier to the hukt code
  registerEmail(email: string) {
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["identify", {
      email: email
    }]);
    console.log("Email Registered in Hubspot" + email);
  }

  registerPhone(mobile: string) {
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["identify", {
      mobile: mobile
    }]);
    console.log("Phone Registered in Hubspot" + mobile);
  }
  
  // Submitting Form Methods
  submitLogin(data: any) {
    let url = environment.hsUrl.login 
    this.submitHSForm(url, data).subscribe((response) => {
      console.log(response);
      console.log("Login on HS sucessful");
    });
  }

  submitRegistration(data: any) {
    let url = environment.hsUrl.registration 
    this.submitHSForm(url, data).subscribe((response) => {
      console.log(response);
      console.log("Registration on HS sucessful");
    });
  }

  //Submitting Hubspot Form Core Method
  submitHSForm(hsUrl: string, data: any) {
    let formBody = {} as any
    formBody.submittedAt = Date.now();
    formBody.fields = data;
    formBody.context = this.getPageInfo();

    return this.httpClient.post(hsUrl, formBody)
      .pipe(map((response) => {
        // login successful if there's a jwt token in the response
        console.log(response);
        return response;
      }));
  }

  getPageInfo() {
    var context = {} as IPage;
    context.hutk = document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    context.pageUrl = this.router.url;
    context.pageName = document.title;
    return context;
  }
}
