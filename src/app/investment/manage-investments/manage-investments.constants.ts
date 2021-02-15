export let MANAGE_INVESTMENTS_CONSTANTS = {
  ALLOW_MANAGE_INVESTMENTS_GUARD: [
    'PORTFOLIO_PURCHASED',
    'ACCOUNT_CREATED',
    'ACCOUNT_FUNDED'
  ],
  TOPUP: {
    ONE_TIME_INVESTMENT_OPTION_ID: 1,
    MONTHLY_INVESTMENT_OPTION_ID: 2,
    MONTHLY_INVESTMENT: 'Monthly Investment',
    ONETINE_INVESTMENT: 'One-time Investment',
    MONTHLY_AMOUNT: 'Monthly Amount',
    ONETIME_AMOUNT: 'One-time Amount',
    ONETIME_BUY_REQUEST: 'One-time buy',
    MONTHLY_BUY_REQUEST: 'Monthly buy',
    SRS_OPERATOR: {
      DBS: 'DBS',
      OCBC: 'OCBC',
      UOB: 'UOB'
    },
    FUNDING_METHODS: {
      CASH: 'CASH',
      SRS: 'SRS'
    },
    TOPUP_TYPES: {
      ONE_TIME: {
        NAME: 'One-time Amount',
        VALUE: 'One-time'

      },
      MONTHLY: {
        NAME: 'Monthly Amount',
        VALUE: 'Monthly'
      }
    }
  },
  WITHDRAW: {
    WITHDRAWAL_TYPES: [
      { id: 1, name: 'Portfolio to Cash Account', value: 'PORTFOLIO_TO_CASH_ACCOUNT' },
      { id: 2, name: 'Portfolio to Bank Account', value: 'PORTFOLIO_TO_BANK_ACCOUNT' },
      { id: 3, name: 'Cash Account to Bank Account', value: 'CASH_TO_BANK_ACCOUNT' },
      { id: 4, name: 'Portfolio to SRS Account', value: 'PORTFOLIO_TO_SRS_ACCOUNT' }
    ],
    PORTFOLIO_TO_CASH_TYPE_ID: 1,
    PORTFOLIO_TO_BANK_TYPE_ID: 2,
    CASH_TO_BANK_TYPE_ID: 3,
    PORTFOLIO_TO_SRS_TYPE_ID: 4,
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
      { id: 2, name: 'Transfer', value: 'TRANSFER' },
      { id: 3, name: 'Transactions / Statements', value: 'TRANSACTIONS_STATEMENTS' },
      { id: 4, name: 'Rename Portfolio', value: 'RENAME_PORTFOLIO' },
      { id: 5, name: 'Withdrawal', value: 'WITHDRAWAL' },
      { id: 6, name: 'Delete Portfolio', value: 'DELETE_PORTFOLIO' }

    ],
    TRANSACTIONS: 'Transactions',
    WITHDRAWAL: 'Withdrawal'
  },
  TRANSFER_INSTRUCTION: {
    MODE: 'BANK'
  },
  TOPUP_INSTRUCTION_URL: '/app/faq#investment',
  WITHDRAW_PAYMENT_MODE_KEYS: {
    PORTFOLIO_TO_CASH_ACCOUNT: 'PORTFOLIO_TO_CASH_ACCOUNT',
    PORTFOLIO_TO_BANK_ACCOUNT: 'PORTFOLIO_TO_BANK_ACCOUNT',
    CASH_TO_BANK_ACCOUNT: 'CASH_TO_BANK_ACCOUNT',
    PORTFOLIO_TO_SRS_ACCOUNT: 'PORTFOLIO_TO_SRS_ACCOUNT'
  },
  REBALANCE_ADDITIONAL_MESSAGE: [
     'MODERATE',
     'BALANCED',
     'GROWTH'
  ]
};

export let PORTFOLIO_WITHDRAWAL_KEYS = [
  MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_CASH_ACCOUNT,
  MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_BANK_ACCOUNT,
  MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_SRS_ACCOUNT
];
