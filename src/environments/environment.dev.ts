import { isDebugMode } from '../app/shared/logger/console-logger.service';
import { IEnvironment } from './environment.interface';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
  production: false,
  isDebugMode: true,
  apiBaseUrl: 'https://bfa-dev2.ntucbfa.cloud',
  myInfoClientId: 'STG2-MYINFO-SELF-TEST',
  myInfoCallbackBaseUrl: 'https://bfa-dev.ntucbfa.cloud/myinfo',
  myInfoAuthorizeUrl: 'https://test.api.myinfo.gov.sg/com/v3/authorise',
  gAdPropertyId: 'AW-782920447',
  gaPropertyId: 'UA-125256446-1'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
