export class InvestmentAccountFormError {
  formFieldErrors: object = {
    errorTitle: 'Oops! Please check the following details:',
    salutation: {
      required: {
        errorTitle: 'Invalid Salutation',
        errorMessage: 'Select Salutation'
      }
    },
    birthCountry: {
      required: {
        errorTitle: 'Invalid Birth Country',
        errorMessage: 'Select Country of Birth'
      }
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

    country: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Country',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Select Country'
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

    mailCountry: {
      required: {
        errorTitle: 'Invalid Country in mailing address',
        errorMessage: 'Select Country in mailing address'
      }
    },
    postalCode: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Postal Code',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Enter Postal Code'
      },
      pattern: {
        errorTitle: 'Invalid Postal Code',
        errorMessage: 'The postal code you entered is invalid.'
      }
    },
    mailPostalCode: {
      required: {
        errorTitle: 'Invalid Postal Code in mailing address',
        errorMessage: 'Enter Postal Code in mailing address'
      },
      pattern: {
        errorTitle: 'Invalid Postal Code',
        errorMessage: 'The postal code you entered is invalid in mailing address.'
      }
    },
    address1: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Address Line 1',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Enter Address Line 1'
      },
      pattern: {
        errorTitle: 'Invalid Address Line 1',
        errorMessage:
          'Address Line 1 should contain  alphanumeric and  Special characters.'
      }
    },
    address2: {
      pattern: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Address Line 2',
        errorMessage:
          'Address Line 2 should contain  alphanumeric and  Special characters.'
      }
    },
    floor: {
      pattern: {
        errorTitle: 'Invalid  Floor',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Floor should contain Symbol and Number.'
      }
    },
    unitNo: {
      pattern: {
        errorTitle: 'Invalid  unitNo',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Unit No. should contain Symbol and Number.'
      }
    },
    mailAddress1: {
      required: {
        errorTitle: 'Invalid Address Line 1 in mailing address',
        errorMessage: 'Enter Address Line 1 in mailing address'
      },
      pattern: {
        errorTitle: 'Invalid mail Address Line 1',
        errorMessage:
          'Address Line 1 should contain  alphanumeric and  Special characters in mailing address.'
      }
    },
    mailAddress2: {
      pattern: {
        errorTitle: 'Invalid mail Address Line 2',
        errorMessage:
          'Address Line 2 should contain  alphanumeric and  Special characters in mailing address.'
      }
    },
    mailFloor: {
      pattern: {
        errorTitle: 'Invalid mailFloor',
        errorMessage: 'Floor should contain Symbol and Number.'
      }
    },

    mailUnitNo: {
      pattern: {
        errorTitle: 'Invalid  mailUnitNo',
        errorMessage: 'Unit No. should contain Symbol and Number.'
      }
    },
    city: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid City',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Enter City'
      },
      pattern: {
        errorTitle: 'Invalid City',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'City should not contain numbers and special characters.'
      }
    },
    mailCity: {
      required: {
        errorTitle: 'Invalid City in mailing address',
        errorMessage: 'Enter City in mailing address'
      },
      pattern: {
        errorTitle: 'Invalid City in mailing address',
        errorMessage:
          'City should not contain numbers and special characters in mailing address.'
      }
    },
    state: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid State',
        errorMessage: 'Enter State'
      },
      pattern: {
        errorTitle: 'Invalid State',
        errorMessage: 'State should not contain numbers and special characters.'
      }
    },
    mailState: {
      required: {
        errorTitle: 'Invalid State in mailing address',
        errorMessage: 'Enter State in mailing address'
      },
      pattern: {
        errorTitle: 'Invalid State in mailing address',
        errorMessage:
          'State should not contain numbers and special characters in mailing address.'
      }
    },
    zipCode: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Zip Code',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Enter Zip Code'
      },
      pattern: {
        errorTitle: 'Invalid Zip Code',
        errorMessage: 'Zip Code you entered is invalid.'
      }
    },
    mailZipCode: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Zip Code in mailing address',
        errorMessage: 'Enter Zip Code in mailing address'
      },
      pattern: {
        errorTitle: 'Invalid Zip Code in mailing address',
        errorMessage: 'Zip Code you entered is invalid in mailing address.'
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
        errorTitle: 'Invalid Answer',
        errorMessage: 'Select answer'
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
        errorMessage: 'Full Name should not contain numbers and special characters.'
      }
    },
    firstName: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid First Name',
        errorMessage: 'Enter First Name'
      },
      pattern: {
        errorTitle: 'Invalid First Name',
        errorMessage: 'First Name should not contain numbers and special characters.'
      },
      nameMatch: {
        errorTitle: 'Invalid Name',
        errorMessage: 'First Name and Last Name are not matched with Full Name.'
      }
    },

    lastName: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Last Name',
        errorMessage: 'Enter Last Name'
      },
      pattern: {
        errorTitle: 'Invalid Last Name',
        errorMessage: 'Last Name should not contain numbers and special characters.'
      },
      nameMatch: {
        errorTitle: 'Invalid Name',
        errorMessage: 'Full Name not matched with [First Name and Last Name] or [Last Name].'
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
    passportExpiry: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Passport Expiry',
        errorMessage: 'Enter Passport Expiry'
      },
      isMinExpiry: {
        errorTitle: 'Invalid Passport Expiry',
        errorMessage: 'Your passport must have at least 6 months validity to proceed.'
      }
    },
    dob: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Date of Birth',
        errorMessage: 'Select Date of Birth'
      },
      isMinAge: {
        errorTitle: 'Invalid Date of Birth',
        errorMessage:
          'You must be at least 18 years old to proceed.'
      }
    },
    gender: {
      required: {
        errorTitle: 'Invalid Gender',
        errorMessage: 'Select Gender'
      }
    },
    sourceOfIncome: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Source of investment funds',
        errorMessage: 'Select your Source of investment funds'
      }
    },
    employmentStatus: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Source of Employment Status ',
        errorMessage: 'Select Employment Status'
      }
    },
    companyName: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Company Name',
        errorMessage: 'Enter Company Name'
      },
      pattern: {
        errorTitle: 'Invalid Company Name',
        errorMessage: 'Company Name should not contain special characters.'
      }
    },
    occupation: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Occupation',
        errorMessage: 'Select Occupation'
      }
    },
    otherOccupation: {
      required: {
        errorTitle: 'Invalid Occupation',
        errorMessage: 'Enter occupation'
      }
    },
    industry: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Industry',
        errorMessage: 'Select Industry'
      }
    },
    otherIndustry: {
      required: {
        errorTitle: 'Invalid Industry',
        errorMessage: 'Enter Industry'
      }
    },
    contactNumber: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Contact Number',
        errorMessage: 'Enter Contact Number'
      },
      pattern: {
        errorTitle: 'Invalid  Contact Number',
        errorMessage: 'Contact Number you entered is invalid.'
      }
    },
    empPostalCode: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Postal Code',
        errorMessage: 'Enter Postal Code'
      },
      pattern: {
        errorTitle: 'Invalid Postal Code',
        errorMessage: 'The postal code you entered is invalid.'
      }
    },
    empAddress1: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Address Line 1',
        errorMessage: 'Enter Address Line 1'
      },
      pattern: {
        errorTitle: 'Invalid Address Line 1',
        errorMessage:
          'Address Line 1  should contain  alphanumeric and  Special characters.'
      }
    },
    empAddress2: {
      pattern: {
        errorTitle: 'Invalid Address Line 2',
        errorMessage:
          'Address Line 2  should contain  alphanumeric and  Special characters.'
      }
    },
    empFloor: {
      pattern: {
        errorTitle: 'Invalid  Floor',
        // tslint:disable-next-line:no-duplicate-string
        errorMessage: 'Floor should contain Symbol and Number.'
      }
    },
    empUnitNo: {
      pattern: {
        errorTitle: 'Invalid  unitNo',
        errorMessage: 'Unit No. should contain Symbol and Number.'
      }
    },

    empCity: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid City',
        errorMessage: 'Enter City'
      },
      pattern: {
        errorTitle: 'Invalid City',
        errorMessage: 'City should not contain numbers and special characters.'
      }
    },

    empState: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid State/Province/Region',
        errorMessage: 'Enter State/Province/Region'
      },
      pattern: {
        errorTitle: 'Invalid state',
        errorMessage:
          'State/Province/Region should not contain numbers and special characters.'
      }
    },

    empZipCode: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Zip Code',
        errorMessage: 'Enter Zip Code'
      },
      pattern: {
        errorTitle: 'Invalid Zip Code',
        errorMessage: 'Zip Code should not contain special characters.'
      }
    },
    annualHouseHoldIncomeRange: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Monthly Household Income',
        errorMessage: 'Select Monthly Household Income'
      }
    },
    numberOfHouseHoldMembers: {
      required: {
        // tslint:disable-next-line:no-duplicate-string

        errorTitle: 'Invalid No. Of Household Members',
        errorMessage: 'Select No. Of Household Members'
      }
    },
    financialMonthlyIncome: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Monthly Income',
        errorMessage: 'Enter Monthly Income'
      }
    },
    expectedNumberOfTransation: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Expected Number Of Transactions',
        errorMessage: 'Enter Expected Number Of Transactions'
      },
      minValueCheck: {
        errorTitle: 'Invalid Expected Number Of Transactions',
        errorMessage: 'Enter Expected Number Of Transactions more than 0.'
      }
    },
    expectedAmountPerTranction: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Expected Amount Per Transaction.',
        errorMessage: 'Enter Expected Amount Per Transaction'
      },
      minValueCheck: {
        errorTitle: 'Invalid Expected Amount Per Transaction',
        errorMessage: 'Enter Expected Amount Per Transaction more than 0.'
      }
    },
    source: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Source Of Investment Funds',
        errorMessage: 'Select Source Of Investment Funds'
      }
    },
    personalSavings: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Personal Savings',
        errorMessage: 'Enter Personal Savings'
      }
    },
    inheritanceGift: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid enter Gift Inheritance',
        errorMessage: 'Enter Gift Inheritance'
      }
    },
    durationInvestment: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Investment Period.',
        errorMessage: 'Enter Duration investment held for'
      },
      minValueCheck: {
        errorTitle: 'Invalid Expected Amount Per Transaction',
        errorMessage: 'Enter Duration of investment held for more than 0.'
      }
    },
    otherSources: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid others.',
        errorMessage: 'Enter Others'
      }
    },
    earningsGenerated: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Earnings Generated From',
        errorMessage: 'Select Earnings Generated From'
      }
    },
    pepoccupation: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Occupation',
        errorMessage: 'Select Occupation'
      }
    },
    pepFullName: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid First Name',
        errorMessage: 'Enter Full Name'
      },
      pattern: {
        errorTitle: 'Invalid First Name',
        errorMessage: 'Full Name should not contain numbers and special characters.'
      }
    },
    cName: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Company Name',
        errorMessage: 'Enter Company name'
      }
    },
    pepCountry: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Country',
        errorMessage: 'Select Country'
      }
    },
    pepPostalCode: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Postal Code',
        errorMessage: 'Enter Postal Code'
      },
      pattern: {
        errorTitle: 'Invalid Postal Code',
        errorMessage: 'Postal code should be numeric'
      }
    },
    pepAddress1: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Address Line 1',
        errorMessage: 'Enter Address Line 1'
      },
      pattern: {
        errorTitle: 'Invalid Address1',
        errorMessage: 'Address1 should contain alphanumeric and Special characters.'
      }
    },
    pepAddress2: {
      pattern: {
        errorTitle: 'Invalid Address2',
        errorMessage: 'Address2 should contain alphanumeric and Special characters.'
      }
    },
    pepFloor: {
      pattern: {
        errorTitle: 'Invalid Unit No',
        errorMessage: 'Floor should contain Symbol and Number.'
      }
    },
    pepUnitNo: {
      pattern: {
        errorTitle: 'Invalid Unit No',
        errorMessage: 'Unit No. should contain Symbol and Number.'
      }
    },
    pepCity: {
      required: {
        errorTitle: 'Invalid City',
        errorMessage: 'Enter City'
      },
      pattern: {
        errorTitle: 'Invalid City',
        errorMessage: 'City should not contain numbers and special characters.'
      }
    },
    pepState: {
      required: {
        errorTitle: 'Invalid State',
        errorMessage: 'Enter State'
      },
      pattern: {
        errorTitle: 'Invalid State',
        errorMessage: 'State should not contain numbers and special characters.'
      }
    },
    pepZipCode: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid Zip Code',
        errorMessage: 'Enter Zip Code'
      },
      pattern: {
        errorTitle: 'Invalid Zip Code',
        errorMessage: 'Zip Code you entered is invalid.'
      }
    },
    salaryRange: {
      required: {
        // tslint:disable-next-line:no-duplicate-string
        errorTitle: 'Invalid salary range',
        errorMessage: 'Select Salary Range'
      }
    },
  };
}
