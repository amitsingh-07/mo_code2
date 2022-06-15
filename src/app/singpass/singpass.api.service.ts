import { Injectable } from '@angular/core';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';

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
    const onError = (errorId, message) => {
      console.log(`onError. errorId:${errorId} message:${message}`);
    }
    const initAuthSessionResponse = window['NDI'].initAuthSession(
      'qr_wrapper',
      {
        clientId: 'iROTlv1CU9Cz3GlYiNosMsZDGIYwWSB3', // Replace with your client ID
        redirectUri: 'https://newmouat1.ntucbfa.com/app/singpass/callback',        // Replace with a registered redirect URI
        scope: 'openid',
        responseType: 'code'
      },
      authParamsSupplier,
      onError
    );
    console.log('initAuthSession: ', initAuthSessionResponse);
  }
}
