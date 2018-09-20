import { Injectable } from '@angular/core';
import { environmentConstants } from '../../../environments/constants';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyInfoService {
  authApiUrl = 'https://myinfosgstg.api.gov.sg/dev/v1/authorise';
  clientId = environmentConstants.myInfoClientId;
  attributes = 'name,sex,race,nationality,dob,email,mobileno,regadd,housingtype,hdbtype,marital,edulevel';
  purpose = 'demonstrating MyInfo APIs';
  redirectUrl = 'http://localhost:3001' + '/callback';
  state = Math.floor(100 + Math.random() * 90);
  constructor() { }

  goToMyInfo() {
    window.sessionStorage.setItem('currentUrl', window.location.hash);
    const authoriseUrl = this.authApiUrl +
        '?client_id=' + this.clientId +
        '&attributes=' + this.attributes +
        '&purpose=' + this.purpose +
        '&state=' + this.state +
        '&redirect_uri=' + this.redirectUrl;
    window.location.href = authoriseUrl;
  }
}
