import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { appConstants } from '../app.constants';
import { ConfigService, IConfig } from '../config/config.service';

@Injectable()
export class InvestmentEnableGuard implements CanActivate {
  isInvestmentEnabled = false;
  constructor(private configService: ConfigService, private router: Router) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isInvestmentEnabled = config.investmentEnabled;
    });
  }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isInvestmentEnabled) {
      return true;
    } else {
      this.router.navigate([appConstants.homePageUrl]);
      return false;
    }
  }
}
