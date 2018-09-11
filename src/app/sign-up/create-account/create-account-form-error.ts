export class CreateAccountFormError {
    formFieldErrors: object = {
        countryCode: {
                required : {
                        errorTitle: 'Invalid Country Code',
                        errorMessage: 'Please enter your country code'
                },
        },
        mobileNumber: {
                required : {
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Please enter your mobile number'
                },
                pattern : {
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Mobile number field should be 8 to 10 characters length'
                },
                mobileRange : {
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Mobile number range should be 8000000 to 9999999'
                }
        },
        firstName: {
                required : {
                        errorTitle: 'Invalid First Name',
                        errorMessage: 'Please enter your first name'
                },
                pattern : {
                        errorTitle: 'Invalid First Name',
                        errorMessage: 'First name field can only contain alphabets value'
                }
        },
        lastName: {
                required : {
                        errorTitle: 'Invalid Last Name',
                        errorMessage: 'Please enter your last name'
                },
                pattern : {
                        errorTitle: 'Invalid Last Name',
                        errorMessage: 'Last name field can only contain alphabets value'
                }
        },
        email: {
                required : {
                        errorTitle: 'Invalid E-mail',
                        errorMessage: 'Please enter your Email address'
                },
                email : {
                        errorTitle: 'Invalid E-mail',
                        errorMessage: 'Please enter your valid Email address'
                }
        }
    };
}