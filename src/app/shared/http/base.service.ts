import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { appConstants } from './../../app.constants';
import { ConfigService, IConfig } from './../../config/config.service';
import { CustomErrorHandlerService } from './custom-error-handler.service';
import { HelperService } from './helper.service';
import { HttpService } from './http.service';
import { IError } from './interfaces/error.interface';
import { IServerResponse } from './interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  config$: Observable<IConfig>;

  constructor(
    public http: HttpService,
    public errorHandler: CustomErrorHandlerService,
    public helperService: HelperService,
    public configService: ConfigService
  ) {
    this.config$ = this.configService.getConfig();
  }
  get(url) {
    // Helper service to start ng2-slim-loading-bar progress bar
    this.helperService.showLoader();
    return this.config$.mergeMap( (config) => {
    return this.http
      .get(`${config.apiBaseUrl}/${url}`)
      .map((res: Response) => {
        return this.handleResponse(res);
      })
      .catch((error: Response) =>
        Observable.throw(this.errorHandler.tryParseError(error))
      )
      .finally(() => {
        // stop ng2-slim-loading-bar progress bar
        this.helperService.hideLoader();
      });
    });
  }

  post(url, postBody: any, options?: RequestOptions) {
    this.helperService.showLoader();
    if (options) {
      return this.http
        .post(url, postBody, options)
        .map((res: Response) => {
          return this.handleResponse(res);
        })
        .catch((error: Response) => Observable.throw(error))
        .finally(() => {
          this.helperService.hideLoader();
        });
    } else {
      return this.http
        .post(url, postBody)
        .map((res: Response) => {
          return this.handleResponse(res);
        })
        .catch((error: Response) => Observable.throw(error))
        .finally(() => {
          this.helperService.hideLoader();
        });
    }
  }

  delete(url, postBody: any) {
    this.helperService.showLoader();
    return this.http
      .delete(url)
      .map((res: Response) => {
        return this.handleResponse(res);
      })
      .catch((error: Response) => Observable.throw(error))
      .finally(() => {
        this.helperService.hideLoader();
      });
  }

  put(url, putData) {
    this.helperService.showLoader();
    return this.http
      .put(url, putData)
      .map((res: Response) => {
        return this.handleResponse(res);
      })
      .catch((error: Response) => Observable.throw(error))
      .finally(() => {
        this.helperService.hideLoader();
      });
  }

  upload(url: string, file: File) {
    const formData: FormData = new FormData();
    if (file) {
      formData.append('files', file, file.name);
    }
    this.helperService.addContentTypeHeader = false;
    return this.post(url, formData);
  }

  formUrlParam(url, data) {
    let queryString = '';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (!queryString) {
          queryString = `?${key}=${data[key]}`;
        } else {
          queryString += `&${key}=${data[key]}`;
        }
      }
    }
    return url + queryString;
  }

  handleResponse(res: Response): IServerResponse {
    // My API sends a new jwt access token with each request,
    // so store it in the local storage, replacing the old one.
    this.refreshToken(res);
    const data = res.json();
    if (data.error) {
      const error: IError = { error: data.error, message: data.message };
      throw new Error(this.errorHandler.parseCustomServerErrorToString(error));
    } else {
      return data;
    }
  }

  refreshToken(res: Response) {
    const token = res.headers.get(appConstants.accessTokenServer);
    if (token) {
      localStorage.setItem(appConstants.accessTokenLocalStorage, `${token}`);
    }
  }
}
