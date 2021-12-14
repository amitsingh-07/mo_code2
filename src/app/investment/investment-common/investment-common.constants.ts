export let INVESTMENT_COMMON_CONSTANTS = {
  FIRST_PORTFOLIO_GUARD: [
    'PORTFOLIO_PURCHASED',
    'ACCOUNT_CREATED',
    'ACCOUNT_FUNDED'
  ],
  NOT_ALLOW_USER_GUARD: [
    'BLOCKED_NATIONALITY',
    'EDD_CHECK_FAILED',
    'ACCOUNT_SUSPENDED'
  ],
  INVESTMENT_COMMON_GUARD: [
    'BLOCKED_NATIONALITY',
    'CDD_CHECK_PENDING',
    'EDD_CHECK_PENDING',
    'EDD_CHECK_FAILED',
    'ACCOUNT_SUSPENDED',
    'EDD_CHECK_CLEARED'
  ],
  FUNDING_METHODS: {
    CASH: 'CASH',
    SRS: 'SRS'
  },
  SRS_OPERATOR: {
    DBS: 'DBS',
    OCBC: 'OCBC',
    UOB: 'UOB'
  },
  PORTFOLIO_CATEGORY: {
    ALL: 'All',
    INVESTMENT: 'Investment',
    WISEINCOME: 'WiseIncome',
    WISESAVER: 'WiseSaver'
  },
  PORTFOLIO_CATEGORY_TYPE: {
    INVESTMENT: 'INVESTMENT',
    WISESAVER: 'WISESAVER',
    WISEINCOME: 'WISEINCOME'
  },
  WISESAVER_ASSET_ALLOCATION: {
    TYPE: 'WISESAVER',
    ASSETS: [
      {
        allocationPercentage: 99,
        type: {
          type: 'Fixed Deposits'
        }
      },
      {
        allocationPercentage: 1,
        type: {
          type: 'Cash'
        }
      }
    ]
  },
  ALLOCATION_DETAILS: {
    MATURITY: 'maturity',
    CREDIT_RATING: 'credit rating'
  },
  WISE_INCOME_PAYOUT: {
    GROW: '0%',
    FOUR_PERCENT: '4.5%* p.a.',
    EIGHT_PERCENT: '8% p.a.'
  },
  PORTFOLIO_PURCHASED: "PORTFOLIO_PURCHASED",
  NEXT_PAYOUT_START_TIME: "2021-09-01T00:00:00.000+08:00",
  NEXT_PAYOUT: 'Aug',
  NEXT_PAYOUT_WITH_YEAR: 'Aug 2021',
  JA_PORTFOLIO_STATUS: {
    AWAITING: 'AWAITING',
    WITHDRAWN: 'WITHDRAWN',
    DECLINED: 'DECLINED',
    VERIFY: 'VERIFY',
    EXPIRED: 'EXPIRED',
    INACTIVE: 'INACTIVE',
    IN_PROGRESS: 'INPROGRESS'
  },
  JA_ACTION_TYPES: {
    SEND_REMINDER: 'SEND_REMINDER',
    WITHDRAW: 'WITHDRAW',
    DECLINE: 'DECLINE',
    ACCEPT: 'ACCEPT',
    VERIFY: 'VERIFY',
    SUBMISSION: 'SUBMISSION',
    DELETE: 'DELETE'
  },
  PORTFOLIO: [
    {
      KEY: "WiseIncome R - 4.5 percent (Payout) - Cash",
      VALUE: "WiseIncome - 4.5% p.a. Income Payout"
    },
    {
      KEY: "WiseIncome R- 4.5 percent (Reinvested) - Cash",
      VALUE: "WiseIncome - Grow & Invest Payout"
    },
    {
      KEY: "WiseIncome R1 - 8 percent (Payout) - Cash",
      VALUE: "WiseIncome - 8% p.a. Income Payout"
    },
    {
      KEY: "Wisesaver – Cash",
      VALUE: "WiseSaver"
    }
  ],
  PROMO_CODE: {
    NOT_APPLIED: "Not Applied"
  },
  CKA: {
    METHODS: {
      EDUCATIONAL: "educational",
      PROFESSIONAL: "professional",
      INV_EPERIENCE: "investment-experience",
      WORK_EXPERIENCE: "work-experience"
    }
  }
};
