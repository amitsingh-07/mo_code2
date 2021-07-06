
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService, IConfig } from '../config/config.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';
import { PAYMENT_ROUTES } from './payment-routes.constants';
import { PaymentService } from './payment.service';
import { ComprehensiveService } from '../comprehensive/comprehensive.service';

@Injectable()
export class PaymentChildEnableGuard implements CanActivateChild {
  isPaymentEnabled = false;

  constructor(
    private configService: ConfigService, private router: Router,
    private authService: AuthenticationService,
    private signUpService: SignUpService,
    private paymentService: PaymentService,
    private comprehensiveService: ComprehensiveService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isPaymentEnabled = config.paymentEnabled;
    });
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isSignedUser()) {
      // Navigate only if payment enabled and user has not paid
      // Skip for payment-status page
      if (state.url.includes(PAYMENT_ROUTES.PAYMENT_INSTRUCTION)) {
        const comprehensiveJourneyMode = this.comprehensiveService.getComprehensiveVersion();
        if(!comprehensiveJourneyMode) {
          this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
          return false;
        } else {
          return true;
        }
      } else {
        const comprehensiveJourneyMode = this.comprehensiveService.getComprehensiveVersion();
        if (this.isPaymentEnabled && comprehensiveJourneyMode) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      // User is not logged in, redirect to login page
      //this.signUpService.setRedirectUrl(state.url);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    }
  }
}
