import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ConfigService, IConfig } from '../config/config.service';
import { appConstants } from './../app.constants';

@Injectable()
export class WillWritingChildEnableGuard implements CanActivateChild {
  isWillWritingEnabled = false;
  constructor(private configService: ConfigService, private router: Router) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isWillWritingEnabled = config.willWritingEnabled;
    });
  }
  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isWillWritingEnabled) {
      return true;
    } else {
      this.router.navigate([appConstants.homePageUrl]);
      return false;
    }
  }
}
