import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SelectedPlansService } from '../shared/Services/selected-plans.service';
import { DIRECT_BASE_ROUTE, DIRECT_ROUTES } from './direct-routes.constants';
import { DirectService } from './direct.service';

@Injectable()
export class DirectAccessGuard implements CanActivate {
    constructor(
        private myRoute: Router, private directService: DirectService
    ) {
    }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const selectedPlans = this.directService.getSelectedPlans();
        if (route.routeConfig.path === DIRECT_ROUTES.COMPARE_PLANS && (!selectedPlans || selectedPlans.length === 0)) {
            this.myRoute.navigate([DIRECT_BASE_ROUTE]);
            return false;
        }
        return true;
    }
}
