export class PersonalFormError {
        formFieldErrors: object = {
                myProfile: {
                        required:
                                { errorTitle: 'Invalid Profile', errorMessage: 'One value should be selected' }
                },
                gender: {
                        required: { errorTitle: 'Invalid Gender', errorMessage: 'Select the gender' }
                },
                dateOfBirth: {
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
                }
        };
}
