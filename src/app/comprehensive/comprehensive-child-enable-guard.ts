import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { appConstants } from '../app.constants';
import { AppService } from '../app.service';
import { ConfigService, IConfig } from '../config/config.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';
import { COMPREHENSIVE_BASE_ROUTE } from './comprehensive-routes.constants';

@Injectable()
export class ComprehensiveChildEnableGuard implements CanActivateChild {
  isComprehensiveEnabled = false;
  constructor(
    private configService: ConfigService, private router: Router,
    private authService: AuthenticationService, private appService: AppService,
    private signUpService: SignUpService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isComprehensiveEnabled = config.comprehensiveEnabled;
    });
  }
  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isComprehensiveEnabled) {
      this.router.navigate([appConstants.homePageUrl]);
      return false;
    }
    // else if (!this.authService.isSignedUser()) {
    //   this.appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
    //   this.signUpService.setRedirectUrl(COMPREHENSIVE_BASE_ROUTE);
    //   this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
    //   return false;
    // }
    return true;
  }
}

