import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { apiConstants } from '../api.constants';
import { IServerResponse } from '../interfaces/server-response.interface';
import { appConstants } from './../../../app.constants';
import { RequestCache } from './../http-cache.service';

export const APP_JWT_TOKEN_KEY = 'app-jwt-token';
const APP_SESSION_ID_KEY = 'app-session-id';
const APP_ENQUIRY_ID = 'app-enquiry-id';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(
    private http: HttpClient, public jwtHelper: JwtHelperService,
    private cache: RequestCache) { }

  private getAppSecretKey() {
    return 'kH5l7sn1UbauaC46hT8tsSsztsDS5b/575zHBrNgQAA=';
  }

  login(userEmail: string, userPassword: string, captchaValue?: string, sessionId?: string) {
    const authenticateBody = {
      email: (userEmail && this.isUserNameEmail(userEmail)) ? userEmail : '',
      mobile: (userEmail && !this.isUserNameEmail(userEmail)) ? userEmail : '',
      password: userPassword ? userPassword : '',
      secretKey: this.getAppSecretKey()
    };
    if (sessionId) { authenticateBody['sessionId'] = sessionId; }
    if (captchaValue) { authenticateBody['captchaValue'] = captchaValue; }
    const handleError = '?handleError=true';
    return this.doAuthenticate(authenticateBody, handleError);
  }

  authenticate() {
    const authenticateBody = {
      email: '',
      mobile: '',
      password: '',
      secretKey: this.getAppSecretKey()
    };
    return this.doAuthenticate(authenticateBody);
  }

  private doAuthenticate(authenticateBody: any, handleError?: string) {
    if (!handleError) {
      handleError = '';
    }
    const authenticateUrl = apiConstants.endpoint.authenticate;
    return this.http.post<IServerResponse>(`${environment.apiBaseUrl}/${authenticateUrl}${handleError}`, authenticateBody)
      .pipe(map((response) => {
        // login successful if there's a jwt token in the response
        if (response && response.objectList[0] && response.objectList[0].securityToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.saveAuthDetails(response.objectList[0]);
        }
        return response;
      }));
  }

  saveAuthDetails(auth: any) {
    if (sessionStorage) {
      sessionStorage.setItem(appConstants.APP_JWT_TOKEN_KEY, auth.securityToken);
      sessionStorage.setItem(appConstants.APP_SESSION_ID_KEY, auth.sessionId);
    }
  }

  isUserNameEmail(username: string) {
    const emailPattern = new RegExp(RegexConstants.Email);
    return emailPattern.test(username);
  }

  clearSession() {
    // remove user from local storage to log user out
    this.cache.reset();
    sessionStorage.clear();
  }

  public getToken(): string {
    return sessionStorage.getItem(appConstants.APP_JWT_TOKEN_KEY);
  }

  public getSessionId(): string {
    return sessionStorage.getItem(appConstants.APP_SESSION_ID_KEY);
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    if (!token) {
      return false;
    }
    // return a boolean reflecting
    // whether or not the token is expired
    return this.jwtHelper.isTokenExpired(token, 30 * 60);
  }

  saveEnquiryId(id) {
    if (sessionStorage) {
      sessionStorage.setItem(appConstants.APP_ENQUIRY_ID, id);
    }
  }

  public getEnquiryId(): string {
    return sessionStorage.getItem(appConstants.APP_ENQUIRY_ID);
  }

}
