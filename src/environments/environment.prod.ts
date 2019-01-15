import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  isDebugMode: false,
  apiBaseUrl: 'https://www.moneyowl.com.sg',
  myInfoClientId: 'PROD-201820691C-MONEYOWL-BFA',
  myInfoCallbackBaseUrl: 'https://www.moneyowl.com.sg/myinfo',
  myInfoAuthorizeUrl: 'https://myinfosg.api.gov.sg/v2/authorise',
  gtagPropertyId: 'AW-782920447',
  gaPropertyId: 'UA-125256446-3',
  fbPropertyId: '1436376216665984',
};
