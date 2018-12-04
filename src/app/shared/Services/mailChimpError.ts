export class FormError {
    subscribeFormErrors: object = {
        400: [
                {
                        errorTitle: 'Forgotten Email Not Subscribed',
                        errorRegex: /permanently deleted/g,
                        errorMessage: 'This email was blacklisted on our mailing list. Contact our system administrator for assistance'
                },
                {
                        errorTitle: 'Invalid Resource',
                        errorRegex: /enter a valid email/g,
                        errorMessage: 'Please enter a valid email address in the format yourname@example.com'
                },
                {
                        errorTitle: 'Invalid Resource',
                        errorRegex: /not allowing more signups/g,
                        errorMessage: 'this email has signed up to a lot of lists very recently; we are not allowing more signups for now'
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
