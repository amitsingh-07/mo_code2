import { GUIDE_ME_ROUTES } from './guide-me/guide-me-routes.constants';

export let appConstants = {
    APP_JWT_TOKEN_KEY: 'app-jwt-token',
    APP_SESSION_ID_KEY: 'app-session-id',
    APP_2FA_KEY: 'app-2fa',
    APP_ENQUIRY_ID: 'app-enquiry-id',
    APP_CUSTOMER_ID: 'app_customer_id',
    accessTokenLocalStorage: '',
    defaultContentTypeHeader: '',
    userLocalStorage: '',
    loginPageUrl: GUIDE_ME_ROUTES.ROOT,
    homePageUrl: '',
    accessTokenServer: '',
    MY_INFO_CALLBACK_URL: 'myinfo',
    INVESTMENT_PROMO_CODE_TYPE: 'INVEST',
    COMPREHENSIVE_PROMO_CODE_TYPE: 'COMPRE',
    JOURNEY_TYPE_SIGNUP: 'SignUp',
    JOURNEY_TYPE_INVESTMENT: 'investment',
    JOURNEY_TYPE_DIRECT: 'DIRECT',
    JOURNEY_TYPE_GUIDED: 'GUIDED',
    JOURNEY_TYPE_WILL_WRITING: 'WILL_WRITING',
    HOME_ROUTE: '/home#',
    JOURNEY_TYPE_COMPREHENSIVE: 'comprehensive-plus',
    SESSION_KEY: {
        COMPREHENSIVE: 'app-comprehensive-session',
        CFP_USER_ROLE: 'app-comprehensive-user'
    },
    USERTYPE: {
        NORMAL: "normal",
        FINLIT: "finlit",
        MANUAL: "MANUAL",
        SINGPASS: "SINGPASS"
    },
    INSURANCE_JOURNEY_TYPE: {
        DIRECT: 'insurance-direct',
        GUIDED: 'insurance-guided'
    },
   BROWSER_CLOSE :'BROWSER_CLOSE' ,
   LOGOUT_BUTTON :'LOGOUT_BUTTON',
   FINLIT_ACCESS_CODE: 'finlit-access-code',
   SINGAPORE_COUNTRY_CODE: '+65',
   OTP_WAITING_SECONDS: 30,
   SHOW_NEWUPDATES_MODAL_START_DATE : '2022-04-12T00:00:00.000+08:00',
   SHOW_NEWUPDATES_MODAL_END_DATE : '2022-04-19T11:59:59.000+08:00'
};
