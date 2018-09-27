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
                errorTitle: 'Invalid postal code',
                errorMessage: 'Please enter your postal code.'
            },
        },
        mailPostalCode: {
            required: {
                errorTitle: 'Invalid postal code in mailing address',
                errorMessage: 'Please enter your postal code in mailing address.'
            },
        },
        address1: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid Address 1',
                errorMessage: 'Please enter address 1.'
            },
            pattern: {
                errorTitle: 'Invalid Address 1',
                errorMessage: 'Address 1 should not contain special characters.'
            }
        },
        mailAddress1: {
            required: {
                errorTitle: 'Invalid Address 1 in mailing address.',
                errorMessage: 'Please enter address 1 in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid mail Address 1',
                errorMessage: 'Address 1 should not contain special characters in mailing address.'
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
                errorMessage: 'City should not countain numbers and special characters.'
            }
        },
        mailCity: {
            required: {
                errorTitle: 'Invalid mail city in mailing address',
                errorMessage: 'Please enter your city in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid city in mailing address',
                errorMessage: 'City should not countain numbers and special characters in mailing address.'
            }
        },
        state: {
            required: {
                errorTitle: 'Invalid state',
                errorMessage: 'Please enter your state.'
            },
            pattern: {
                errorTitle: 'Invalid state',
                errorMessage: 'State should not countain numbers and special characters.'
            }
        },
        mailState: {
            required: {
                errorTitle: 'Invalid state in mailing address',
                errorMessage: 'Please enter your state in mailing address.'
            },
            pattern: {
                errorTitle: 'Invalid state in mailing address',
                errorMessage: 'State should not countain numbers and special characters in mailing address.'
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
        fullName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid full name',
                errorMessage: 'Please enter full name.'
            },
            pattern: {
                errorTitle: 'Invalid full name',
                errorMessage: 'full name should not contain alphabet.'
            }
        },
        firstName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid full name',
                errorMessage: 'Please enter  first Name.'
            },
            pattern: {
                errorTitle: 'Invalid full name',
                errorMessage: 'first Name should not contain alphabet.'
            }
        },

        lastName: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid full name',
                errorMessage: 'Please enter last Name.'
            },
            pattern: {
                errorTitle: 'Invalid full name',
                errorMessage: 'last Name should not contain alphabet.'
            }
        },
        nricNumber: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid NRIC number',
                errorMessage: 'Please enter NRIC number.'
            },
            pattern: {
                errorTitle: 'Invalid NRIC number',
                errorMessage: 'NRIC number should not contain alphabet.'
            }
        },
        passportNumber: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid passport  number',
                errorMessage: 'Please enter passport  number.'
            },
            pattern: {
                errorTitle: 'Invalid passport  number',
                errorMessage: 'passport number should not contain alphabet.'
            }
        },
        passportExpiry: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid passport expiry date',
                errorMessage: 'Please enter passport expiry date.'
            },
            pattern: {
                errorTitle: 'Invalid passport expiry date',
                errorMessage: 'passport expiry date should not contain alphabet.'
            }
        },
        dob: {
            required: {
                // tslint:disable-next-line:no-duplicate-string
                errorTitle: 'Invalid date of birth',
                errorMessage: 'Please enter Date of birth date.'
            },
            pattern: {
                errorTitle: 'Invalid date of birth',
                errorMessage: 'passportExpiry date should not contain alphabet.'
            }
        }
    };

}
