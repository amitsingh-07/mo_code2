
import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { GoogleAnalyticsService } from './shared/ga/google-analytics.service';
import { LoggerService } from './shared/logger/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Money Owl';

  constructor(private log: LoggerService, private translate: TranslateService, private googleAnalyticsService: GoogleAnalyticsService) {
    this.translate.setDefaultLang('en');
  }

  onActivate(event) {
    window.scroll(0, 0);
  }
}
