export class InvestmentEngagementJourneyFormErrors {
  formFieldErrors: object = {
    financialValidations: {
      zero: {
        errorTitle: 'Invalid Amount',
        errorMessage: 'One-Time Investment and Monthly Investment cannot be 0'
      },
      more: {
        errorTitle: 'Invalid Amount',
        errorMessage:
          'Either One-Time Investment has to be more than $100 or Monthly Investment has to be more than $50'
      },
      moreasset: {
        errorTitle: 'Oops! Is this correct?',
        errorMessage:
          'We noticed that your One-Time investment amount is more than your total assets. Would you like to review your inputs?',
        isButtons: 'Yes'
      },
      moreinvestment: {
        errorTitle: 'Oops! Is this correct?',
        errorMessage:
          'We noticed that your monthly investment amount is more than your monthly savings. Would you like to review your inputs?',
        isButtons: 'Yes'
      },
      moreassetandinvestment: {
        errorTitle: 'Oops! Is this correct?',
        // tslint:disable-next-line:cognitive-complexity
        errorMessage:
          'We noticed that your One-Time investment amount is more than your total assets and monthly investment amount is more than your monthly savings. Would you like to review your inputs?',
        isButtons: 'Yes'
      },
      one: {
        errorTitle: 'Oops! Review Investment<br>Amount',
        errorMessage:
          'We require a one-time investment of at least $100 or a monthly investment of at least $50.'
      },
      two: {
        errorTitle: 'Oops! Review Investment<br>Amount',
        errorMessage:
          'We require a monthly investment of at least $50.'
      },
      three: {
        errorTitle: 'Oops! Review Investment<br>Amount',
        errorMessage:
          'We require a one-time investment of at least $100.'
      },
      four: {
        errorTitle: 'Invalid Amount',
        errorMessage: ' Must select at least 1 checkbox to continue.'
      }
    }
  };
}
