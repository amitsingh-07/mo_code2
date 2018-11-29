export class FormError {
    subscribeFormErrors: object = {
        400: {
        'Forgotten Email Not Subscribed': {
                errorTitle: 'Forgotten Email Not Subscribed',
                errorMessage: 'Invalid Email. It was forgotten'
                },
        'Invalid Resource': {
                errorTitle: 'Invalid Resource',
                errorMessage: 'Invalid Email Address'
                }
        },
        DEFAULT: {
                errorTitle: 'Default',
                errorMessage: 'Invalid Message'
        }
    };
}
