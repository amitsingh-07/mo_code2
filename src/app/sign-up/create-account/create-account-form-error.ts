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
                        errorMessage: 'Please enter your mobile number'
                },
                pattern : {
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Mobile number field should container 8 to 10 digits'
                },
                mobileRange : {
                        errorTitle: 'Invalid Mobile Number',
                        errorMessage: 'Invalid Mobile Number'
                },
                notChanged : {
                        errorTitle: 'Not Changed',
                        errorMessage: 'Update Mobile Number / Email address'
                }
        },
        firstName: {
                required : {
                        errorTitle: 'Invalid First Name',
                        errorMessage: 'Please enter your first name'
                },
                pattern : {
                        errorTitle: 'Invalid First Name',
                        errorMessage: 'Oops! Your first name should be 2 - 40 characters long'
                }
        },
        lastName: {
                required : {
                        errorTitle: 'Invalid Last Name',
                        errorMessage: 'Please enter your last name'
                },
                pattern : {
                        errorTitle: 'Invalid Last Name',
                        errorMessage: 'Oops! Your last name should be 2 - 40 characters long'
                }
        },
        email: {
                required : {
                        errorTitle: 'Invalid E-mail',
                        errorMessage: 'Please enter your email address'
                },
                email : {
                        errorTitle: 'Invalid E-mail',
                        errorMessage: 'Please enter a valid email address in the format yourname@example.com'
                }
        },
        confirmEmail: {
                required : {
                        errorTitle: 'Invalid Confirm E-mail',
                        errorMessage: 'Please enter your confirm email address'
                },
                notEquivalent: {
                        errorTitle: '',
                        errorMessage: ''
                }
        },
        password: {
                required : {
                        errorTitle: 'Invalid Password',
                        errorMessage: 'Please enter your password'
                },
                length : {
                        errorTitle: '',
                        errorMessage: ''
                },
                numberSymbol : {
                        errorTitle: '',
                        errorMessage: ''
                },
                upperLower : {
                        errorTitle: '',
                        errorMessage: ''
                },
        },
        termsOfConditions: {
                required : {
                        errorTitle: '',
                        errorMessage: 'Please agree to MoneyOwl\'s Terms of Use and Privacy Policy'
                }
        },
        loginUsername: {
                required : {
                        errorTitle: 'Mobile No. or Email Address required',
                        errorMessage: 'Please enter your mobile no. or email address'
                },
                pattern : {
                        errorTitle: 'Invalid Mobile No. or Email Address',
                        errorMessage: 'Please enter your mobile no. or email address'
                }
        },
        loginPassword: {
                required : {
                        // tslint:disable-next-line:no-duplicate-string
                        errorTitle: 'Password required',
                        // tslint:disable-next-line:no-duplicate-string
                        errorMessage: 'Please enter your password'
                }
        },
        resetPassword1: {
                required : {
                        errorTitle: 'Password required',
                        errorMessage: 'Please enter your password'
                },
                pattern : {
                        errorTitle: 'Invalid password',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'Password should contain at least 1 Uppercase & 1 Lowercase & 1 Number & 1 Symbol & 8-20 Alphanumeric Characters  '
                }
        },
        confirmpassword: {
                required : {
                        errorTitle: 'Password required',
                        errorMessage: 'Please enter your password'
                },
                pattern : {
                        errorTitle: 'Invalid password',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'Password should contain at least 1 Uppercase & 1 Lowercase & 1 Number & 1 Symbol & 8-20 Alphanumeric Characters  '
                }
        },
        captcha: {
                required : {
                        errorTitle: 'Invalid captcha',
                        errorMessage: 'Please enter valid captcha'
                }
        },
        confirmPassword: {
                required : {
                        errorTitle: 'Password required',
                        errorMessage: 'Please enter your confirm password'
                },
                pattern : {
                        errorTitle: 'Invalid password',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'New Password should contain at least 1 Uppercase & 1 Lowercase & 1 Number & 1 Symbol & 8-20 Alphanumeric Characters  '
                },
                notEquivalent: {
                        errorTitle: '',
                        errorMessage: ''
                }
        },
        newPassword: {
                required : {
                        errorTitle: 'Password required',
                        errorMessage: 'Please enter your new password'
                },
                pattern : {
                        errorTitle: 'Invalid password',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'New Password should contain at least 1 Uppercase & 1 Lowercase & 1 Number & 1 Symbol & 8-20 Alphanumeric Characters  '
                }
        },
        oldPassword: {
                required : {
                        errorTitle: 'Password required',
                        errorMessage: 'Please enter your old password.'
                },
                pattern : {
                        errorTitle: 'Invalid password',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'Password should contain at least 1 Uppercase & 1 Lowercase & 1 Number & 1 Symbol & 8-20 Alphanumeric Characters.'
                }
        },
        bank: {
                required : {
                        errorTitle: 'Bank Name required',
                        errorMessage: 'Select your Bank Name.'
                }
        },
        accountNo: {
                required : {
                        errorTitle: 'Account Number required',
                        errorMessage: 'Enter your Account Number.'
                },
                pattern : {
                        errorTitle: 'Invalid Account Number',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'Enter valid Account Number.'
                },
                validAccountNo : {
                        errorTitle: 'Invalid Account Number',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'Enter valid Account Number.'
                }
        },
        accountHolderName: {
                required : {
                        errorTitle: 'Account Holder Name required',
                        errorMessage: 'Enter your Name.'
                },
                pattern : {
                        errorTitle: 'Invalid Name',
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'Enter valid Name.'
                }
        },
    };
}
