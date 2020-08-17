export class InvestmentEngagementJourneyFormErrors {
  formFieldErrors: object = {
    financialValidations: {
      zero: {
        errorTitle: 'Invalid Amount',
        errorMessage: 'One-Time amount and Monthly amount cannot be 0'
      },
      more: {
        errorTitle: 'Invalid Amount',
        errorMessage:
          'Either One-Time amount has to be more than $$ONE_TIME_INVESTMENT$ or Monthly amount has to be more than $$MONTHLY_INVESTMENT$'
      },
      moreasset: {
        errorTitle: 'Oops! Is this correct?',
        errorMessage:
          'We noticed that your One-Time amount is more than your total assets. Would you like to review your inputs?',
        isButtons: 'Yes'
      },
      moreinvestment: {
        errorTitle: 'Oops! Is this correct?',
        errorMessage:
          'We noticed that your monthly amount is more than your monthly savings. Would you like to review your inputs?',
        isButtons: 'Yes'
      },
      moreassetandinvestment: {
        errorTitle: 'Oops! Is this correct?',
        // tslint:disable-next-line:cognitive-complexity
        errorMessage:
          'We noticed that your One-Time amount is more than your total assets and monthly amount amount is more than your monthly savings. Would you like to review your inputs?',
        isButtons: 'Yes'
      },
      one: {
        errorTitle: 'Oops! Review Amount',
        errorMessage:
          'We require a one-time amount of at least $$ONE_TIME_AMOUNT$ or a monthly amount of at least $$MONTHLY_AMOUNT$.'
      },
      two: {
        errorTitle: 'Oops! Review Monthly<br>Amount',
        errorMessage:
          'We require a monthly amount of at least $$MONTHLY_AMOUNT$.'
      },
      three: {
        errorTitle: 'Oops! Review One-time<br>Amount',
        errorMessage:
          'We require a one-time amount of at least $$ONE_TIME_AMOUNT$.'
      },
      four: {
        errorTitle: 'Invalid Amount',
        errorMessage: ' Must select at least 1 checkbox to continue.'
      }
    }
  };
}
