export class CreateAccountFormError {
    formFieldErrors: object = {
        errorTitle: 'Invalid Form',
        countryCode: {
                required : {
                        errorTitle: 'Invalid Country Code',
                        errorMessage: 'Please enter your country code.'
                },
        },
        mobileNumber: {
                required : {
                        // tslint:disable-next-line:no-duplicate-string
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Please enter your mobile number.'
                },
                pattern : {
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Mobile number field should be 8 to 10 characters length.'
                },
                mobileRange : {
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Mobile number should contain 8 digits.'
                }
        },
        firstName: {
                required : {
                        errorTitle: 'Invalid First Name',
                        errorMessage: 'Please enter your first name.'
                },
                pattern : {
                        errorTitle: 'Invalid First Name',
                        errorMessage: 'First name field can only contain alphabets value of 2 - 40 characters in length.'
                }
        },
        lastName: {
                required : {
                        errorTitle: 'Invalid Last Name',
                        errorMessage: 'Please enter your last name.'
                },
                pattern : {
                        errorTitle: 'Invalid Last Name',
                        errorMessage: 'Last name field can only contain alphabets value of 2 - 40 characters in length.'
                }
        },
        email: {
                required : {
                        errorTitle: 'Invalid E-mail',
                        errorMessage: 'Please enter your Email address.'
                },
                email : {
                        errorTitle: 'Invalid E-mail',
                        errorMessage: 'Please enter a valid email address in the format yourname@example.com.'
                }
        },
        termsOfConditions: {
                required : {
                        errorTitle: '',
                        errorMessage: 'Please agree to MoneyOwl\'s Terms of Use and Privacy Policy.'
                }
        },
        loginUsername: {
                required : {
                        errorTitle: 'Mobile No. or Email Address required',
                        errorMessage: 'Please enter your Mobile No. or Email Address'
                },
                pattern : {
                        errorTitle: 'Invalid Mobile No. or Email Address',
                        errorMessage: 'Please enter your valid username'
                }
        },
        loginPassword: {
                required : {
                        // tslint:disable-next-line:no-duplicate-string
                        errorTitle: 'Password required',
                        // tslint:disable-next-line:no-duplicate-string
                        errorMessage: 'Please enter your Password'
                }
        },
        resetPassword1: {
                required : {
                        errorTitle: 'Password required',
                        errorMessage: 'Please enter your Password'
                },
                pattern : {
                        errorTitle: 'Invalid password',
                        errorMessage: 'Password at least contain 1 Uppercase & 1 Lowercase & 1 Number '
                }
        },
        confirmpassword: {
                required : {
                        errorTitle: 'Password required',
                        errorMessage: 'Please enter your Password'
                },
                pattern : {
                        errorTitle: 'Invalid password',
                        errorMessage: 'Password at least contain 1 Uppercase & 1 Lowercase & 1 Number '
                }
        }
    };
}
