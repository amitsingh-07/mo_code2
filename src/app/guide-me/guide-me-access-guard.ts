import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { GUIDE_ME_ROUTE_PATHS } from './guide-me-routes.constants';

@Injectable()
export class GuideMeAccessGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.getToken() === null && this.authService.getSessionId() === null) {
      this.authService.authenticate().subscribe((token) => {
        this.router.navigate([GUIDE_ME_ROUTE_PATHS.PROFILE]);
      });
      return false;
    } else {
      return true;
    }
  }
}
