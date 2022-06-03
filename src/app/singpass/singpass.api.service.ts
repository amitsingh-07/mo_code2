import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { environment } from './../../environments/environment';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';

@Injectable({
  providedIn: 'root'
})
export class SingpassApiService {
  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService
  ) {
  }

  // Get state & nonce using session id
  getStateNonce() {
    const payload = { sessionId: this.authService.getSessionId() };
    return this.apiService.getStateNonce(payload);
  }

  // Get state & nonce using session id
  loginSingpass(code, state) {
    const payload = { code: code, state: state };
    return this.apiService.loginSingpass(payload);
  }

  initSingpassAuthSession(authParamsSupplier) {
    console.log("URL = " + environment.apiBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_CALLBACK_URL)
    const onError = (errorId, message) => {
      console.log(`onError. errorId:${errorId} message:${message}`);
    }
    const initAuthSessionResponse = window['NDI'].initAuthSession(
      'qr_wrapper',
      {
        clientId: 'iROTlv1CU9Cz3GlYiNosMsZDGIYwWSB3', // Replace with your client ID
        redirectUri: environment.apiBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_CALLBACK_URL,        // Replace with a registered redirect URI
        scope: 'openid',
        responseType: 'code'
      },
      authParamsSupplier,
      onError
    );
    console.log('initAuthSession: ', initAuthSessionResponse);
  }
}
