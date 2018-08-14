import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { map } from 'rxjs/operators';

import { apiConstants } from '../api.constants';
import { environment } from './../../../../environments/environment';
import { IServerResponse } from './../interfaces/server-response.interface';

const APP_JWT_TOKEN_KEY = 'app-jwt-token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  getAppSecretKey() {
    return 'lX7+bYbR4m6GUnmQE9zUrbAwvKMRVevbYL6nIrnOCWY=';
  }

  authenticate(userEmail?: string, userPassword?: string) {
    const authenticateUrl = apiConstants.endpoint.authenticate;
    const authenticateBody = {
      email: userEmail ? userEmail : '',
      password: userPassword ? userPassword : '',
      secretKey: this.getAppSecretKey()
    };
    return this.http.post<IServerResponse>(`${environment.apiBaseUrl}/${authenticateUrl}`, authenticateBody)
      .pipe(map((response) => {
        // login successful if there's a jwt token in the response
        if (response && response.objectList[0].securityToken) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(APP_JWT_TOKEN_KEY, response.objectList[0].securityToken);
          return response.objectList[0].securityToken;
        }
        return null;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(APP_JWT_TOKEN_KEY);
  }

  public getToken(): string {
    return localStorage.getItem(APP_JWT_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(token);
  }
}
