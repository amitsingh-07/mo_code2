export class ComprehensiveFormError {
    invalidName = 'Invalid Name';
    myProfileForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the following details:',
            gender: {
                required: {
                    errorTitle: 'Invalid Gender',
                    errorMessage: 'Gender'
                }
            },
            dob: {
                required: {
                    errorTitle: 'Invalid Date of Birth',
                    errorMessage: 'Date of Birth'
                }
            },
            nationality: {
                required: {
                    errorTitle: 'Invalid Nationality',
                    errorMessage: 'Nationality'
                }
            }

        }
    };
}
