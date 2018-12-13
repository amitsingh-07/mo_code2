import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService, IConfig } from './../../config/config.service';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  showFooter = false;
  isMaintenanceEnabled = false;
  constructor(
    private footerService: FooterService, private cdr: ChangeDetectorRef,
    public readonly translate: TranslateService, private configService: ConfigService) {
    this.translate.use('en');
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isMaintenanceEnabled = config.maintenanceEnabled;
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.footerService.currentFooterVisibility.subscribe((showFooter) => {
      this.showFooter = showFooter;
      this.cdr.detectChanges();
    });
  }

}
