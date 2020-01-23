import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfigService, IConfig } from '../config/config.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';

@Injectable()
export class PaymentChildEnableGuard implements CanActivateChild {
  isPaymentEnabled = false;
  hasPaid = false;

  constructor(
    private configService: ConfigService, private router: Router,
    private authService: AuthenticationService,
    private signUpService: SignUpService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isPaymentEnabled = config.paymentEnabled;
    });
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isSignedUser()) {
      // Navigate only if payment enabled and user has not paid
      if (this.isPaymentEnabled && !this.hasPaid) {
        return true;
      } else {
        return false;
      }
    } else {
      // User is not logged in, redirect to login page
      this.signUpService.setRedirectUrl(state.url);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    }
  }
}
