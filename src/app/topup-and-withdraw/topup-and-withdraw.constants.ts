export let TOPUPANDWITHDRAW_CONFIG = {
    TOPUP: {
        ONE_TIME_INVESTMENT_OPTION_ID: 1,
        MONTHLY_INVESTMENT_OPTION_ID: 2
    },
    WITHDRAW: {
        WITHDRAWAL_TYPES: [
            { id: 1, name: 'Portfolio to Cash Account', value: 'PORTFOLIO_TO_CASH_ACCOUNT' },
            { id: 2, name: 'Portfolio to Bank Account', value: 'PORTFOLIO_TO_BANK_ACCOUNT' },
            { id: 3, name: 'Cash Account to Bank Ac', value: 'CASH_TO_BANK_ACCOUNT' }
        ],
        PORTFOLIO_TO_CASH_TYPE_ID: 1,
        PORTFOLIO_TO_BANK_TYPE_ID: 2,
        CASH_TO_BANK_TYPE_ID: 3,
        DEFAULT_WITHDRAW_MODE: 'BANK'
    },
    STATEMENT: {
        STATEMENT_BASE_PATH: window.location.origin + '/assets/docs/portfolio/transaction/'
    }
};
