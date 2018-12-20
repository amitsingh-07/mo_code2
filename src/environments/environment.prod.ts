import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  isDebugMode: false,
  apiBaseUrl: 'https://moneyowl.com.sg',
  apiBaseUrl2: 'https://bfa-uat.ntucbfa.com',
  myInfoClientId: 'PROD-201820691C-MONEYOWL-BFA',
  myInfoCallbackBaseUrl: 'https://moneyowl.com.sg/myinfo',
  myInfoAuthorizeUrl: 'https://myinfosg.api.gov.sg/v2/authorise',
  gtagPropertyId: 'AW-782920447',
  gaPropertyId: 'UA-125256446-3',
  fbPropertyId: '1436376216665984',
};
