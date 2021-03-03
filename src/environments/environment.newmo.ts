import { isDebugMode } from '../app/shared/logger/console-logger.service';
import { IEnvironment } from './environment.interface';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
  production: true,
  isDebugMode: false,
  apiBaseUrl: 'https://newmouat1.ntucbfa.com',
  myInfoClientId: 'STG-201820691C-MONEYOWL-BFA',
  myInfoCallbackBaseUrl: 'https://newmouat1.ntucbfa.com/app/myinfo',
  myInfoAuthorizeUrl: 'https://test.api.myinfo.gov.sg/com/v3/authorise',
  gAdPropertyId: 'AW-782920447',
  gaPropertyId: 'UA-125256446-1',
  hideHomepage: true,
  mockInvestAccount: true,
  expire2faTime: 298,
  expire2faPollRate: 2,
  expire2faMaxCheck: 5,
  promoCodeJsonUrl: 'https://mo-static-assets.s3-ap-southeast-1.amazonaws.com/promo/non-prod/promo-details.json'
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
