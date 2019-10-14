import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { appConstants } from '../../app.constants';
import { ConfigService, IConfig } from '../../config/config.service';

@Injectable()
export class InvestmentEnableGuard implements CanActivate {
  isInvestmentEngagementEnabled = false;
  constructor(private configService: ConfigService, private router: Router) {
  }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.configService.getConfig().map((config: IConfig) => {
      this.isInvestmentEngagementEnabled = config.investmentEngagementEnabled;
      if (this.isInvestmentEngagementEnabled) {
        return true;
      } else {
        this.router.navigate([appConstants.homePageUrl]);
        return false;
      }
    });
  }
}
