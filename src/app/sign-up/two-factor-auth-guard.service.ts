import { Injectable } from '@angular/core';
import { CanActivate, GuardsCheckEnd, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppService } from '../app.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from './sign-up.routes.constants';
import { SignUpService } from './sign-up.service';
import { TranslateService } from '@ngx-translate/core';
import { SIGN_UP_CONFIG } from './sign-up.constant';

@Injectable({
  providedIn: 'root'
})
export class TwoFactorAuthGuardService implements CanActivate {
  constructor(private route: Router,
    private appService: AppService,
    private authService: AuthenticationService,
    private signUpService: SignUpService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.appService.setJourneyType('');
    this.signUpService.setRedirectUrl(state.url);
    // Is Signed Users and is 2FA verified
    if (this.authService.isSignedUser() && this.authService.is2FAVerified()) {
      this.authService.setFromJourney(SIGN_UP_ROUTE_PATHS.EDIT_PROFILE, false);
      this.authService.set2faVerifyAllowed(false);
      return true;
    } else if (!this.authService.isSignedUser()) {
      this.authService.set2faVerifyAllowed(false);
      this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    } else {
      this.route.navigate([SIGN_UP_ROUTE_PATHS.VERIFY_2FA]);
      return false;
    }
	  
  }
}

@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:max-classes-per-file
export class TwoFactorScreenGuardService implements CanActivate {
  error2fa: any;
  constructor(private route: Router, private authService: AuthenticationService
  ) {}

  canActivate(): boolean {
    if(SIGN_UP_CONFIG.AUTH_2FA_ENABLED && this.authService.isSignedUserWithRole(SIGN_UP_CONFIG.ROLE_2FA)) {
      if (!this.authService.get2faVerifyAllowed()) {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
        return false;
      }
      this.authService.send2faRequestLogin().subscribe((data) => {
        if (data.responseMessage.responseCode !== 6000) {
          this.authService.get2faSendError.next(true);
        }
      });
      return true;
    } else if(this.authService.isSignedUser()) {
      if (!this.authService.get2faVerifyAllowed()) {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
        return false;
      }
      this.authService.send2faRequest().subscribe((data) => {
        if (data.responseMessage.responseCode !== 6000) {
          this.authService.get2faSendError.next(true);
        }
      });
      return true;
    } else if (!this.authService.isSignedUser()) {
      this.authService.set2faVerifyAllowed(false);
      this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    } 
  }
}