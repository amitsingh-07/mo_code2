import { IRecommendationRequest } from './../../guide-me/interfaces/recommendations.request';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';
import { apiConstants } from './api.constants';
import { BaseService } from './base.service';
import { IServerResponse } from './interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private configService: ConfigService,
    private http: BaseService,
    private httpClient: HttpClient) { }

  /* SignUp API */
  requestVerifyMobile(): string {
    const url = '';
    return '000000';
  };

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

  getLongTermCareList() {
    const url = '../assets/mock-data/careGiverList.json';
    // -- Once the API is implemented on to grab the LongTermCareList
    // return this.http.get(apiConstants.endpoint.getLongTermCareList)
    // -- Local url
    return this.http.get(apiConstants.endpoint.getLongTermCareList)
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

  // tslint:disable-next-line:no-identical-functions
  getHospitalPlanList() {
    const url = '../assets/mock-data/hospitalPlanList.json';
    // -- Once the API is implemented on to grab the HospitalPlanList
    // return this.http.get(apiConstants.endpoint.getHospitalPlanList)
    // -- Local url
    return this.http.get(apiConstants.endpoint.getHospitalPlanList)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getProtectionNeedsList(userInfoForm) {
    let localUrl = '../assets/mock-data/getProtectionList.json';
    // return this.httpClient.post<IServerResponse>(`${baseUrl}/${apiConstants.endpoint.getProtectionTypesList}`, userInfoForm);
    // return this.http.post(apiConstants.endpoint.getProtectionTypesList, userInfoForm);

    /**
        return this.httpClient.post<IServerResponse>(
          'http://10.144.196.217:8080/insurance-needs-microservice/api/getProtectionTypesList',
          userInfoForm)
          .pipe(
            catchError(this.handleError)
          );
    */
    //const url = 'http://10.144.196.217:8080/insurance-needs-microservice/api/getProtectionTypesList';
    return this.http.post(apiConstants.endpoint.getProtectionTypesList, userInfoForm)
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
            localUrl = '../assets/mock-data/getProtectionList.json';
            return this.httpClient.get<IServerResponse>(localUrl);
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  getRecommendations(payload: IRecommendationRequest) {
    // const url = 'http://10.151.45.206:8080/recommendations-microservice/api/getRecommendations';

    // return this.httpClient.post(url, payload);

    return this.http.post(apiConstants.endpoint.getRecommendations, payload)
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
            return throwError('API returned error response');
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  getQuestionsList() {
    const url = '../assets/mock-data/questions.json';
    //const url = "http://10.144.196.214:8080/investment-microservice/RiskAssessment";
    return this.http.get(url)
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

  savePersonalInfo(data) {
    //const url = 'http://bfa-uat.ntuclink.cloud/insurance-needs-microservice/api/getProtectionTypesList';
    const url = '../assets/mock-data/setPersonalInfo.json';
    return this.http.post(url, data)
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
            let localUrl = '../assets/mock-data/setPersonalInfo.json';
            return this.httpClient.get<IServerResponse>(localUrl);
          }
          // return an observable with a user-facing error message
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  getCountryCodeList() {
    const url = 'assets/country-data/phone.json';
    return this.http.get(url);
  }

  requestOneTimePassword(mobileNumber) {
    return this.http.post(apiConstants.endpoint.getProtectionTypesList, mobileNumber)
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
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
      })
    );
  }

  verifyOneTimePassword(code) {
    return this.http.post(apiConstants.endpoint.getProtectionTypesList, code)
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
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
      })
    );
  }

  verifyEmail(verificationCode) {
    return this.http.post(apiConstants.endpoint.getProtectionTypesList, verificationCode)
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
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
      })
    );
  }

}
