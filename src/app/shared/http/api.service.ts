import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { ConfigService, IConfig } from './../../config/config.service';
import { apiConstants } from './api.constants';
import { BaseService } from './base.service';
import { IServerResponse } from './interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  config: IConfig;

  constructor(private configService: ConfigService, private http: BaseService) {
    const apiService = this;
    this.config = {
      apiBaseUrl: 'http://10.144.196.217:8080',
      useMyInfo: false
    };

    this.configService.getConfig()
    .subscribe((data: IConfig) => {
      apiService.config = data;
    });
  }

  getProfileList() {
    return this.http.get(`${this.config.apiBaseUrl}/${apiConstants.endpoint.getProfileList}`).subscribe((data: IServerResponse) => {
      console.log('profile data :' + data);
      return data;
    });
  }
}
