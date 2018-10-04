import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyInfoService {
  authApiUrl = environment.myInfoAuthorizeUrl;
  clientId = environment.myInfoClientId;
  private attributes = '';
  purpose = 'demonstrating MyInfo APIs';
  redirectUrl = environment.myInfoCallbackBaseUrl;
  state = Math.floor(100 + Math.random() * 90);
  constructor() { }

  setMyInfoAttributes(attributes) {
    this.attributes = attributes;
    window.sessionStorage.setItem('attributes', this.attributes);
  }

  getMyInfoAttributes() {
    return window.sessionStorage.getItem('attributes');
  }

  goToMyInfo() {
    window.sessionStorage.setItem('currentUrl', window.location.hash);
    const authoriseUrl = this.authApiUrl +
      '?client_id=' + this.clientId +
      '&attributes=' + this.getMyInfoAttributes() +
      '&purpose=' + this.purpose +
      '&state=' + this.state +
      '&redirect_uri=' + this.redirectUrl;
    window.location.href = authoriseUrl;
  }
}
