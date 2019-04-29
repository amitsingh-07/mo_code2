import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SIGN_UP_ROUTE_PATHS } from './sign-up.routes.constants';
import { SignUpService } from './sign-up.service';

@Injectable()
export class SignUpAccessGuard implements CanActivate {
  constructor(private signUpService: SignUpService,
              private myRoute: Router
            ) {
  }
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|Promise<boolean>|boolean {
   if (!this.signUpService.getCustomerRef()) {
        this.myRoute.navigate([SIGN_UP_ROUTE_PATHS.CREATE_ACCOUNT]);
        return false;
    }
    return true;
  }
}
