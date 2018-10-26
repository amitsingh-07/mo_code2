export class InvestmentAccountFormError {
    formFieldErrors: object = {
        errorTitle: 'Error !',
        country: {
            required: {
                errorTitle: 'Invalid Country',
                errorMessage: 'Please select your country.'
            },
        },
        mailCountry: {
            required: {
                errorTitle: 'Invalid Country in mailing address',
                errorMessage: 'Please select country in mailing address.'
            },
        },
        postalCode: {
            required: {
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Please enter your postal code.'
            },
            pattern: {
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Postal Code should contain only 6 digit number.'
            }
        },
        mailPostalCode: {
            required: {
                errorTitle: 'Invalid Postal Code in mailing address',
                errorMessage: 'Please enter your Postal Code in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Postal Code should contain only 6 digit number.'
            }
        },
        address1: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address Line 1',
                errorMessage: 'Please enter Address Line 1.'
            },
            pattern: {
                errorTitle: 'Invalid Address Line 1',
                errorMessage: 'Address Line 1 should not contain special characters.'
            }
        },
        address2: {
            pattern: {
                errorTitle: 'Invalid Address Line 2',
                errorMessage: 'Address Line 2 should not contain special characters.'
            }
        },
        mailAddress1: {
            required: {
                errorTitle: 'Invalid Address Line 1 in mailing address.',
                errorMessage: 'Please enter Address Line 1 in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid mail Address Line 1',
                errorMessage: 'Address Line 1 should not contain special characters in mailing address.'
            }
        },
        mailAddress2: {
            pattern: {
                errorTitle: 'Invalid mail Address Line 2',
                errorMessage: 'Address Line 2 should not contain special characters in mailing address.'
            }
        },
        floor: {
            required: {
                errorTitle: 'Invalid Floor',
                errorMessage: 'Please enter your floor.'
            }
        },
        mailFloor: {
            required: {
                errorTitle: 'Invalid Floor',
                errorMessage: 'Please enter your floor in mailing address.'
            }
        },
        unitNo: {
            required: {
                errorTitle: 'Invalid Unit No.',
                errorMessage: 'Please enter your unit no.'
            }
        },
        mailUnitNo: {
            required: {
                errorTitle: 'Invalid unit no. in mailing address.',
                errorMessage: 'Please enter your unit no. in mailing address.'
            }
        },
        city: {
            required: {
                errorTitle: 'Invalid city',
                errorMessage: 'Please enter your city.'
            },
            pattern: {
                errorTitle: 'Invalid city',
                errorMessage: 'City should not contain numbers and special characters.'
            }
        },
        mailCity: {
            required: {
                errorTitle: 'Invalid mail city in mailing address',
                errorMessage: 'Please enter your city in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid city in mailing address',
                errorMessage: 'City should not contain numbers and special characters in mailing address.'
            }
        },
        state: {
            required: {
                errorTitle: 'Invalid state',
                errorMessage: 'Please enter your state.'
            },
            pattern: {
                errorTitle: 'Invalid state',
                errorMessage: 'State should not contain numbers and special characters.'
            }
        },
        mailState: {
            required: {
                errorTitle: 'Invalid state in mailing address',
                errorMessage: 'Please enter your state in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid state in mailing address',
                errorMessage: 'State should not contain numbers and special characters in mailing address.'
            }
        },
        zipCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid zipcode',
                errorMessage: 'Please enter zipcode.'
            },
            pattern: {
                errorTitle: 'Invalid zipcode',
                errorMessage: 'Zipcode should not contain special characters.'
            }
        },
        mailZipCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid zipcode in mailing address',
                errorMessage: 'Please enter zipcode in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid zipcode in mailing address',
                errorMessage: 'Zipcode should not contain special characters in mailing address.'
            }
        },
        tinNumber: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid TIN',
                errorMessage: 'Please enter your TIN number.'
            },
            pattern: {
                errorTitle: 'Invalid TIN',
                errorMessage: 'TIN Number should not contain special characters.'
            }
        },
        taxCountry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid country',
                errorMessage: 'Please select your country.'
            }
        },
        noTinReason: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid reason',
                errorMessage: 'Please select a reason.'
            }
        },
        fullName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Full Name',
                errorMessage: 'Please enter full name.'
            },
            pattern: {
                errorTitle: 'Invalid Full Name',
                errorMessage: 'Full Name should not contain alphabet.'
            }
        },
        firstName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid First Name',
                errorMessage: 'Please enter  First Name.'
            },
            pattern: {
                errorTitle: 'Invalid First Name',
                errorMessage: 'First Name should not contain alphabet.'
            },
            nameMatch: {
                errorTitle: 'Invalid name',
                errorMessage: 'First Name and Last Name are not matched with First Name.'
            }
        },

        lastName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Last Name',
                errorMessage: 'Please enter Last Name.'
            },
            pattern: {
                errorTitle: 'Invalid Last Name',
                errorMessage: 'Last Name should not contain alphabet.'
            }
        },
        nricNumber: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid NRIC Number',
                errorMessage: 'Please enter NRIC Number.'
            },
            pattern: {
                errorTitle: 'Invalid NRIC Number',
                errorMessage: 'NRIC Number should not contain special characters.'
            }
        },
        passportNumber: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Passport Number',
                errorMessage: 'Please enter Passport Number.'
            },
            pattern: {
                errorTitle: 'Invalid Passport Number',
                errorMessage: 'Passport Number should not contain special characters.'
            }
        },
        passportExpiry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Passport Expiry',
                errorMessage: 'Please enter Passport Expiry.'
            }
        },
        dob: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Date Of Birth',
                errorMessage: 'Please enter Date Of Birth.'
            }
        },
        sourceOfIncome: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid sourcwe',
                errorMessage: 'Please select your source of investment funds.'
            }
        },
        companyName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Company Name',
                errorMessage: 'Please enter Company Name.'
            },
            pattern: {
                errorTitle: 'Invalid Company Name',
                errorMessage: 'Company Name should contain only alphabets.'
            }
        },
        occupation: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Occupation',
                errorMessage: 'Please select your Occupation.'
            }
        },
        industry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Industry',
                errorMessage: 'Please select your Industry'
            }
        },
        contactNumber: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Contact Number',
                errorMessage: 'Please enter Contact Number.'
            },
            pattern: {
                errorTitle: 'Invalid  Contact Number',
                errorMessage: ' Please enter valid Contact Number.'
            }
        },
        empPostalCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Please enter Postal Code.'
            },
            pattern: {
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Postal Code should contain only 6 digit number.'
            }
        },
        empAddress1: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address Line 1',
                errorMessage: 'Please enter Address Line 1.'
            }
        },
        empAddress2: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address Line 2',
                errorMessage: 'Please enter Address Line 2.'
            }
        },

        empUnitNo: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Unit No.',
                errorMessage: 'Please enter Unit No.'
            }
        },

        empCity: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid City',
                errorMessage: 'Please enter City.'
            }
        },

        empState: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid State/Province/Region',
                errorMessage: 'Please enter State/Province/Region.'
            }
        },

        empZipCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Zip Code',
                errorMessage: 'Please enter Zip Code.'
            }
        },
        annualHouseHoldIncomeRange: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Annual Household Income',
                errorMessage: 'Please select Annual Household Income.'
            }
        },
        numberOfHouseHoldMembers: {
            required: {
                // tslint:disable-next-line:no-duplicate-string

                errorTitle: 'Invalid No. Of Household Members',
                errorMessage: 'Please select No. Of Household Members.'
            }
        },
        financialMonthlyIncome: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Monthly Income',
                errorMessage: 'Please enter Monthly Income.'
            }
        },
        financialPercentageOfSaving: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid % Of Income Saved',
                errorMessage: 'Please enter % Of Income Saved.'
            }
        },
        financialTotalAssets: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Total Assets',
                errorMessage: 'Please enter  Total Assets.'
            }
        },
        financialTotalLiabilities: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid  Total Loans',
                errorMessage: 'Please enter Total Loans.'
            }
        },
        expectedNumberOfTransation: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid  expected Number Of Transation',
                errorMessage: 'Please enter expected Number Of Transation.'
            }
        },
        expectedAmountPerTranction: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid  expected Amount Per Tranction',
                errorMessage: 'Please enter expected Amount Per Tranction.'
            }
        },
        sources: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid  sources',
                errorMessage: 'Please sources.'
            }
        },
        personalSavings: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid personal Savings',
                errorMessage: 'Please personal Savings.'
            }
        },
        inheritanceGift: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid  inheritance Gift',
                errorMessage: 'Please inheritance Gift.'
            }
        },
        investmentPeriod: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid  investment Period',
                errorMessage: 'Please investment Period.'
            }
        },
        earningsGenerated: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid  earnings Generated',
                errorMessage: 'Please earnings Generated.'
            }
        },
        pepoccupation: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid occupation',
                errorMessage: 'Please select your occupation.'
            }
        },
        fName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid First Name',
                errorMessage: 'Please enter your first name.'
            }
        },
        lName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Last Name',
                errorMessage: 'Please enter your last name.'
            }
        },
        cName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Company Name',
                errorMessage: 'Please enter your Company name.'
            }
        },
        pepCountry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Country',
                errorMessage: 'Please select your Country.'
            }
        },
        pepPostalCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Postal code',
                errorMessage: 'Please enter your postal code.'
            }
        },
        pepAddress1: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address',
                errorMessage: 'Please enter your Address1.'
            }
        },
        pepAddress2: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address',
                errorMessage: 'Please enter your Address2.'
            }
        },

        pepUnitNo: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Unit No',
                errorMessage: 'Please enter your Unit no.'
            }
        },
    };

}
