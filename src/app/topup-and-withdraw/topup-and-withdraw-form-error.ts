export class TopUpAndWithdrawFormError {
    formFieldErrors: object = {
        errorTitle: 'Error !',
        oneTimeInvestmentAmount: {
            required: {
                errorTitle: 'Invalid Investment Amount',
                errorMessage: 'Please enter Investment Amount.'
            },
        },
        MonthlyInvestmentAmount: {
            required: {
                errorTitle: 'Invalid Investment Amount',
                errorMessage: 'Please enter Investment Amount.'
            },
        },
        portfolio: {
            required: {
                errorTitle: 'Invalid Portfolio',
                errorMessage: 'Please select a Portfolio.'
            },
        },
        Investment: {
            required: {
                errorTitle: 'Invalid Investment Type',
                errorMessage: 'Please select One-time or Monthly Investment.'
            },
        },
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
            sufficientBalance: {
                errorTitle: 'Invalid Withdraw Amount',
                errorMessage: 'Value you have entered is more than the available balance. Please enter the valid amount <= available balance.'
            }
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
