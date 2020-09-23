import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { appConstants } from '../app.constants';
import { ConfigService, IConfig } from '../config/config.service';

@Injectable()
export class PromotionChildEnableGuard implements CanActivateChild {
  constructor(private configService: ConfigService, private router: Router) { }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.configService.getConfig().pipe(map((config: IConfig) => {
      if (config && config.promotionEnabled) {
        return true;
      } else {
        this.router.navigate([appConstants.homePageUrl]);
        return false;
      }
    }));
  }
}
