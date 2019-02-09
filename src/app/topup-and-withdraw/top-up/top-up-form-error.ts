export class TopUPFormError {
  formFieldErrors: object = {
    topupValidations: {
      // tslint:disable-next-line:no-duplicate-string
      zero: {
        errorTitle: 'Oops! Review Investment Amount',
        errorMessage: 'We require a one-time investment of at least $100.'
      },
      // tslint:disable-next-line:max-line-length
      more: {
        errorTitle: 'Oops! Review Investment Amount',
        errorMessage: 'We require a monthly investment of at least $50.'
      }
      // tslint:disable-next-line:max-line-length
    }
  };
}
