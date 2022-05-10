import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';

import { DIRECT_BASE_ROUTE, DIRECT_ROUTES } from './direct-routes.constants';
import { DirectService } from './direct.service';

@Injectable()
export class DirectAccessGuard implements CanActivate {
    constructor(
        private router: Router, private directService: DirectService,
        private appService: AppService,
        private authService: AuthenticationService
    ) {
    }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const selectedPlans = this.directService.getSelectedPlans();
        if (!this.authService.isSignedUser() && this.appService.getCorporateDetails().organisationEnabled) {
            this.router.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: { orgID: this.appService.getCorporateDetails().uuid } });
        } else if (route.routeConfig.path === DIRECT_ROUTES.COMPARE_PLANS && (!selectedPlans || selectedPlans.length === 0)) {
            if (this.appService.getCorporateDetails().organisationEnabled) {
                this.router.navigate([SIGN_UP_ROUTE_PATHS.CORPORATE_LOGIN], { queryParams: { orgID: this.appService.getCorporateDetails().uuid } });
            } else {
                this.router.navigate([DIRECT_BASE_ROUTE]);
            }
            return false;
        }
        return true;
    }
}
