export class TopUPFormError {
    formFieldErrors: object = {
        topupValidations: {
            // tslint:disable-next-line:no-duplicate-string
            zero: { errorTitle: 'Invalid Amount', errorMessage: 'One-Time Investment  Minimum value balance $100' },
            // tslint:disable-next-line:max-line-length
            more: { errorTitle: 'Invalid Amount', errorMessage: ' Monthly Investment Minimum value balance $50' },
            // tslint:disable-next-line:max-line-length
            moreasset: { errorTitle: 'Information', errorMessage: 'Your investment amount is more than your total assets. Would you like to continue?' },
            // tslint:disable-next-line:max-line-length
            moreinvestment: { errorTitle: 'Information', errorMessage: 'Your monthly investment amount is more than your monthly income saved. Would you like to continue?' },
            // tslint:disable-next-line:max-line-length
            moreassetandinvestment: { errorTitle: 'Information', errorMessage: 'Your investment amount is more than your total assets and your monthly investment amount is more than your monthly income saved. Would you like to continue?' }
        }
    };
}