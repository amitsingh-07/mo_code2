import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import { GUIDE_ME_ROUTE_PATHS } from './guide-me-routes.constants';
import { GuideMeService } from './guide-me.service';

@Injectable()
export class GuideMeAccessGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private appService: AppService
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.getToken() === null && this.authService.getSessionId() === null) {
      this.authService.authenticate().subscribe((token) => {
        if (this.appService.getCorporateDetails() && this.appService.getCorporateDetails().organisationEnabled) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: { orgID: this.appService.getCorporateDetails().uuid } });
        } else {
          this.router.navigate([GUIDE_ME_ROUTE_PATHS.PROFILE]);
        }
      });
      return false;
    } else {
      return true;
    }
  }
}

@Injectable()
export class MyinfoAssetsAccessGuard implements CanActivate {
  constructor(
    private router: Router,
    private guideMeService: GuideMeService
  ) {
  }
  canActivate(): boolean {
    if (!this.guideMeService.myinfoValueRequested$.value) {
      this.router.navigate([GUIDE_ME_ROUTE_PATHS.EXPENSES]);
      return false;
    } else {
      return true;
    }
  }
}
