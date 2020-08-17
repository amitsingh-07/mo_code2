import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { appConstants } from './../app.constants';
import { ConfigService, IConfig } from './../config/config.service';

@Injectable()
export class WillWritingEnableGuard implements CanActivate {
  constructor(private configService: ConfigService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.configService.getConfig().pipe(map((config: IConfig) => {
      if (config && config.willWritingEnabled) {
        return true;
      } else {
        this.router.navigate([appConstants.homePageUrl]);
        return false;
      }
    }));
  }
}
