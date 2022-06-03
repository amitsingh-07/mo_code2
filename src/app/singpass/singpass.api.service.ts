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

  // Init Singpass QR
  initSingpassAuthSession(authParamsSupplier) {
    const onError = (errorId, message) => {
      console.log(`onError. errorId:${errorId} message:${message}`);
    }
    const initAuthSessionResponse = window['NDI'].initAuthSession(
      'qr_wrapper',
      {
        clientId: environment.singpassClientId,
        redirectUri: environment.apiBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_CALLBACK_URL,
        scope: 'openid',
        responseType: 'code'
      },
      authParamsSupplier,
      onError
    );
    console.log('initAuthSession: ', initAuthSessionResponse);
  }

  // Method to invoke when user abort login
  cancelSingpassAuthSession() {
    window['NDI'].cancelAuthSession();
  }
}
