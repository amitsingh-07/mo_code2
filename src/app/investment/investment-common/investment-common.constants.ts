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
        WISESAVER: 'Wisesaver'
    },
    WISESAVER_ASSET_ALLOCATION : {
        TYPE: 'Wisesaver',
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
    }
};
