import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ConfigService, IConfig } from './../config/config.service';

@Injectable()
export class WillWritingEnableGuard implements CanActivate {
  isWillWritingEnabled = false;
  constructor(private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isWillWritingEnabled = config.willWritingEnabled;
    });
  }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.isWillWritingEnabled;
  }
}
