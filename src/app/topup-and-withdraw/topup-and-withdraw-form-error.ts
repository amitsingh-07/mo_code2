export class TopUpAndWithdrawFormError {
    formFieldErrors: object = {
        errorTitle: 'Error !',
        withdrawBank: {
            required: {
                errorTitle: 'Invalid Bank',
                errorMessage: 'Please select a bank or add new bank to withdraw.'
            },
        }
    };

}
