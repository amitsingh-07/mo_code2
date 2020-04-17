import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { appConstants } from '../app.constants';
import { AppService } from '../app.service';
import { ConfigService, IConfig } from '../config/config.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';
import { ProgressTrackerUtil } from './../shared/modal/progress-tracker/progress-tracker-util';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';
import { COMPREHENSIVE_BASE_ROUTE } from './comprehensive-routes.constants';

@Injectable()
export class ComprehensiveEnableGuard implements CanActivate {
  isComprehensiveEnabled = false;
  constructor(
    private configService: ConfigService, private router: Router,
    private authService: AuthenticationService, private appService: AppService,
    private signUpService: SignUpService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.configService.getConfig().pipe(map((config: IConfig) => {
      if (config && !config.comprehensiveEnabled) {
        this.router.navigate([appConstants.homePageUrl]);
        return false;
      } else {
        this.appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
        if (ProgressTrackerUtil.compare(state.url, COMPREHENSIVE_BASE_ROUTE)) {
          this.signUpService.clearRedirectUrl();
          return true;
        } else if (!this.authService.isSignedUser()) {
          this.signUpService.setRedirectUrl(state.url);
          this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
          return false;
        }
        return true;
      }
    }));
  }
}
