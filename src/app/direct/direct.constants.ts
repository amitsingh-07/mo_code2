export const PRODUCT_CATEGORY_INDEX = {
    LIFE_PROTECTION: 1,
    CRITICAL_ILLNESS: 2,
    OCCUPATIONAL_DISABILITY: 3,
    HOSPITAL_PLAN: 4,
    LONG_TERM_CARE: 5,
    EDUCATION_FUND: 6,
    RETIREMENT_INCOME: 7,
    SRS_PLANS: 8
};

export const LONG_TERM_CARE_SHIELD = {
    MIN_YEAR: 1970,
	AGE: 30
};

export const RETIREMENT_INCOME_CONST = {
    PAYOUT_AGE_LIST: [50, 55, 60, 65],
    PREMIUM_DURATION_LIST: ['5 Years', '10 Years', '15 Years', '20 Years', '25 Years'],
    PAYOUT_DURATION_LIST: ['10 Years', '15 Years', '20 Years'],
    DEFAULT_VALUES: {
        RETIREMENT_INCOME: 600,
        PAYOUT_AGE: 65,
        PAYOUT_DURATION: '10 Years',
        PAYOUT_FEATURE: 'Variable',
        PREMIUM_DURATION: '10 Years'
    }
};