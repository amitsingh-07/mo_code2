import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { appConstants } from '../app.constants';
import { AppService } from '../app.service';
import { ConfigService, IConfig } from '../config/config.service';
import { LoaderService } from '../shared/components/loader/loader.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';
import { ProgressTrackerUtil } from './../shared/modal/progress-tracker/progress-tracker-util';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';
import { ComprehensiveApiService } from './comprehensive-api.service';
import { COMPREHENSIVE_BASE_ROUTE } from './comprehensive-routes.constants';
import { ComprehensiveService } from './comprehensive.service';

@Injectable()
export class ComprehensiveEnableGuard implements CanActivate {
  isComprehensiveEnabled = false;
  constructor(
    private configService: ConfigService, private router: Router,
    private authService: AuthenticationService, private appService: AppService,
    private signUpService: SignUpService, private cmpService: ComprehensiveService,
    private loaderService: LoaderService, private cmpApiService: ComprehensiveApiService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isComprehensiveEnabled = config.comprehensiveEnabled;
    });
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isComprehensiveEnabled) {
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
  }
}
