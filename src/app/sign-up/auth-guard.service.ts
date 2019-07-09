import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from './sign-up.routes.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private route: Router,
              private authService: AuthenticationService
  ) {
  }
  canActivate(): boolean {
    if (!this.authService.isSignedUser()) {
      this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:max-classes-per-file
export class LoggedUserService implements CanActivate {
  constructor(private route: Router,
              private authService: AuthenticationService
  ) {
  }
  canActivate(): boolean {
    if (this.authService.isSignedUser()) {
      this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
      return false;
    }
    return true;
  }
}
