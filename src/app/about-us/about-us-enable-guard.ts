import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { environment } from './../../environments/environment';

@Injectable()
export class AboutUsEnableGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (environment.hideHomepage) {
      this.router.navigate(['/page-not-found']);
      return false;
    } else {
      return true;
    }
  }
}
