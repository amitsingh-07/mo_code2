import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import { WILL_WRITING_ROUTE_PATHS } from './will-writing-routes.constants';
import { WillWritingService } from './will-writing.service';

@Injectable()
export class WillWritingAccessGuard implements CanActivate {
  constructor(
    private willWritingService: WillWritingService,
    private router: Router,
    private appService: AppService,
    private authService: AuthenticationService
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const promoCode = this.willWritingService.getPromoCode();
    if (!this.authService.isSignedUser() && this.appService.getCorporateDetails().organisationEnabled) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: { orgID: this.appService.getCorporateDetails().uuid } });
    } else if (Object.keys(promoCode).length === 0 && promoCode.constructor === Object && !this.willWritingService.getIsWillCreated()) {
      if (this.appService.getCorporateDetails().organisationEnabled) {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: { orgID: this.appService.getCorporateDetails().uuid } });
      } else {
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.INTRODUCTION]);
      }
      return false;
    }
    return true;
  }
}

@Injectable()
export class WillWritingIntroductionGuard implements CanActivate {
  constructor(
    private router: Router,
    private appService: AppService,
    private authService: AuthenticationService
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isSignedUser() && this.appService.getCorporateDetails().organisationEnabled) {
      this.router.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: { orgID: this.appService.getCorporateDetails().uuid } });
      return false;
    }
    return true;
  }
}