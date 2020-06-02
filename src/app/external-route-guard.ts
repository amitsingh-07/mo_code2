import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { environment } from './../environments/environment';
import { EXT_ROUTES } from './external-routes.constants';

@Injectable()
export class ExternalRouteGuard implements CanActivate {
  constructor(private router: Router) { }

  // Guard to route old module in app to external url like WordPress homepage
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const searchResult = EXT_ROUTES.ROUTE_URL.filter( (x) =>  x.IN_APP_ROUTE === state.url);
    // Check if the url is in the list of required routing
    if (searchResult.length) {
      // Check if hideHompage is set or not, else route to UAT url
      if (environment.hideHomepage) {
        window.location.href = searchResult[0].EXTERNAL_URL;
      } else {
        window.location.assign(searchResult[0].UAT_URL);
      }
      return false;
    } else {
      return true;
    }
  }
}
