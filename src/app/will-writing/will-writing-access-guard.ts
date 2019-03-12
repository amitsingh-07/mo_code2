import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { WILL_WRITING_ROUTE_PATHS } from './will-writing-routes.constants';
import { WillWritingService } from './will-writing.service';

@Injectable()
export class WillWritingAccessGuard implements CanActivate {
  constructor(
    private willWritingService: WillWritingService,
    private router: Router
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const promoCode = this.willWritingService.getPromoCode();
    if (Object.keys(promoCode).length === 0 && promoCode.constructor === Object && !this.willWritingService.getIsWillCreated()) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.INTRODUCTION]);
      return false;
    }
    return true;
  }
}
