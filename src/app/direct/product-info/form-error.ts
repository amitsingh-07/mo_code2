export class FormError {
    formFieldErrors: object = {
        gender: {
                required : {errorTitle: 'Invalid Gender', errorMessage: 'Select the gender'}
        },
        dob: {
                required : {errorTitle: 'Invalid Birth Year',
                        errorMessage: 'Please re-check your entry. You have keyed in an invalid birth year.'}
        },
        childgender: {
                required : {errorTitle: 'Invalid Gender', errorMessage: 'Select the gender'}
        },
        childdob: {
                required : {errorTitle: 'Invalid Birth Year',
                        errorMessage: 'Please re-check your entry. You have keyed in an invalid birth year.'}
        },
        smoker: {
                required : {errorTitle: 'Invalid Smoker', errorMessage: 'Select one option'}
        }
    };
}
