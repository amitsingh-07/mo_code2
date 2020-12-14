export const SIGN_UP_BASE_ROUTE = '../accounts/';
export const DASHBOARD_PATH = '/accounts/dashboard';
export const EDIT_PROFILE_PATH = '/accounts/edit-profile';
export const INVESTMENT_MANAGEMENT_PATH = 'investment/manage/';

export const SIGN_UP_ROUTES = {
  ROOT: '',
  ACCOUNT_CREATED: 'success',
  ACCOUNT_UPDATED: 'account-updated',
  CREATE_ACCOUNT: 'sign-up',
  EMAIL_VERIFIED: 'email-verification',
  VERIFY_MOBILE: 'verify-mobile',
  TWOFA_MOBILE: '2fa-mobile',
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
  UPDATE_USER_ID: 'update-user-id',
  VIEW_ALL_NOTIFICATIONS: 'view-notifications',
  UPDATE_BANK: 'update-bank',
  UPDATE_SRS: 'update-srs',
  TOPUP: 'portfolio/top-up',
  FINLIT_LOGIN: 'finlit/login',
  FINLIT_CREATE_ACCOUNT: 'finlit/sign-up',
};

export const SIGN_UP_ROUTE_PATHS = {
  ROOT: '',
  PRELOGIN: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.PRELOGIN,
  ACCOUNT_CREATED: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.ACCOUNT_CREATED,
  ACCOUNT_UPDATED: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.ACCOUNT_UPDATED,
  CREATE_ACCOUNT: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.CREATE_ACCOUNT,
  FINLIT_CREATE_ACCOUNT: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.FINLIT_CREATE_ACCOUNT,
  EMAIL_VERIFIED: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EMAIL_VERIFIED,
  VERIFY_MOBILE: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.VERIFY_MOBILE,
  VERIFY_2FA: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.TWOFA_MOBILE,
  LOGIN: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.LOGIN,
  FINLIT_LOGIN: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.FINLIT_LOGIN,
  FORGOT_PASSWORD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.FORGOT_PASSWORD,
  FORGOT_PASSWORD_RESULT: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.FORGOT_PASSWORD_RESULT,
  RESET_PASSWORD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.RESET_PASSWORD,
  SUCCESS_MESSAGE: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.SUCCESS_MESSAGE,
  DASHBOARD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.DASHBOARD,
  EDIT_PROFILE: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EDIT_PROFILE,
  EDIT_PASSWORD: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EDIT_PASSWORD,
  EDIT_RESIDENTIAL: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.EDIT_RESIDENTIAL,
  UPDATE_USER_ID: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.UPDATE_USER_ID,
  VIEW_ALL_NOTIFICATIONS: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.VIEW_ALL_NOTIFICATIONS,
  UPDATE_BANK: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.UPDATE_BANK,
  UPDATE_SRS: SIGN_UP_BASE_ROUTE + SIGN_UP_ROUTES.UPDATE_SRS,
  TOPUP: INVESTMENT_MANAGEMENT_PATH + SIGN_UP_ROUTES.TOPUP
};
