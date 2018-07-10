import { appConstants } from './../../app.constants';
import { AppModule } from './../../app.module';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Request, RequestOptions, Response, XHRBackend } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService extends Http {

  helperService: HelperService;
  router: Router;

  constructor(backend: XHRBackend, options: RequestOptions) {
    super(backend, options);
    this.helperService = AppModule.injector.get(HelperService);
    this.router = AppModule.injector.get(Router);
  }

  request(url: string | Request, options?: RequestOptions): Observable<Response> {

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
    const token: string = localStorage.getItem(appConstants.accessTokenLocalStorage);
    if (this.helperService.addContentTypeHeader && typeof this.helperService.addContentTypeHeader === 'string') {
      options.headers.append('Content-Type', this.helperService.addContentTypeHeader);
    } else {
      const contentTypeHeader: string = options.headers.get('Content-Type');
      if (!contentTypeHeader && this.helperService.addContentTypeHeader) {
        options.headers.append('Content-Type', appConstants.defaultContentTypeHeader);
      }
      options.headers.append('Authorization', token);
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
