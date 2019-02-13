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
    dependantForm: object = {
        formFieldErrors: {
            errorTitle: 'Oops! Please enter the following details:',
            name: {
                required: {
                        errorTitle: this.invalidName,
                        errorMessage: 'Full Name (as per ID)'
                },
                pattern: {
                        errorTitle:  this.invalidName,
                        errorMessage: 'Full Name - invalid characters. <br>Valid characters: a-z, A-Z, space and !"#$%&\'()*+,-./:;<=>?@[\\\]^_`{|}~'
                },
                minlength: {
                        errorTitle:  this.invalidName,
                        errorMessage: 'Full Name should be 2 - 100 characters long'
                },
                maxlength: {
                        errorTitle:  this.invalidName,
                        errorMessage: 'Full Name should be 2 - 100 characters long'
                }
        },
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
            },
            relationship: {
                required: {
                    errorTitle: 'Invalid Relationship',
                    errorMessage: 'Relationship'
                }
            }

        }
    };
}
