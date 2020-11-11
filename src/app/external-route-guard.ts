import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
import { EXT_ROUTE_CONST, EXT_ROUTES } from './external-routes.constants';

@Injectable()
export class ExternalRouteGuard implements CanActivate {
  constructor() { }

  // Guard to route old module in app to external url like WordPress homepage
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const searchResult = EXT_ROUTES.ROUTE_URL.filter( (x) =>  x.IN_APP_ROUTE === state.url);
    // Check if the url is in the list of required routing
    if (searchResult.length) {
      // Check if hideHompage is set or not, else route to UAT url
      if (environment.hideHomepage) {
        window.location.href = searchResult[0].EXTERNAL_URL;
      } else {
        window.location.assign(EXT_ROUTE_CONST.UAT_DOMAIN + searchResult[0].EXTERNAL_URL);
      }
      return false;
    } else {
      // Route to promotions page if theres is promotions in the url else not found page
      if (state.url.startsWith(EXT_ROUTE_CONST.PROMOTION_LINK)) {
        if (environment.hideHomepage) {
          window.location.href = EXT_ROUTE_CONST.PROMOTION_LINK;
        } else {
          window.location.assign(EXT_ROUTE_CONST.UAT_DOMAIN + EXT_ROUTE_CONST.PROMOTION_LINK);
        }
        return false;
      } else {
        return true;
      }
    }
  }
}
