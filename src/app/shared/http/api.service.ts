import { Injectable } from '@angular/core';

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
    this.configService.getConfig().subscribe((data: IConfig) => this.config = { ...data });
  }

  getProfile() {
    this.http.get(`${this.config.apiBaseUrl}/${apiConstants.endpoint.profile}`).subscribe((data: IServerResponse) => {
      console.log('profile data :' + data);
    });
  }
}
