import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Logger } from './logger.service';

export let isDebugMode = environment.isDebugMode;

const noop = (): any => undefined;

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements Logger {

  get error() {
    if (isDebugMode) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (isDebugMode) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (isDebugMode) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  e(args?: any): void {
    const logFn: Function = (console)['error'] || console.log || noop;
    logFn.apply(console, [args]);
  }

  i(args?: any): void {
    const logFn: Function = (console)['info'] || console.log || noop;
    logFn.apply(console, [args]);
  }

  w(args?: any): void {
    const logFn: Function = (console)['warn'] || console.log || noop;
    logFn.apply(console, [args]);
  }
}
