import { IPaymentRequest } from './payment-request.interface';

export const PaymentRequest: IPaymentRequest = {
    timestampFormat: 'yyyyMMddHHmmss',
    timezone: 'UTC',
    requestId: 'order-',
    merchantAccId: '961c567b-d9da-41f6-9801-ba21cb228a00',
    transactionType: 'purchase',
    currency: 'SGD',
    ipAddress: '127.0.0.1',
    redirectURL: 'https://bfa-dev2.ntucbfa.cloud/payment-redirect',
    secretKey: '03365d5f-1a12-4f16-9351-7ee59ddc9d3f',
    requestURL: 'https://test.wirecard.com.sg/engine/hpp/'
};
