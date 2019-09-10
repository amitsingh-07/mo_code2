export let MANAGE_INVESTMENTS_CONSTANTS = {
  ALLOW_TOPUP_WITHDRAW_GUARD: [
    'PORTFOLIO_PURCHASED',
    'ACCOUNT_CREATED',
    'ACCOUNT_FUNDED'
  ],
  TOPUP: {
    ONE_TIME_INVESTMENT_OPTION_ID: 1,
    MONTHLY_INVESTMENT_OPTION_ID: 2,
    MONTHLY_INVESTMENT: 'Monthly Investment',
    ONETINE_INVESTMENT: 'One-time Investment'
  },
  WITHDRAW: {
    WITHDRAWAL_TYPES: [
      { id: 1, name: 'Portfolio to Cash Account', value: 'PORTFOLIO_TO_CASH_ACCOUNT' },
      { id: 2, name: 'Portfolio to Bank Account', value: 'PORTFOLIO_TO_BANK_ACCOUNT' },
      { id: 3, name: 'Cash Account to Bank Account', value: 'CASH_TO_BANK_ACCOUNT' }
    ],
    PORTFOLIO_TO_CASH_TYPE_ID: 1,
    PORTFOLIO_TO_BANK_TYPE_ID: 2,
    CASH_TO_BANK_TYPE_ID: 3,
    DEFAULT_WITHDRAW_MODE: 'BANK',
    MIN_WITHDRAW_AMOUNT: 50,
    MIN_BALANCE_AMOUNT: 50
  },
  FUNDING_INSTRUCTIONS: {
    ONETIME: 'ONETIME',
    MONTHLY: 'MONTHLY',
    BANK: 'bank',
    PAYNOW: 'PayNow',
    SUCCESS: '/success',
    PENDING: '/pending',
    FUNDING: 'FUNDING',
    TOPUP: 'TOPUP'
  },
  INVESTMENT_OVERVIEW: {
    MORE_LIST: [
      { id: 1, name: 'Top Up', value: 'TOPUP' },
      { id: 2, name: 'Transactions / Statements', value: 'TRANSACTIONS_STATEMENTS' },
      { id: 3, name: 'Rename Portfolio', value: 'RENAME_PORTFOLIO' },
      { id: 4, name: 'Withdrawal', value: 'WITHDRAWAL' },
      { id: 5, name: 'Delete Portfolio', value: 'DELETE_PORTFOLIO' }
    ],
    TRANSACTIONS: 'Transactions',
    WITHDRAWAL: 'Withdrawal'
  },
  TRANSFER_INSTRUCTION : {
    MODE: 'BANK'
  },
  TOPUP_INSTRUCTION_URL: 'https://advice.moneyowl.com.sg/investment/transacting'
};
