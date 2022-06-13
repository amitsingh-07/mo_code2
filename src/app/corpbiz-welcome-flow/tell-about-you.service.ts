import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { apiConstants } from '../shared/http/api.constants';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { BaseService } from '../shared/http/base.service';
import { HelperService } from '../shared/http/helper.service';



@Injectable({
  providedIn: 'root'
})
export class TellAboutYouService {

  constructor(
    private apiService: ApiService,
    private authService: AuthenticationService,
    private http: BaseService,
    private httpClient: HttpClient,
    private helperService: HelperService,
  ) { }

//   downloadComprehensiveReport(payload): Observable<any> {
//     return this.http.postForBlobParam(apiConstants.endpoint.comprehensive.downloadComprehensiveReport, payload, false)
//         .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
// }

getDob() {
  return this.httpClient.get(apiConstants.endpoint.welcomeflow.getUserDob)
      .pipe(catchError((error: HttpErrorResponse) => this.helperService.handleError(error)));
}
}
