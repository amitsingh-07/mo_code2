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

export const PROMO_CODE_PAYMENT_BYPASS = [
    {
        CODE: 'MOCFP1',
        PAYMENT_BYPASS: 'false'
    },
    {
        CODE: 'MOCFP',
        PAYMENT_BYPASS: 'false'
    }
];

export const PAYMENT_REQUEST = {
    merchantAccId: '961c567b-d9da-41f6-9801-ba21cb228a00',
    transactionType: 'purchase',
    currency: 'SGD',
    redirectURL: '/pymtgw/redirectPaymentStatus',
    redirectCancelURL: '/pymtgw/redirectCancelPayment',
    requestURL: 'https://test.wirecard.com.sg/engine/hpp/',
    attempt3D: 'false'
};
