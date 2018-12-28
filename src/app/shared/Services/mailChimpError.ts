export class FormError {
    subscribeFormErrors: object = {
        400: [
                {
                        errorTitle: 'Resource could not be validated',
                        errorRegex: /could not be validated/g,
                        errorMessage: 'Please enter your first name and last name in the fields above'
                },
                {
                        errorTitle: 'Forgotten Email Not Subscribed',
                        errorRegex: /permanently deleted/g,
                        // tslint:disable-next-line:max-line-length
                        errorMessage: 'We are unable to add your email to our mailing list. Please contact us at clientsupport@moneyowl.com.sg for assistance.'
                },
                {
                        errorTitle: 'Invalid Resource',
                        errorRegex: /enter a valid email/g,
                        errorMessage: 'Please enter a valid email address in the format yourname@example.com'
                },
                {
                        errorTitle: 'Invalid Resource',
                        errorRegex: /not allowing more signups/g,
                        errorMessage: 'You’ve reached the maximum number of tries allowed. Please try again later.'
                },
                {
                        errorTitle: 'Invalid Email',
                        errorRegex: /provide a valid email address/g,
                        errorMessage: 'Please enter a valid email address in the format yourname@example.com'
                },
                {
                        errorTitle: 'Invalid Resource',
                        errorRegex: /looks fake or invalid/g,
                        errorMessage: 'Please enter a valid email address in the format yourname@example.com'
                }
        ],
        500: [
                {
                        errorTitle: 'Unknow Error',
                        errorRegex: /default/g,
                        errorMessage: 'Oops! We are unable to connect right now. Please try again later.'
                }
        ],
        INVALID: {
                errorTitle: 'Missing Fields',
                errorMessage: 'Please enter a valid email address in the format yourname@example.com'
        },
        DEFAULT: {
                errorTitle: 'Default',
                errorMessage: 'Oops! We are unable to connect right now. Please try again later.'
        }
    };
}
