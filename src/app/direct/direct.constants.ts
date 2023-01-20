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
    PREMIUM_DURATION_LIST: ['5 Years', '10 Years', '15 Years', '20 Years', '25 Years', '30 Years'],
    PAYOUT_DURATION_LIST: ['10 Years', '15 Years', '20 Years'],
    DEFAULT_VALUES: {
        RETIREMENT_INCOME: 600,
        PAYOUT_AGE: 65,
        PAYOUT_DURATION: '10 Years',
        PAYOUT_FEATURE: 'Variable',
        PREMIUM_DURATION: '10 Years'
    }
};

export const SRS_APPROVED_PLANS_CONST = {
    PAYOUT_AGE_LIST: [50, 55, 60, 62, 64, 65, 69, 70],
    PREMIUM_AMOUNT_LIST: ['10000', '15000', '20000', '30000', '40000', '50000', '60000', '70000', '72000', '80000', '84000', '96000', '108000', '120000', '132000', '144000', '156000', '168000', '180000', '192000', '216000', '240000', '264000', '288000', '312000', '336000', '360000']
};

export const CRITICAL_ILLNESS_CONST = {
    DURATION_LIST: ['5 Years', '10 Years', 'Till Age 55', 'Till Age 60', 'Till Age 65', 'Till Age 70', 'Till Age 75', 'Till Age 99', 'Whole Life', 'Whole life w/Multiplier']
};