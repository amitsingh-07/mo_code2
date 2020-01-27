import { APP_ROUTES } from '../app-routes.constants';

export const PAYMENT_BASE_ROUTE = '../' + APP_ROUTES.PAYMENT + '/';

export const PAYMENT_ROUTES = {
    ROOT: '',
    CHECKOUT: 'checkout',
    PAYMENT_STATUS: 'payment-status'
};

export const PAYMENT_ROUTE_PATHS = {
    ROOT: PAYMENT_BASE_ROUTE + '',
    CHECKOUT: PAYMENT_BASE_ROUTE + PAYMENT_ROUTES.CHECKOUT,
    PAYMENT_STATUS: PAYMENT_BASE_ROUTE + PAYMENT_ROUTES.PAYMENT_STATUS
};
