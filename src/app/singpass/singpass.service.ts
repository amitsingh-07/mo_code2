import { Injectable } from '@angular/core';

import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { environment } from '../../environments/environment';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';

@Injectable({
  providedIn: 'root'
})
export class SingpassService {
  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService
  ) {
  }

  // Initialize Singpass QR
  initSingPassQR() {
    setTimeout(() => {
      if (this.authService.isAuthenticated()) {
        const authParamsSupplier = async () => {
          const promise = await this.getStateNonce().toPromise();
          return promise['objectList'][0];
        }
        if (authParamsSupplier) {
          this.initSingpassAuthSession(authParamsSupplier);
        }
      } else {
        this.initSingPassQR();
      }
    });
  }

  // Get state & nonce using session id
  getStateNonce() {
    const payload = { sessionId: this.authService.getSessionId() };
    return this.apiService.getStateNonce(payload);
  }

  // Get state & nonce using session id
  loginSingpass(code, state, enquiryId, journeyType) {
    const payload = {
      enquiryId: enquiryId,
      journeyType: journeyType,
      code: code, 
      state: state, 
      redirect_uri: environment.apiBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_REDIRECT_URL
    };
    return this.apiService.loginSingpass(payload);
  }

  // Init Singpass QR
  initSingpassAuthSession(authParamsSupplier) {
    const onError = (errorId, message) => {
      console.error(`onError. errorId:${errorId} message:${message}`);
    }
    try {
      window['NDI'].initAuthSession(
        'qr_wrapper',
        {
          clientId: environment.singpassClientId,
          redirectUri: environment.singpassBaseUrl + SIGN_UP_ROUTE_PATHS.SINGPASS_REDIRECT_URL,
          scope: 'openid',
          responseType: 'code'
        },
        authParamsSupplier,
        onError
      );
    } catch {
      console.error('error initAuthSession: ');
    }
  }

  // Method to invoke when user abort login
  cancelSingpassAuthSession() {
    window['NDI'].cancelAuthSession();
  }
}
