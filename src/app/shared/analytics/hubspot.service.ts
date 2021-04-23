import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { IPage } from './page.interface';
import { environment } from './../../../environments/environment';
import { PlatformLocation } from '@angular/common';

declare global {
  interface Window { _hsq: any; }
}

@Injectable({
  providedIn: 'root'
})
export class HubspotService {

  constructor(
    public router: Router,
    public httpClient: HttpClient,
    public platformLocation: PlatformLocation
  ) {
  }

  // Registering Identifier to the hukt code
  registerEmail(email: string) {
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["identify", {
      email: email
    }]);
  }

  registerPhone(mobile: string) {
    var _hsq = window._hsq = window._hsq || [];
    _hsq.push(["identify", {
      mobile: mobile
    }]);
  }

  // Submitting Form Methods
  submitLogin(data: any) {
    let url = "https://api.hsforms.com/submissions/v3/integration/submit/" + environment.hsPortalId + "/" + environment.hsUrlTrack;
    if (environment.hsPortalId != null && environment.hsUrlTrack != null) {
      this.submitHSForm(url, data).subscribe((response) => {});
    }
  }

  submitRegistration(data: any) {
    let url = "https://api.hsforms.com/submissions/v3/integration/submit/" + environment.hsPortalId + "/" + environment.hsUrlTrack;
    if (environment.hsPortalId != null && environment.hsUrlTrack != null) {
      this.submitHSForm(url, data).subscribe((response) => {});
    }
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
        return response;
      }));
  }

  getPageInfo() {
    var context = {} as IPage;
    context.hutk = document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    context.pageUri = location.href;
    context.pageName = document.title;
    return context;
  }
}
