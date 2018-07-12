export class FormError {
    formFieldErrors: object = {
        myProfile: {
            required : {errorTitle: 'Invalid Profile', errorMessage: 'One value should be selected'}
        },
        gender: {
                required : {errorTitle: 'Invalid Gender', errorMessage: 'Select the gender'}
        },
        dob: {
                required : {errorTitle: 'Invalid Birth Year', errorMessage: 'Enter correct DOB'}
        },
        smoker: {
                required : {errorTitle: 'Invalid Smoker', errorMessage: 'Select one option'}
        },
        dependent: {
                required : {errorTitle: 'Invalid Dependent', errorMessage: 'Dependent required'}
        }
    };
}
