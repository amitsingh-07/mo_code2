import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SelectedPlansService } from '../shared/Services/selected-plans.service';
import { SIGN_UP_ROUTE_PATHS, SIGN_UP_ROUTES } from './sign-up.routes.constants';
import { SignUpService } from './sign-up.service';

@Injectable()
export class SignUpAccessGuard implements CanActivate {
  constructor(private signUpService: SignUpService,
              private myRoute: Router,
              private selectedPlansService: SelectedPlansService
            ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if ((route.routeConfig.path === SIGN_UP_ROUTES.VERIFY_MOBILE && !this.signUpService.getCustomerRef()) ||
    (route.routeConfig.path === SIGN_UP_ROUTES.PASSWORD  && !this.signUpService.getResetCode())) {
        this.myRoute.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
        return false;
    }
    return true;
  }
}
