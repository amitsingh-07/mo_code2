export interface IPaymentRequest {
    requestId: string;
    timeStamp: string;
    reqSignature: string;
    merchantAccId: string;
    transactionType: string;
    currency: string;
    ipAddress: string;
    redirectURL: string;
    requestURL: string;
}
