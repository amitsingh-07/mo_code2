import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  Request,
  RequestOptions,
  Response,
  XHRBackend
} from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { appConstants } from '../../app.constants';
import { AppModule } from '../../app.module';
import { HelperService } from './helper.service';

const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_AUTHORIZATION = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class HttpService extends Http {

  constructor(backend: XHRBackend, options: RequestOptions, private helperService: HelperService, private router: Router) {
    super(backend, options);
  }

  request(
    url: string | Request,
    options?: RequestOptions
  ): Observable<Response> {
    if (typeof url === 'string') {
      if (!options) {
        // let's make an option object
        options = new RequestOptions({ headers: new Headers() });
      }
      this.createRequestOptions(options);
    } else {
      this.createRequestOptions(url);
    }
    return super.request(url, options).catch(this.catchAuthError(this));
  }

  createRequestOptions(options: RequestOptions | Request) {
    const token: string = localStorage.getItem(
      appConstants.accessTokenLocalStorage
    );
    if (
      this.helperService.addContentTypeHeader &&
      typeof this.helperService.addContentTypeHeader === 'string'
    ) {
      options.headers.append(
        HEADER_CONTENT_TYPE,
        this.helperService.addContentTypeHeader
      );
    } else {
      const contentTypeHeader: string = options.headers.get(
        HEADER_CONTENT_TYPE
      );
      if (!contentTypeHeader && this.helperService.addContentTypeHeader) {
        options.headers.append(
          HEADER_CONTENT_TYPE,
          appConstants.defaultContentTypeHeader
        );
      }
      options.headers.append(HEADER_AUTHORIZATION, token);
    }
  }

  catchAuthError(self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        localStorage.removeItem(appConstants.userLocalStorage);
        localStorage.removeItem(appConstants.accessTokenLocalStorage);
        this.router.navigate([appConstants.loginPageUrl]);
      }
      return Observable.throw(res);
    };
  }
}
