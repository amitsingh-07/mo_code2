export class InvestmentAccountFormError {
    formFieldErrors: object = {
        errorTitle: 'Error !',
        salutation: {
            required: {
                errorTitle: 'Invalid Salutation',
                errorMessage: 'Please select Salutation.'
            },
        },
        birthCountry: {
            required: {
                errorTitle: 'Invalid Birth Country',
                errorMessage: 'Please select your Country of Birth.'
            },
        },
        passportIssuedCountry: {
            required: {
                errorTitle: 'Invalid Passport issued Country',
                errorMessage: 'Please select your Passport issued Country.'
            },
        },
        race: {
            required: {
                errorTitle: 'Invalid Race',
                errorMessage: 'Please select your Race.'
            },
        },

        country: {
            required: {
                errorTitle: 'Invalid Country',
                errorMessage: 'Please select your Country.'
            },
        },
        reason: {
            required: {
                errorTitle: 'Invalid Reason',
                errorMessage: 'Please select Reason.'
            },
        },
        reasonForOthers: {
            required: {
                errorTitle: 'Invalid reason For Others',
                errorMessage: 'Please enter Please indicate the reason.'
            },
        },

        mailCountry: {
            required: {
                errorTitle: 'Invalid Country in mailing address',
                errorMessage: 'Please select Country in mailing address.'
            },
        },
        postalCode: {
            required: {
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Please enter your Postal Code.'
            },
            pattern: {
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Please enter valid Postal Code.'
            }
        },
        mailPostalCode: {
            required: {
                errorTitle: 'Invalid Postal Code in mailing address',
                errorMessage: 'Please enter your Postal Code in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Please enter valid Postal Code.'
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
                errorMessage: 'Please enter your Floor.'
            }
        },
        mailFloor: {
            required: {
                errorTitle: 'Invalid Floor',
                errorMessage: 'Please enter your Floor in mailing address.'
            }
        },
        unitNo: {
            required: {
                errorTitle: 'Invalid Unit No.',
                errorMessage: 'Please enter your Unit No.'
            }
        },
        mailUnitNo: {
            required: {
                errorTitle: 'Invalid Unit No. in mailing address.',
                errorMessage: 'Please enter your Unit No. in mailing address.'
            }
        },
        city: {
            required: {
                errorTitle: 'Invalid City',
                errorMessage: 'Please enter your City.'
            },
            pattern: {
                errorTitle: 'Invalid City',
                errorMessage: 'City should not contain numbers and special characters.'
            }
        },
        mailCity: {
            required: {
                errorTitle: 'Invalid City in mailing address',
                errorMessage: 'Please enter City in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid City in mailing address',
                errorMessage: 'City should not contain numbers and special characters in mailing address.'
            }
        },
        state: {
            required: {
                errorTitle: 'Invalid State',
                errorMessage: 'Please enter your State.'
            },
            pattern: {
                errorTitle: 'Invalid State',
                errorMessage: 'State should not contain numbers and special characters.'
            }
        },
        mailState: {
            required: {
                errorTitle: 'Invalid State in mailing address',
                errorMessage: 'Please enter your State in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid State in mailing address',
                errorMessage: 'State should not contain numbers and special characters in mailing address.'
            }
        },
        zipCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Zip Code',
                errorMessage: 'Please enter Zip Code.'
            },
            pattern: {
                errorTitle: 'Invalid Zip Code',
                errorMessage: 'Zip Code should not contain special characters.'
            }
        },
        mailZipCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Zip Code in mailing address',
                errorMessage: 'Please enter Zip Code in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid Zip Code in mailing address',
                errorMessage: 'Zip Code should not contain special characters in mailing address.'
            }
        },
        tinNumber: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid TIN Number',
                errorMessage: 'Please enter your TIN Number.'
            },
            pattern: {
                errorTitle: 'Invalid TIN Number',
                errorMessage: 'TIN Number should not contain special characters.'
            }
        },
        taxCountry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Country',
                errorMessage: 'Please select your Country.'
            }
        },
        radioTin: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Answer',
                errorMessage: 'Please select your answer.'
            }
        },
        noTinReason: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Reason',
                errorMessage: 'Please select a Reason.'
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
                errorTitle: 'Invalid Name',
                errorMessage: 'First Name and Last Name are not matched with Full Name.'
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
            nric: {
                errorTitle: 'Invalid NRIC Number',
                errorMessage: 'NRIC Number you have entered is invalid.'
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
            },
            isMinExpiry: {
                errorTitle: 'Invalid Passport Expiry',
                errorMessage: 'You need to have atleast 6 months of passport validity'
            }
        },
        dob: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Date of Birth',
                errorMessage: 'Please enter Date of Birth.'
            },
            isMinAge: {
                errorTitle: 'Invalid Date of Birth',
                errorMessage: 'You must be 18 yrs and above to create an investment account.'
            }
        },
        sourceOfIncome: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Source of investment funds',
                errorMessage: 'Please select your Source of investment funds.'
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
                errorMessage: 'Company Name should not contain numbers and special characters.'
            }
        },
        occupation: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Occupation',
                errorMessage: 'Please select your Occupation.'
            }
        },
        occupationForOthers: {
            required: {
                errorTitle: 'Invalid Occupation',
                errorMessage: 'Please enter your occupation.'
            }
        },
        industry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Industry',
                errorMessage: 'Please select your Industry'
            }
        },
        industryForOthers: {
            required: {
                errorTitle: 'Invalid Industry',
                errorMessage: 'Please enter your Industry.'
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
                errorMessage: 'Please enter valid Postal Code.'
            }
        },
        empAddress1: {
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
        empAddress2: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address Line 2',
                errorMessage: 'Please enter Address Line 2.'
            },
            pattern: {
                errorTitle: 'Invalid Address Line 2',
                errorMessage: 'Address Line 2 should not contain special characters.'
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
                errorMessage: 'Please enter State/Province/Region.'
            },
            pattern: {
                errorTitle: 'Invalid state',
                errorMessage: 'State/Province/Region should not contain numbers and special characters.'
            }
        },

        empZipCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Zip Code',
                errorMessage: 'Please enter Zip Code.'
            },
            pattern: {
                errorTitle: 'Invalid Zip Code',
                errorMessage: 'Zip Code should not contain special characters.'
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
                errorMessage: 'Please enter Total Assets.'
            }
        },
        financialTotalLiabilities: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Total Loans',
                errorMessage: 'Please enter Total Loans.'
            }
        },
        expectedNumberOfTransation: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Expected Number Of Transactions.',
                errorMessage: 'Please enter Expected Number Of Transactions.'
            }
        },
        expectedAmountPerTranction: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Expected Amount Per Transaction.',
                errorMessage: 'Please enter Expected Amount Per Transaction.'
            }
        },
        source: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Source Of Investment Funds',
                errorMessage: 'Please select Source Of Investment Funds.'
            }
        },
        personalSavings: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Personal Savings',
                errorMessage: 'Please enter Personal Savings.'
            }
        },
        inheritanceGift: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid enter Gift Inheritance',
                errorMessage: 'Please enter Gift Inheritance.'
            }
        },
        durationInvestment: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Investment Period.',
                errorMessage: 'Please enter Duration investment held for.'
            }
        },
        earningsGenerated: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Earnings Generated From',
                errorMessage: 'Please select Earnings Generated From.'
            }
        },
        pepoccupation: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Occupation',
                errorMessage: 'Please select Occupation.'
            }
        },
        fName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid First Name',
                errorMessage: 'Please enter First Name.'
            },
            pattern: {
                errorTitle: 'Invalid First Name',
                errorMessage: 'First Name should not contain numbers and special characters.'
            }
        },
        lName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Last Name',
                errorMessage: 'Please enter Last Name.'
            },
            pattern: {
                errorTitle: 'Invalid Last Name',
                errorMessage: 'Last Name should not contain numbers and special characters.'
            }
        },
        cName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Company Name',
                errorMessage: 'Please enter Company name.'
            }
        },
        pepCountry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Country',
                errorMessage: 'Please select Country.'
            }
        },
        pepPostalCode: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Postal Code',
                errorMessage: 'Please enter Postal Code.'
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
                errorMessage: 'Please enter Address Line 1.'
            },
            pattern: {
                errorTitle: 'Invalid Address1',
                errorMessage: 'Address1 should not contain  special characters.'
            }
        },
        pepAddress2: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address Line 2.',
                errorMessage: 'Please enter Address Line 2.'
            },
            pattern: {
                errorTitle: 'Invalid Address2',
                errorMessage: 'Address2 should not contain  special characters.'
            }
        },
        pepFloor: {
            required: {
                errorTitle: 'Invalid Floor',
                errorMessage: 'Please enter Floor.'
            }
        },
        pepUnitNo: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Unit No.',
                errorMessage: 'Please enter Unit No.'
            },
            pattern: {
                errorTitle: 'Invalid Unit No.',
                errorMessage: 'Unit No should not contain alphabet characters.'
            }
        },
        pepCity: {
            required: {
                errorTitle: 'Invalid City',
                errorMessage: 'Please enter City.'
            },
            pattern: {
                errorTitle: 'Invalid City',
                errorMessage: 'City should not contain numbers and special characters.'
            }
        },
        pepState: {
            required: {
                errorTitle: 'Invalid State',
                errorMessage: 'Please enter your State.'
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
                errorMessage: 'Please enter Zip Code.'
            },
            pattern: {
                errorTitle: 'Invalid Zip Code',
                errorMessage: 'Zip Code should not contain special characters.'
            }
        },
        salaryRange: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid salary range',
                errorMessage: 'Please select salary range.'
            }
        }
    };

}
