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
    SRS: 'SRS',
    CPF_OA: 'CPF OA',
    CPFOA: 'CPFOA'
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
    WISESAVER: 'WiseSaver',
    CPF: 'CPF'
  },
  PORTFOLIO_CATEGORY_TYPE: {
    INVESTMENT: 'INVESTMENT',
    WISESAVER: 'WISESAVER',
    WISEINCOME: 'WISEINCOME',
    CPF: 'CPF'
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
    CREDIT_RATING: 'credit rating',
    CREDIT_RATING_ALLOCATION: 'credit rating allocation'
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
  CPF_PENDING_STATUS: 'CKA_PENDING',
  CPF_FEE_OFFER_YEAR: '2022',
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
    OTHERS: 'OTHERS',
    CKA_PASSED_STATUS: 'CKA_PASSED',
    CKA_FAILED_STATUS: 'CKA_FAILED',
    CKA_REJECTED_STATUS: 'CKA_REJECTED',
    CKA_CERTIFICATE_UPLOADED: 'UPLOADED',
    CKA_BE_CERTIFICATE_UPLOADED: 'CKA_CERTIFICATE_UPLOAD',
    METHODS: [
      "educational",
      "professional",
      "work-experience",
      "investment-experience"
    ],
    DROPDOWN_GROUPS: {
      EDUCATIONAL: {
        QUALIFICATION: "ckaEducationQualification",
        INSTITUE: "ckaEducationInstitute"
      },
      PROFESSIONAL: {
        QUALIFICATION: "ckaFinancialQualification",
        INSTITUTE: "ckaFinancialEducation"
      },
      INV_EPERIENCE: {
        LISTED: "ckaInvestmentListed",
        UNLISTED: "ckaInvestmentUnlisted"
      },
      WORK_EXPERIENCE: {
        WORK_EXPERIENCE: "ckaWorkExperience",
        EMPLOYER: "ckaWork"
      }
    }
  },
  CPF_BANK_KEYS: { /* ACCOUNT NUMBER LENGTH FOR LIST OF BANK CODES */
    DBS: 'DBS',
    OCBC: 'OCBC',
    UOB: 'UOB',
  },
  ASSET_TYPE: {
    EQUITIES: 'Equities',
    FIXED_INCOME: 'Fixed Income',
    BONDS: 'Bonds'
  },
  ASSET_ALLOCATION_CONST: {
    MIN_AMOUNT_FOR_ROUNDOFF: 0.05,
    ROUNDOFF_AMOUNT: 0.1
  }
};
