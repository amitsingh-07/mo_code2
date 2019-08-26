import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { INVESTMENT_COMMON_CONSTANTS } from './investment-common.constants';

@Injectable({
  providedIn: 'root'
})
export class InvestmentCommonGuardService implements CanActivate {
  constructor(
    private route: Router
  ) {}
  canActivate(): boolean {
    return true;
  }
}
