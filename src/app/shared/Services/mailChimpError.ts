export class FormError {
    subscribeFormErrors: object = {
        400: {
        'Forgotten Email Not Subscribed': {
                errorTitle: 'Forgotten Email Not Subscribed',
                errorMessage: 'Invalid Email. It was forgotten'
                },
        'Invalid Resource': {
                errorTitle: 'Invalid Resource',
                errorMessage: 'Please enter a valid email address in the format yourname@example.com'
                }
        },
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
