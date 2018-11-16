export class TopUpAndWithdrawFormError {
    formFieldErrors: object = {
        errorTitle: 'Error !',
        withdrawPortfolio: {
            required: {
                errorTitle: 'Invalid Portfolio',
                errorMessage: 'Please select a Portfolio.'
            },
        },
        withdrawBank: {
            required: {
                errorTitle: 'Invalid Bank',
                errorMessage: 'Please select a bank or add new bank to withdraw.'
            },
        }
    };

}
