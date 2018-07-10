import { Component } from '@angular/core';
import { LoggerService } from './shared/logger/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bfa-frontend';

  constructor(private log: LoggerService) {
    log.i('This is info log');
    log.e('This is error log');
    log.w('This is warn log');
  }
}
