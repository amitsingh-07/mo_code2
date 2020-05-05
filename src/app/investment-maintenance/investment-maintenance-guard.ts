import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ConfigService, IConfig } from '../config/config.service';
import { appConstants } from './../app.constants';

@Injectable()
export class InvestmentMaintenanceGuard implements CanActivate {
  constructor(private configService: ConfigService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.configService.getConfig().map((config: IConfig) => {
      // Check if iFast is in maintenance
      if (config.iFastMaintenance && this.configService.checkIFastStatus(config.maintenanceStartTime, config.maintenanceEndTime)) {
        return true;
      } else {
        window.open('/', '_self');
        return false;
      }
    });
  }
}
