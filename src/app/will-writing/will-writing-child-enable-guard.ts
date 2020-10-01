import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService, IConfig } from '../config/config.service';
import { appConstants } from './../app.constants';

@Injectable()
export class WillWritingChildEnableGuard implements CanActivateChild {
  constructor(private configService: ConfigService, private router: Router) { }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
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
