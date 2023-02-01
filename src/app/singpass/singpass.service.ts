import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { environment } from '../../environments/environment';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import { Util } from '../shared/utils/util';
import { CapacitorUtils } from '../shared/utils/capacitor.util';
@Injectable({
  providedIn: 'root'
})
export class SingpassService {
  private stateNonce: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService
  ) {
  }

  // Get state & nonce using session id
  getStateNonce(): any {
    if (this.authService.isAuthenticated()) {
      const payload = { sessionId: this.authService.getSessionId() };
      this.apiService.getStateNonce(payload).subscribe((data) => {
        this.setStateNonceObj(data['objectList'][0]);
      });
    }
  }

  setStateNonceObj(statenonce) {
    this.stateNonce = statenonce;
  }

  // Singpass redirecting back to MO
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

  // Open Singpass redirect link in window
  openSingpassUrl() {
    let loginUrl = environment.singpassLoginUrl +
      '?client_id=' + environment.singpassClientId +
      '&redirect_uri=' + environment.singpassBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_REDIRECT_URL +
      '&scope=openid' +
      '&response_type=code' +
      '&state=' + this.stateNonce.state +
      '&nonce=' + this.stateNonce.nonce;
    if (CapacitorUtils.isApp) {
      loginUrl = loginUrl.concat("&app_launch_url=com.moneyowl.app://accounts/login")
      console.log("SINGPASS APP LAUNCH URL = ",loginUrl)
      window.open(loginUrl, '_blank');
    } else {
      window.open(loginUrl, '_self');
    }
  }

}
