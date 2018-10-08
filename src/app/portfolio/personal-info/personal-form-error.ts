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
                        moreasset: { errorTitle: 'Information', errorMessage: 'Your investment amount is more than your total assets. Would you like to continue?' },
                        // tslint:disable-next-line:max-line-length
                        moreinvestment: { errorTitle: 'Information', errorMessage: 'Your monthly investment amount is more than your monthly income saved. Would you like to continue?' },
                        // tslint:disable-next-line:max-line-length
                        moreassetandinvestment: { errorTitle: 'Information', errorMessage: 'Your investment amount is more than your total assets and your monthly investment amount is more than your monthly income saved. Would you like to continue?' }
                        }
        };
}
