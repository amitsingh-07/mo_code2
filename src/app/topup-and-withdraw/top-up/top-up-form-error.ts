export class TopUPFormError {
  formFieldErrors: object = {
    topupValidations: {
      // tslint:disable-next-line:no-duplicate-string
      zero: {
        errorTitle: 'Invalid Amount',
        errorMessage: 'One-Time Investment  Minimum value balance $100'
      },
      // tslint:disable-next-line:max-line-length
      more: {
        errorTitle: 'Invalid Amount',
        errorMessage: ' Monthly Investment Minimum value balance $50'
      }
      // tslint:disable-next-line:max-line-length
    }
  };
}
