import { BaseService } from './base.service';
import { HttpService } from './http.service';
import { ConfigService, Config } from './../../config/config.service';
import { Injectable } from '@angular/core';
import { ServerResponse } from './interfaces/server-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  config: Config;

  constructor(private configService: ConfigService, private http: BaseService) {
    this.configService.getConfig().subscribe((data: Config) => this.config = { ...data });
  }

  getProfile() {
    this.http.get(`${this.config.apiBaseUrl}/profile`).subscribe((data: ServerResponse) => {
      console.log('profile data :' + data);
    });
  }
}
