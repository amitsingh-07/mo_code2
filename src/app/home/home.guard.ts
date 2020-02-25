import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfigService, IConfig } from '../config/config.service';

import { environment } from 'src/environments/environment';

@Injectable()
export class HomeGuard implements CanActivate {

  constructor(
    private configService: ConfigService, private router: Router) {
    this.configService.getConfig().subscribe((config: IConfig) => {
    });
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (environment.hideHomepage) {
        this.router.navigate(['/page-not-found']);
        return false;
    } else {
        return true;
    }
  }
}
