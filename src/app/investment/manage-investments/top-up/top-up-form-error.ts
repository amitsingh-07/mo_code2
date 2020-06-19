import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../../investment-engagement-journey/investment-engagement-journey.constants';

export class TopUPFormError {

  formFieldErrors: object = {
    topupValidations: {
      // tslint:disable-next-line:no-duplicate-string
      zero: {
        errorTitle: 'Oops! Review Investment Amount',
        errorMessage: 'We require a one-time amount of at least $$ONE_TIME_AMOUNT$.'
      },
      // tslint:disable-next-line:max-line-length
      more: {
        errorTitle: 'Oops! Review Investment Amount',
        errorMessage: 'We require a monthly amount of at least $$MONTHLY_AMOUNT$.'
      }
      // tslint:disable-next-line:max-line-length
    }
  };
}
