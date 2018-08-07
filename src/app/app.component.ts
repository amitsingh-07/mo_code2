import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LoggerService } from './shared/logger/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Money Owl';

  constructor(private log: LoggerService, private translate: TranslateService ) {
    this.translate.setDefaultLang('en');
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    console.log('Processing beforeunload...');
    // Do more processing...
    event.returnValue = true;
}
}
