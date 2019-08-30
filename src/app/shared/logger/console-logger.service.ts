import { Injectable } from '@angular/core';
import { AppConfigService } from './../../app-config.service';
import { Logger } from './logger';

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  get error() {
    if (AppConfigService.settings.isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    console.log('SETTINGS ==== ', AppConfigService.settings)
    if (AppConfigService.settings.isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (AppConfigService.settings.isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  e(args?: any): void {
    const logFn: () => any = (console)['error'] || console.log || noop;
    logFn.apply(console, [args]);
  }

  i(args?: any): void {
    const logFn: () => any = (console)['info'] || console.log || noop;
    logFn.apply(console, [args]);
  }

  w(args?: any): void {
    const logFn: () => any = (console)['warn'] || console.log || noop;
    logFn.apply(console, [args]);
  }
}
