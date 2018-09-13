import 'rxjs/add/operator/do';

import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { appConstants } from './../../../app.constants';
import { CustomErrorHandlerService } from './../custom-error-handler.service';
import { IError } from './../interfaces/error.interface';
import { IServerResponse } from './../interfaces/server-response.interface';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        public auth: AuthenticationService, private router: Router,
        public errorHandler: CustomErrorHandlerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `${this.auth.getToken()}`
            })
        });

        return next.handle(request).do((event: HttpEvent<IServerResponse>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
                const data = event.body;
                if (data.responseMessage && data.responseMessage.responseCode < 6000) {
                    const error: IError = {
                        error: data.responseMessage.responseCode,
                        message: data.responseMessage.responseDescription
                    };
                    throw new Error(this.errorHandler.parseCustomServerErrorToString(error));
                } else {
                    return data;
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403) {
                    this.errorHandler.handleAuthError(err);
                    this.router.navigate([appConstants.loginPageUrl]);
                } else {
                    this.errorHandler.handleError(err);
                }
            }
        });
    }
}
