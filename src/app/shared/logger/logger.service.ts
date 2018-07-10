import { Injectable } from '@angular/core';

import { Logger } from './logger';

@Injectable({
  providedIn: 'root'
})
export class LoggerService implements Logger {
  error: any;
  info: any;
  warn: any;

  e(args?: any): void {}
  i(args?: any): void {}
  w(args?: any): void {}
}
