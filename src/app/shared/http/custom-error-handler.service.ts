import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

import { appConstants } from './../../app.constants';
import { AuthenticationService } from './auth/authentication.service';
import { HelperService } from './helper.service';
import { IError } from './interfaces/error.interface';
import { IServerResponse } from './interfaces/server-response.interface';

const errorCodes = new Set([5007, 5009]);

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService {
  constructor(
    private helper: HelperService,
    private router: Router) { }

  public handleCustomError(data: IServerResponse, showError?: boolean) {
    if (!errorCodes.has(data.responseMessage.responseCode)) {
      const error: IError = {
        error: data.responseMessage.responseCode,
        message: data.responseMessage.responseDescription
      };
      if (typeof showError === 'undefined' || showError) {
        this.helper.showCustomErrorModal(error);
      }
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
    const customError: IError = {
      error: [],
      message: (error.error && error.error.message) ? error.error.message : 'Your session has unexpectedly expired. Please login again'
    };
    this.helper.showCustomErrorModal(customError);
    // navigate back to the login page
    this.router.navigate([appConstants.loginPageUrl]);
  }

  /*
    * Handle Subscribe errors.
    */
  public handleSubscribeError(httpError: HttpErrorResponse) {
    if (httpError.error instanceof ErrorEvent) {
      console.error('An error occured do nothing let it flow');
    } else {
      console.log('Do nothing let it flow');
      }
    return throwError(
      'Something bad happened; please try again later.');
  }

  public handleError(httpError: HttpErrorResponse) {
    if (httpError.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', httpError.error.message);
    } else if (httpError.error && httpError.error.error) {
      const error: IError = {
        error: httpError.error.error,
        message: httpError.error.message
      };
      this.helper.showHttpErrorModal(error);
      throw new Error(this.parseCustomServerErrorToString(error));
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
    if (error.message && error.error) {
      const title = error.message;
      let body = '';
      for (const errorMsg of error.error) {
        body += `${errorMsg}. `;
      }

      return { title, body };
    } else {
      return { title: 'unknown', body: 'unknown' };
    }
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
