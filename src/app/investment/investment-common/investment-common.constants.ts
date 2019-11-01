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
    FUNDING_DETAILS: {
        CASH: 'CASH',
        SRS: 'SRS',
        DBS: 'DBS',
        OCBC: 'OCBC',
        UOB: 'UOB'
    },
};
