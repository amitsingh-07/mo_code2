import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  isDebugMode: false,
  apiBaseUrl: 'https://moneyowl.com.sg',
  myInfoClientId: 'PROD-201820691C-MONEYOWL-BFA',
  myInfoCallbackBaseUrl: 'https://www.moneyowl.com.sg/app/myinfo',
  myInfoAuthorizeUrl: 'https://api.myinfo.gov.sg/com/v3/authorise',
  gAdPropertyId: 'AW-782920447',
  gtagPropertyId: 'GTM-5JVF8LT',
  gaPropertyId: 'UA-125256446-3',
  fbPropertyId: '1436376216665984',
  adRollPropertyId: 'IJWYLBK7MZGF7JMIJ2CP3K',
  adRollAdvId: 'J4Q6YE7JGFEZRKPTQGHN6D',
  hideHomepage: true,
  expire2faTime: 298,
  expire2faPollRate: 2,
  expire2faMaxCheck: 5,
  promoCodeJsonUrl: 'https://mo-static-assets.s3-ap-southeast-1.amazonaws.com/promo/prod/promo-details.json'
};
