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
import { SignUpService } from '../../../sign-up/sign-up.service';
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
        public errorHandler: CustomErrorHandlerService, public router: Router, private signUpService: SignUpService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cachedResponse = this.cache.get(request);
        return cachedResponse ? Observable.of(cachedResponse) : this.sendRequest(request, next, this.cache);
    }

    // tslint:disable-next-line:cognitive-complexity
    sendRequest(
        request: HttpRequest<any>,
        next: HttpHandler,
        cache: RequestCache): Observable<HttpEvent<any>> {

        if (request.url.indexOf('getCaptcha') > -1) {
            request = request.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'image/png',
                    'Authorization': `${this.auth.getToken()}`
                })
            });
        } else if (request.url.indexOf('saveDocuments') > -1) { // for upload documents
            request = request.clone({
                headers: new HttpHeaders({
                    Authorization: `${this.auth.getToken()}`
                })
            });
        } else if (request.url.indexOf('authenticate') > -1) { // for login{
            request = request.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `${this.auth.getAppSecretKey()}`
                })
            });
        } else {
            request = request.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `${this.auth.getToken()}`
                })
            });
        }
        return next.handle(request).do((event: HttpEvent<IServerResponse>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
                const data = event.body;
                if (data.responseMessage && data.responseMessage.responseCode < 6000) {
                    let showError = true;
                    let selfHandleError = false;
                    const queryMap = this.parseQuery(event.url);
                    if (queryMap['alert'] && queryMap['alert'] === 'false') {
                        showError = false;
                    } else if (queryMap['handleError'] && queryMap['handleError'] === 'true') {
                        selfHandleError = true;
                    }

                    if (selfHandleError) {
                        return event.body;
                    } else {
                        this.errorHandler.handleCustomError(data, showError);
                    }
                } else {
                    this.saveCache(request, event);
                    return data;
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403) {
                    this.auth.clearSession();
                    this.signUpService.logoutUser();
                    this.errorHandler.handleAuthError(err);
                } else
                if (err.message.match('I/O error on PUT request')) {
                    this.errorHandler.handleSubscribeError(err);
                    }
                } else {
                    this.errorHandler.handleError(err);
                }
        });
    }

    saveCache(request: HttpRequest<any>, event: HttpResponse<IServerResponse>) {
        const apiPath = request.url.split(window.location.host + '/')[1];
        if (!exceptionUrlList.has(apiPath)) {
            this.cache.put(request, event);
        }
    }

    parseQuery(queryString) {
        const hashes = queryString.slice(queryString.indexOf('?') + 1).split('&');
        return hashes.reduce((params, hash) => {
            const split = hash.indexOf('=');
            const key = hash.slice(0, split);
            const val = hash.slice(split + 1);
            return Object.assign(params, { [key]: decodeURIComponent(val) });
        }, {});
    }
}
