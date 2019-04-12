export class TopUpAndWithdrawFormError {
  formFieldErrors: object = {
    errorTitle: 'Error !',
    oneTimeInvestmentAmount: {
      required: {
        errorTitle: 'Invalid Investment Amount',
        errorMessage: 'Enter Investment Amount.'
      }
    },
    MonthlyInvestmentAmount: {
      required: {
        errorTitle: 'Invalid Investment Amount',
        errorMessage: 'Enter Investment Amount.'
      }
    },
    portfolio: {
      required: {
        errorTitle: 'Invalid Portfolio',
        errorMessage: 'Select a Portfolio.'
      }
    },
    Investment: {
      required: {
        errorTitle: 'Invalid Investment Type',
        errorMessage: 'Select One-time or Monthly Investment.'
      }
    },
    withdrawType: {
      required: {
        errorTitle: 'Invalid Withdraw Type',
        errorMessage: 'Select a Withdraw Type.'
      }
    },
    withdrawAmount: {
      required: {
        errorTitle: 'Invalid Withdraw Amount',
        errorMessage: 'Enter Withdraw Amount.'
      },
      portfolioToBank: {
        errorTitle: 'Invalid Withdraw Type Amount',
        errorMessage: 'Withdrawal amount should not be more than the Portfolio Value.'
      },
      PortfolioToCash: {
        errorTitle: 'Invalid Withdraw Type Amount',
        errorMessage: 'Withdrawal amount should not be more than the Cash Account Value.'
      },
      MinValue: {
        errorTitle: 'Invalid Withdraw Type Amount',
        errorMessage: 'Withdrawal amount should more than 0.'
      }
    },
    withdrawPortfolio: {
      required: {
        errorTitle: 'Invalid Portfolio',
        errorMessage: 'Select a Portfolio.'
      }
    },
    withdrawBank: {
      required: {
        errorTitle: 'Invalid Bank',
        errorMessage: 'Select a bank or add new bank to withdraw.'
      }
    }
  };
}
