import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ConfigService, IConfig } from './../../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  private footerVisibility = new BehaviorSubject(false);
  isMaintenanceEnabled: boolean;
  currentFooterVisibility = this.footerVisibility.asObservable();

  constructor(private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isMaintenanceEnabled = config.maintenanceEnabled;
      console.log(this.isMaintenanceEnabled);
    });
  }

  setFooterVisibility(isVisible: boolean) {
    this.footerVisibility.next(isVisible);
    }
}
