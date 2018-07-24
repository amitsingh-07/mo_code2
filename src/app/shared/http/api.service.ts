import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from './../../config/config.service';
import { apiConstants } from './api.constants';
import { BaseService } from './base.service';
import { IServerResponse } from './interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private configService: ConfigService, private http: BaseService, private httpClient: HttpClient) { }

  getProfileList() {
    const url = '../assets/mock-data/profile.json';
    return this.http.get(apiConstants.endpoint.getProfileList)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
              `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
            return this.httpClient.get<IServerResponse>(url);
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }
  getProtectionNeedsList(userInfoForm) {
    const localUrl = '../assets/mock-data/getProtectionList.json';
    return this.httpClient.get<IServerResponse>(localUrl);
    /*
    const url = 'http://10.144.196.217:8080/insurance-needs-microservice/api/getProtectionTypesList';
    return this.http.post(url, userInfoForm)
    .pipe(
      // tslint:disable-next-line:no-identical-functions
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` + `body was: ${error.error}`
          );
          const localUrl = '../assets/mock-data/getProtectionList.json';
          return this.httpClient.get<IServerResponse>(localUrl);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
      })  
    );
  */
  }
}
