import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AppService } from '../app.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS, EDIT_PROFILE_PATH } from './sign-up.routes.constants';
import { SignUpService } from './sign-up.service';
import { SIGN_UP_CONFIG } from './sign-up.constant';
import { appConstants } from './../../app/app.constants';

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
      if (this.appService.getCorporateDetails().organisationEnabled) {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: {orgID: this.appService.getCorporateDetails().uuid}});
      } else {
        this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      }
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
  constructor(private route: Router, private authService: AuthenticationService,
  private signUpService: SignUpService,
  private appService: AppService
  ) {}

  canActivate(): boolean {
    if(SIGN_UP_CONFIG.AUTH_2FA_ENABLED && this.authService.isSignedUserWithRole(SIGN_UP_CONFIG.ROLE_2FA)) {
      if (!this.authService.get2faVerifyAllowed()) {
        if (this.signUpService.getUserType() === appConstants.USERTYPE.FINLIT) {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.FINLIT_LOGIN]);
          return false;
        } else if (this.signUpService.getUserType() === appConstants.USERTYPE.CORPORATE) {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: {orgID: this.appService.getCorporateDetails().uuid}});
          return false;
        } else {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
          return false;
        }
      }
      this.authService.send2faRequestLogin().subscribe((data) => {
        if (data.responseMessage.responseCode !== 6000) {
          this.authService.get2faSendError.next(true);
        }
      });
      return true;
    } else if(this.authService.isSignedUser()) {
      if (!this.authService.get2faVerifyAllowed()) {
        if(this.route.url && this.route.url === EDIT_PROFILE_PATH) {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
        } else {
          this.route.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);
        }
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