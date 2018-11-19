export class TopUpAndWithdrawFormError {
    formFieldErrors: object = {
        errorTitle: 'Error !',
        withdrawType: {
            required: {
                errorTitle: 'Invalid Withdraw Type',
                errorMessage: 'Please select a Withdraw Type.'
            },
        },
        withdrawAmount: {
            required: {
                errorTitle: 'Invalid Withdraw Amount',
                errorMessage: 'Please enter Withdraw Amount.'
            },
        },
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
