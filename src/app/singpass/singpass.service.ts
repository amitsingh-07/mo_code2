import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { environment } from '../../environments/environment';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';

@Injectable({
  providedIn: 'root'
})
export class SingpassService {
  private stateNonce: any;
  private authoriseUrl : any;
  
  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService
  ) {
  }

  // Get state & nonce using session id
  getStateNonce() : any {
    const payload = { sessionId: this.authService.getSessionId() };
    this.apiService.getStateNonce(payload).subscribe((data)=>{
      this.setStateNonceObj(data['objectList'][0]);
    });
  }

  setStateNonceObj(statenonce) {
    this.stateNonce = statenonce;
  }

  getStateNonceObj() {
    return this.stateNonce;
  }

  // Get state & nonce using session id
  loginSingpass(code, state, enquiryId, journeyType) {
    const payload = {
      enquiryId: enquiryId,
      journeyType: journeyType,
      code: code, 
      state: state, 
      redirect_uri: environment.singpassBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_REDIRECT_URL
    };
    return this.apiService.loginSingpass(payload);
  } 

  //open singpass login window
  loginSingpassUrl(){
    const stateNonceParam = this.getStateNonceObj()
    this.getSingpassLoginUrl(stateNonceParam);
    window.open(this.getLoginUrl(), '_self');
  }

  //method to construct singpass login url
  getSingpassLoginUrl(stateNonceParam)
  {
     const loginUrl = environment.singpassLoginUrl +
        '?client_id=' + environment.singpassClientId +
        '&redirect_uri=' + environment.singpassBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_REDIRECT_URL+
        '&scope=openid' +
        '&response_type=code' +
        '&state=' + stateNonceParam.state +
        '&nonce=' + stateNonceParam.nonce;
    this.setLoginUrl(loginUrl);
  }

  setLoginUrl(loginUrl){
    this.authoriseUrl = loginUrl
  }
  getLoginUrl(){
    return this.authoriseUrl;
  }

}
