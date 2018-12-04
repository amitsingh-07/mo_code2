export class FormError {
    subscribeFormErrors: object = {
        400: [
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
                errorMessage: 'Please enter a valid email'
        },
        DEFAULT: {
                errorTitle: 'Default',
                errorMessage: 'Invalid Message'
        }
    };
}
