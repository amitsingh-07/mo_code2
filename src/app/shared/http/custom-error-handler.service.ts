import { HelperService } from './helper.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { throwError } from 'rxjs';

import { AuthenticationService } from './auth/authentication.service';
import { IError } from './interfaces/error.interface';
import { IServerResponse } from './interfaces/server-response.interface';

const errorCodes =  new Set([5007, 5009]);

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService {
  constructor(private auth: AuthenticationService, private helper: HelperService) { }

  public handleCustomError(data: IServerResponse) {
    if (!errorCodes.has(data.responseMessage.responseCode)) {
      const error: IError = {
        error: data.responseMessage.responseCode,
        message: data.responseMessage.responseDescription
      };
      this.helper.showCustomErrorModal(error);
      throw new Error(this.parseCustomServerErrorToString(error));
    }
  }
  /*
    * Handle API authentication errors.
    */
  public handleAuthError(error: HttpErrorResponse) {
    // clear stored credentials; they're invalid
    // redirect to the login route
    // or show a modal
    this.auth.logout();
    // navigate back to the login page
    // this.router.navigate(['/login']);
  }

  public handleError(error: HttpErrorResponse) {
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

  tryParseError(error: Response): any {
    try {
      return error.json().error;
    } catch (ex) {
      try {
        return error;
      } catch (ex) {
        return error.toString();
      }
    }
  }

  parseCustomServerError(error: IError): any {
    const title = error.message;
    let body = '';
    for (const errorMsg of error.error) {
      body += `${errorMsg}. `;
    }

    return { title, body };
  }

  createCustomError(error: IError): Response {
    try {
      const parsedError = this.parseCustomServerError(error);
      const responseOptions = new ResponseOptions({
        body: {
          error: { title: parsedError.title, message: parsedError.body }
        },
        status: 400,
        headers: null,
        url: null
      });
      return new Response(responseOptions);
    } catch (ex) {
      const responseOptions = new ResponseOptions({
        body: { title: 'Unknown Error!', message: 'Unknown Error Occurred.' },
        status: 400,
        headers: null,
        url: null
      });
      return new Response(responseOptions);
    }
  }

  showToast(error: IError): void {
    const parsedError = this.parseCustomServerError(error);
  }

  parseCustomServerErrorToString(error: IError): string {
    this.showToast(error);
    const parsedError = this.createCustomError(error);
    try {
      return JSON.stringify(this.tryParseError(parsedError));
    } catch (ex) {
      try {
        return error.message.toString();
      } catch (error) {
        return error.toString();
      }
    }
  }
}
