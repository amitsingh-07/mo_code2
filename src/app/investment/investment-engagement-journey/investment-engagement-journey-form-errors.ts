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
          'Either One-Time amount has to be more than $$ONE_TIME_AMOUNT$ or Monthly amount has to be more than $$MONTHLY_AMOUNT$'
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
          'We require a one-time amount of at least $ONE_TIME_AMOUNT$ or a monthly amount of at least $MONTHLY_AMOUNT$.'
      },
      two: {
        errorTitle: 'Oops! Review Monthly<br>Amount',
        errorMessage:
          'We require a monthly amount of at least $MONTHLY_AMOUNT$.'
      },
      three: {
        errorTitle: 'Oops! Review One-time<br>Amount',
        errorMessage:
          'We require a one-time amount of at least $ONE_TIME_AMOUNT$.'
      },
      four: {
        errorTitle: 'Invalid Amount',
        errorMessage: ' Must select at least 1 checkbox to continue.'
      }
    },
    secondaryHolderValidations: {
      errorTitle: 'Oops! Please check the following details:',
      birthCountry: {
        required: {
          errorTitle: 'Invalid Birth Country',
          errorMessage: 'Select Country of Birth'
        }
      },
      passportExpiry: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid Passport Expiry',
          errorMessage: 'Enter Passport Expiry'
        },
        ngbDate: {
          errorTitle: 'Invalid Passport Expiry',
          errorMessage: 'Enter valid Passport Expiry date.'
        },
      },
      passportIssuedCountry: {
        required: {
          errorTitle: 'Invalid Passport issued Country',
          errorMessage: 'Select Passport Issued Country'
        }
      },
      race: {
        required: {
          errorTitle: 'Invalid Race',
          errorMessage: 'Select Race'
        }
      },
      relationship: {
        required: {
          errorTitle: 'Invalid Relationship',
          errorMessage: 'Select Relationship'
        }
      },
      issuedCountry: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid Country Of Issued',
          // tslint:disable-next-line:no-duplicate-string
          errorMessage: 'Select Country Of Issued'
        }
      },
      reason: {
        required: {
          errorTitle: 'Invalid Reason',
          errorMessage: 'Select Reason'
        }
      },
      reasonForOthers: {
        required: {
          errorTitle: 'Invalid reason For Others',
          errorMessage: 'Enter Reason'
        }
      },
      tinNumber: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid TIN Number',
          errorMessage: 'Enter TIN Number'
        },
        pattern: {
          errorTitle: 'Invalid TIN Number',
          errorMessage: 'TIN Number you entered is invalid.'
        },
        tinFormat: {
          errorTitle: 'Invalid TIN Number',
          errorMessage: 'TIN Number you entered is invalid.'
        }
      },
      taxCountry: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid Country',
          errorMessage: 'Select Country of Tax Residence'
        }
      },
      radioTin: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Select an option',
          errorMessage: 'Select Yes / No option for Taxpayer Identification Number question.'
        }
      },
      noTinReason: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid Reason',
          errorMessage: 'Select Reason'
        }
      },
      fullName: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid Full Name',
          errorMessage: 'Enter Full Name'
        },
        pattern: {
          errorTitle: 'Invalid Full Name',
          errorMessage: 'Enter valid Full Name'
        }
      },
      nricNumber: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid NRIC Number',
          errorMessage: 'Enter NRIC Number'
        },
        nric: {
          errorTitle: 'Invalid NRIC Number',
          errorMessage: 'The NRIC you have keyed in is invalid.'
        }
      },
      passportNumber: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid Passport Number',
          errorMessage: 'Enter Passport Number'
        },
        pattern: {
          errorTitle: 'Invalid Passport Number',
          errorMessage: 'Enter valid Passport Number'
        }
      },
      dob: {
        required: {
          // tslint:disable-next-line:no-duplicate-string
          errorTitle: 'Invalid Date of Birth',
          errorMessage: 'Select Date of Birth'
        },
        ngbDate: {
          errorTitle: 'Invalid Date of Birth',
          errorMessage: 'Enter valid Date of Birth'
        },
        isMaxAge: {
          errorTitle: 'Invalid Date of Birth',
          errorMessage:
            'Date of Birth provided is not below 18 years old'
        }
      },
      gender: {
        required: {
          errorTitle: 'Invalid Gender',
          errorMessage: 'Select Gender'
        }
      },
    }
  };
}
