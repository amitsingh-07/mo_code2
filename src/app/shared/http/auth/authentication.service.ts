import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { apiConstants } from '../api.constants';
import { IServerResponse } from '../interfaces/server-response.interface';

const APP_JWT_TOKEN_KEY = 'app-jwt-token';
const APP_SESSION_ID_KEY = 'app-session-id';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  private getAppSecretKey() {
    return '658Ifh5FmT70jkAmLSWEvQWulBrR9zkrZza2n7MCusY=';
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
          this.saveAuthDetails(response.objectList[0]);
          return response.objectList[0].securityToken;
        }
        return null;
      }));
  }

  saveAuthDetails(auth: any) {
    if (sessionStorage) {
      sessionStorage.setItem(APP_JWT_TOKEN_KEY, auth.securityToken);
      sessionStorage.setItem(APP_SESSION_ID_KEY, auth.sessionId);
    }
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.clear();
  }

  public getToken(): string {
    //return sessionStorage.getItem(APP_JWT_TOKEN_KEY);
    return 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJub3JtYWxfdXNlciIsInJvbGVzIjoiUk9MRV9VU0VSLCIsImlhdCI6MTUzNTEwOTU4NywiaXNzIjoiQXV0aG9yaXphdGlvbiIsImV4cCI6MTUzNTYyMjIyN30.idA3SgrY4HAy05pATan9_vP9eHpPV6hZEoSn_L_HxA8';
  }

  public getSessionId(): string {
    return sessionStorage.getItem(APP_SESSION_ID_KEY);
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(token);
  }
}
