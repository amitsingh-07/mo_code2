export interface IPaymentRequest {
    requestId: string;
    merchantAccId: string;
    transactionType: string;
    currency: string;
    ipAddress: string;
    redirectURL: string;
    secretKey: string;
    requestURL: string;
}
