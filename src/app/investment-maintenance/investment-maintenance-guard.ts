
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ConfigService, IConfig } from '../config/config.service';

@Injectable()
export class InvestmentMaintenanceGuard implements CanActivate {
  constructor(private configService: ConfigService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.configService.getConfig().pipe(map((config: IConfig) => {
      // Check if iFast is in maintenance
      if (config.iFastMaintenance && this.configService.checkIFastStatus(config.maintenanceStartTime, config.maintenanceEndTime)) {
        return true;
      } else {
        window.open('/', '_self');
        return false;
      }
    }));
  }
}
