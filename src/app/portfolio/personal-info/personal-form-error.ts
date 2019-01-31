export class PersonalFormError {
        formFieldErrors: object = {
                myProfile: {
                        required:
                                { errorTitle: 'Invalid Profile', errorMessage: 'One value should be selected' }
                },
                gender: {
                        required: { errorTitle: 'Invalid Gender', errorMessage: 'Select the gender' }
                },
                dob: {
                        required: {
                                errorTitle: 'Invalid Birth Year',
                                errorMessage: 'Please re-check your entry. You have keyed in an invalid birth year.'
                        }
                },
                smoker: {
                        required: { errorTitle: 'Invalid Smoker', errorMessage: 'Select one option' }
                },
                dependent: {
                        required: { errorTitle: 'Invalid Dependent', errorMessage: 'Dependent required' }
                },
                financialValidations: {
                        // tslint:disable-next-line:no-duplicate-string
                        zero: { errorTitle: 'Invalid Amount', errorMessage: 'One-Time Investment and Monthly Investment cannot be 0' },
                        // tslint:disable-next-line:max-line-length
                        more: { errorTitle: 'Invalid Amount', errorMessage: 'Either One-Time Investment has to be more than $100 or Monthly Investment has to be more than $50' },
                        // tslint:disable-next-line:max-line-length
                        moreasset: { errorTitle: 'Oops! Is this correct?', errorMessage: 'We noticed that your investment amount is more than your total assets. Would you like to review your inputs?' , isButtons: 'Yes' },
                        // tslint:disable-next-line:max-line-length
                        moreinvestment: { errorTitle: 'Oops! Is this correct?', errorMessage: 'We noticed that your monthly investment amount is more than your total assets. Would you like to review your inputs?' , isButtons: 'Yes' },
                        // tslint:disable-next-line:max-line-length
                        moreassetandinvestment: { errorTitle: 'Oops! Is this correct?', errorMessage: 'Your investment amount is more than your total assets and your monthly investment amount is more than your monthly income saved. Would you like to continue?' , isButtons: 'Yes' },
                        // tslint:disable-next-line:max-line-length
                        one: { errorTitle: 'Oops! Review Investment<br>Amount', errorMessage: 'We require a one-time investment of at least $100 or a monthly investment of at least $50.' },
                        // tslint:disable-next-line:max-line-length
                        two: { errorTitle: 'Oops! Review Investment<br>Amount', errorMessage: 'We require a monthly investment of at least $50.<br><br>To continue, please review your investment amount.' },
                        // tslint:disable-next-line:max-line-length
                        three: { errorTitle: 'Oops! Review Investment<br>Amount', errorMessage: 'We require a one-time investment of at least $100.<br><br>To continue, please review your investment amount.' },
                        
                        four: { errorTitle: 'Invalid Amount', errorMessage: ' Must select at least 1 checkbox to continue.' }
                        }
        };
}
