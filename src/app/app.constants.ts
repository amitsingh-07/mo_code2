import { GUIDE_ME_ROUTES } from './guide-me/guide-me-routes.constants';

export let appConstants = {
    APP_JWT_TOKEN_KEY: 'app-jwt-token',
    APP_SESSION_ID_KEY: 'app-session-id',
    APP_ENQUIRY_ID: 'app-enquiry-id',
    accessTokenLocalStorage: '',
    defaultContentTypeHeader: '',
    userLocalStorage: '',
    loginPageUrl: GUIDE_ME_ROUTES.ROOT,
    homePageUrl: '',
    accessTokenServer: '',
    MY_INFO_CALLBACK_URL: 'myinfo',
    INVESTMENT_PROMO_CODE_TYPE: 'INVEST',
    JOURNEY_TYPE_INVESTMENT: 'investment',
    JOURNEY_TYPE_DIRECT: 'DIRECT',
    JOURNEY_TYPE_GUIDED: 'GUIDED',
    JOURNEY_TYPE_WILL_WRITING: 'WILL_WRITING',
    JOURNEY_TYPE_COMPREHENSIVE: 'COMPREHENSIVE',
    SESSION_KEY: {
        COMPREHENSIVE: 'app-comprehensive-session'
    }
};
