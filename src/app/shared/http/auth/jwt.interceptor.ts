import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

import { Observable } from 'rxjs/Observable';

import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment.dev';
import { appConstants } from '../../../app.constants';
import { apiConstants } from '../api.constants';
import { CustomErrorHandlerService } from '../custom-error-handler.service';
import { RequestCache } from '../http-cache.service';
import { IServerResponse } from '../interfaces/server-response.interface';
import { AuthenticationService } from './authentication.service';

const exceptionUrlList: Set<string> = new Set([apiConstants.endpoint.authenticate]);

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        public auth: AuthenticationService, public cache: RequestCache,
        public errorHandler: CustomErrorHandlerService, public router: Router) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cachedResponse = this.cache.get(request);
        return cachedResponse ? Observable.of(cachedResponse) : this.sendRequest(request, next, this.cache);
    }

    sendRequest(
        request: HttpRequest<any>,
        next: HttpHandler,
        cache: RequestCache): Observable<HttpEvent<any>> {
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
                    this.errorHandler.handleCustomError(data);
                } else {
                    this.saveCache(request, event);
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

    saveCache(request: HttpRequest<any>, event: HttpResponse<IServerResponse>) {
        const apiPath = request.url.split(environment.apiBaseUrl + '/')[1];
        if (!exceptionUrlList.has(apiPath)) {
            this.cache.put(request, event);
        }
    }
}
