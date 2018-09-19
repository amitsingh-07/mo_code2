import { apiConstants } from './shared/http/api.constants';
import { GUIDE_ME_ROUTES } from './guide-me/guide-me-routes.constants';

export let appConstants = {
    APP_JWT_TOKEN_KEY: 'app-jwt-token',
    APP_SESSION_ID_KEY: 'app-session-id',
    APP_ENQUIRY_ID: 'app-enquiry-id',
    accessTokenLocalStorage: '',
    defaultContentTypeHeader: '',
    userLocalStorage: '',
    loginPageUrl: GUIDE_ME_ROUTES.ROOT,
    accessTokenServer: ''
};
