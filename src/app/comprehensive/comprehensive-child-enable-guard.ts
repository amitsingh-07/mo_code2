import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from 'src/app/shared/components/loader/loader.service';

import { appConstants } from '../app.constants';
import { AppService } from '../app.service';
import { ConfigService, IConfig } from '../config/config.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SignUpService } from '../sign-up/sign-up.service';
import { SIGN_UP_ROUTE_PATHS } from './../sign-up/sign-up.routes.constants';
import { ComprehensiveApiService } from './comprehensive-api.service';
import { COMPREHENSIVE_BASE_ROUTE } from './comprehensive-routes.constants';
import { ComprehensiveService } from './comprehensive.service';

@Injectable()
export class ComprehensiveChildEnableGuard implements CanActivateChild {
  isComprehensiveEnabled = false;
  wait = false;
  constructor(
    private configService: ConfigService, private router: Router,
    private authService: AuthenticationService, private appService: AppService,
    private signUpService: SignUpService, private cmpService: ComprehensiveService,
    private loaderService: LoaderService, private cmpApiService: ComprehensiveApiService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isComprehensiveEnabled = config.comprehensiveEnabled;
    });
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isComprehensiveEnabled) {
      this.router.navigate([appConstants.homePageUrl]);
      return false;
    } else if (!this.authService.isSignedUser()) {
      this.appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
      this.signUpService.setRedirectUrl(COMPREHENSIVE_BASE_ROUTE);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.LOGIN]);
      return false;
    } 
    // else if (!this.cmpService.getComprehensiveSummary().comprehensiveEnquiry
    //   || !this.cmpService.getComprehensiveSummary().comprehensiveEnquiry.enquiryId) {
    //   this.wait = true;
    //   this.appService.setJourneyType(appConstants.JOURNEY_TYPE_COMPREHENSIVE);
    //   // this.loaderService.showLoader({ title: 'Fetching Data' });
    //   this.cmpApiService.getComprehensiveSummary().subscribe((data: any) => {
    //     this.cmpService.setComprehensiveSummary(data.objectList[0]);
    //     // this.loaderService.hideLoader();
    //     return true;
    //   });
    // }
    return true;
  }
}

