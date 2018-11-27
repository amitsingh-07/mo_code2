export const SIGN_UP_BASE_ROUTE = '../account/';

export const SIGN_UP_ROUTES = {
  ROOT: '',
  ACCOUNT_CREATED: 'success',
  ACCOUNT_UPDATED: 'account-updated',
  CREATE_ACCOUNT: 'sign-up',
  EMAIL_VERIFIED: 'email-verification',
  PASSWORD: 'password',
  VERIFY_MOBILE: 'verify-mobile',
  LOGIN: 'login',
  FORGOT_PASSWORD: 'forgot-password',
  FORGOT_PASSWORD_RESULT: 'forgotpass-result',
  RESET_PASSWORD: 'reset-password',
  SUCCESS_MESSAGE: 'success-message',
  DASHBOARD: 'dashboard',
  PRELOGIN: 'pre-login',
  EDIT_PROFILE: 'edit-profile',
  EDIT_PASSWORD: 'edit-password',
  EDIT_RESIDENTIAL: 'edit-residential',
  UPDATE_USER_ID: 'update-user-id'
};

export const SIGN_UP_ROUTE_PATHS = {
  ROOT: '',
  PRELOGIN: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.PRELOGIN,
  ACCOUNT_CREATED: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.ACCOUNT_CREATED,
  ACCOUNT_UPDATED: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.ACCOUNT_UPDATED,
  CREATE_ACCOUNT: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.CREATE_ACCOUNT,
  EMAIL_VERIFIED: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EMAIL_VERIFIED,
  PASSWORD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.PASSWORD,
  VERIFY_MOBILE: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.VERIFY_MOBILE,
  LOGIN: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.LOGIN,
  FORGOT_PASSWORD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.FORGOT_PASSWORD,
  FORGOT_PASSWORD_RESULT: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.FORGOT_PASSWORD_RESULT,
  RESET_PASSWORD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.RESET_PASSWORD,
  SUCCESS_MESSAGE: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.SUCCESS_MESSAGE,
  DASHBOARD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.DASHBOARD,
  EDIT_PROFILE: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EDIT_PROFILE,
  EDIT_PASSWORD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EDIT_PASSWORD,
  EDIT_RESIDENTIAL: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EDIT_RESIDENTIAL,
  UPDATE_USER_ID: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.UPDATE_USER_ID
};
