import { RegexConstants } from "./../../shared/utils/api.regex.constants";

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
    CPF_OPERATOR: {
      DBS: {
        name: 'DBS',
        regExp: RegexConstants.cpfOperatorMask.DBS
      },
      OCBC: {
        name: 'OCBC',
        regExp: RegexConstants.cpfOperatorMask.OCBC
      },
      UOB: {
        name: 'UOB',
        regExp: RegexConstants.cpfOperatorMask.UOB
      }
    },
    FUNDING_METHODS: {
      CASH: 'CASH',
      SRS: 'SRS',
      CPF: 'CPF OA'
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
      { id: 4, name: 'Portfolio to SRS Account', value: 'PORTFOLIO_TO_SRS_ACCOUNT' },
      { id: 5, name: 'Portfolio to CPFIA', value: 'PORTFOLIO_TO_CPF_ACCOUNT' }
    ],
    PORTFOLIO_TO_CASH_TYPE_ID: 1,
    PORTFOLIO_TO_BANK_TYPE_ID: 2,
    CASH_TO_BANK_TYPE_ID: 3,
    PORTFOLIO_TO_SRS_TYPE_ID: 4,
    PORTFOLIO_TO_CPF_TYPE_ID: 5,
    DEFAULT_WITHDRAW_MODE: 'BANK',
    MIN_WITHDRAW_AMOUNT: 50,
    CPF_MIN_WITHDRAW_AMOUNT: 200,
    MIN_BALANCE_AMOUNT: 50,
    CPF_MIN_BALANCE_AMOUNT: 200
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
      { id: 6, name: 'Change Payout Option', value: 'CHANGE_PAYOUT_OPTION' },
      { id: 7, name: 'Delete Portfolio', value: 'DELETE_PORTFOLIO' }

    ],
    TRANSACTIONS: 'Transactions',
    WITHDRAWAL: 'Withdrawal',
    WISE_INCOME_TIME_INTERVALS: [
      { startTime: "2021-07-01T16:00:00.000+08:00", endTime: "2021-08-02T23:59:59.000+08:00", month: "August." },
      { startTime: "2021-10-01T16:00:00.000+08:00", endTime: "2021-11-01T23:59:59.000+08:00", month: "November." },
      { startTime: "2022-01-03T16:00:00.000+08:00", endTime: "2022-02-01T23:59:59.000+08:00", month: "February." }
    ]
  },
  TRANSFER_INSTRUCTION: {
    MODE: 'BANK'
  },
  TOPUP_INSTRUCTION_URL: 'https://www.moneyowl.com.sg/faq-investment',
  WITHDRAW_PAYMENT_MODE_KEYS: {
    PORTFOLIO_TO_CASH_ACCOUNT: 'PORTFOLIO_TO_CASH_ACCOUNT',
    PORTFOLIO_TO_BANK_ACCOUNT: 'PORTFOLIO_TO_BANK_ACCOUNT',
    CASH_TO_BANK_ACCOUNT: 'CASH_TO_BANK_ACCOUNT',
    PORTFOLIO_TO_SRS_ACCOUNT: 'PORTFOLIO_TO_SRS_ACCOUNT',
    PORTFOLIO_TO_CPF_ACCOUNT: "PORTFOLIO_TO_CPF_ACCOUNT"   // key to be mapped from BackEnd constant value from TransactionDetailDto paymentMode
  },
  WISEINCOME_PAYOUT_TYPE: {
    FOUR_FIVE_PAYOUT: '4.5% p.a. income payout',
    EIGHT_PAYOUT: '8% p.a. income payout',
    REINVEST: 'Grow & invest payout'
  },
  WISE_INCOME_DELETE_PORTFOLIO_START_TIME: "2021-12-31T16:00:00.000+08:00",
  WISE_INCOME_DELETE_PORTFOLIO_END_TIME: "2022-02-01T23:59:59.000+08:00",
  JOINT_ACCOUNT: {
    REFRESH: "Refresh",
    ACTIONS: {
      SEND_REMINDER: "SEND_REMINDER"
    },
    ERROR_CODES: {
      ONE_REMINDER_PER_DAY: 5130
    }
  }
};

export let PORTFOLIO_WITHDRAWAL_KEYS = [
  MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_CASH_ACCOUNT,
  MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_BANK_ACCOUNT,
  MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_SRS_ACCOUNT,
  MANAGE_INVESTMENTS_CONSTANTS.WITHDRAW_PAYMENT_MODE_KEYS.PORTFOLIO_TO_CPF_ACCOUNT
];
