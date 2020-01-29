export const PAYMENT_CONST = {
    SUBTOTAL: 500,
    GST: 7,
    PROMO_CODE: 'MOONLY',
    SOURCE: 'MO'
};

export const PAYMENT_STATUS = {
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCEL: 'cancel',
    PROCESSING: 'processing'
};

export const PAYMENT_REQUEST = {
    merchantAccId: '961c567b-d9da-41f6-9801-ba21cb228a00',
    transactionType: 'purchase',
    currency: 'SGD',
    redirectURL: '/payment/api/redirectPaymentStatus',
    redirectCancelURL: '/payment/api/redirectCancelPayment',
    requestURL: 'https://test.wirecard.com.sg/engine/hpp/'
};
