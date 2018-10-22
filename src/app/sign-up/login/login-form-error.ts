export class LoginFormError {
    formFieldErrors: object = {
        errorTitle: 'Error !',
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
        captchaValue: {
                required : {
                        errorTitle: 'Invalid captcha',
                        errorMessage: 'Please enter valid captcha'
                }
        }
    };
}
