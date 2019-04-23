export const COMPREHENSIVE_CONST = {
    PROMO_ACTION_TYPE: {
     GET: 'GET_PROMO_CODE',
     VALIDATE: 'VALIDATE_PROMO_CODE',
    },
    YOUR_PROFILE: {
        APP_MIN_AGE: 18,
        APP_MAX_AGE: 54,
        DATE_PICKER_MIN_YEAR: 0,
        DATE_PICKER_MAX_YEAR: 100
    },
    YOUR_FINANCES: {
        YOUR_EARNINGS: {
            API_KEY: 'comprehensiveIncome',
            API_TOTAL_BUCKET_KEY: 'totalAnnualIncomeBucket',
            MONTHLY_INPUT_CALC : ['monthlySalary', 'monthlyRentalIncome', 'otherMonthlyWorkIncome', 'otherMonthlyIncome'],
            POP_FORM_INPUT: ['enquiryId', 'totalAnnualIncomeBucket'],
            BUCKET_INPUT_CALC: ['monthlySalary', 'annualBonus', 'monthlyRentalIncome', 'otherMonthlyWorkIncome',
            'otherMonthlyIncome', 'annualDividends', 'otherAnnualIncome']
        },
        YOUR_SPENDING: {
            API_KEY: 'comprehensiveSpending',
            API_TOTAL_BUCKET_KEY: 'totalAnnualExpenses',
            MONTHLY_INPUT_CALC : ['monthlyLivingExpenses', 'HLMortgagePaymentUsingCPF', 'HLMortgagePaymentUsingCash',
            'mortgagePaymentUsingCPF', 'mortgagePaymentUsingCash', 'carLoanPayment', 'otherLoanPayment'],
            POP_FORM_INPUT: ['enquiryId', 'totalAnnualExpenses', 'HLtypeOfHome', 'homeLoanPayOffUntil',
            'mortgageTypeOfHome', 'mortgagePayOffUntil', 'otherLoanPayoffUntil']
        },
        YOUR_ASSETS: {
            API_KEY: 'comprehensiveAssets',
            API_TOTAL_BUCKET_KEY: 'totalAnnualAssets',
            MONTHLY_INPUT_CALC : [],
            POP_FORM_INPUT: ['enquiryId', 'totalAnnualAssets'],
            BUCKET_INPUT_CALC: ['cashInBank', 'savingsBonds', 'cpfOrdinaryAccount', 'cpfSpecialAccount', 'cpfMediSaveAccount',
            'homeMarketValue', 'investmentAmount_0', 'otherAssetsValue', 'investmentPropertiesValue']
        },
        YOUR_LIABILITIES: {
            API_KEY: 'comprehensiveLiabilities',
            API_TOTAL_BUCKET_KEY: 'totalAnnualLiabilities',
            MONTHLY_INPUT_CALC : [],
            POP_FORM_INPUT: ['enquiryId', 'totalAnnualLiabilities'],
            BUCKET_INPUT_CALC: ['homeLoanOutstandingAmount', 'otherLoanOutstandingAmount', 'carLoansAmount',
            'otherPropertyLoanOutstandingAmount']
        },
    },
    INSURANCE_PLAN: {
        LONG_TERM_INSURANCE_AGE: 40
        },
    SUMMARY_CALC_CONST: {
        EDUCATION_ENDOWMENT: {
            DEPENDANT: {
                UNIVERSITY_FEE: {
                    'Medicine': {
                        'Singapore': 160000,
                        'Singaporean PR': 220000,
                        'USA': 676800,
                        'United Kingdom': 482400,
                        'Australia': 489600,
                        'Foreigner': 335000
                    },
                    'Non-Medicine': {
                        'Singapore': 44000,
                        'Singaporean PR': 64000,
                        'USA': 252800,
                        'United Kingdom': 210800,
                        'Australia': 163600,
                        'Foreigner': 96000
                    },
                    'PERCENT': 6
                },
                LIVING_EXPENSES: {
                    'Medicine': {
                        'Singapore': 60000,
                        'Singaporean PR': 60000,
                        'USA': 96400,
                        'United Kingdom': 92000,
                        'Australia': 96400,
                        'Foreigner': 60000
                    },
                    'Non-Medicine': {
                        'Singapore': 48000,
                        'Singaporean PR': 48000,
                        'USA': 96400,
                        'United Kingdom': 92000,
                        'Australia': 116800,
                        'Foreigner': 48000
                    },
                    'PERCENT': 3
                }
            },
            NON_DEPENDANT: {
                LIVING_EXPENSES: {
                    EXPENSE: 2000,
                    PERCENT: 3,
                    ABOUT_AGE: 10,
                    COMPUTED_EXPENSE: 2688
                },
                MEDICAL_BILL: {
                    EXPENSE: 5000,
                    PERCENT: 8,
                    ABOUT_AGE: 10,
                    COMPUTED_EXPENSE: 10795
                }
            }
        },
        INSURANCE_PLAN: {
            ESTIMATED_COST: 100000,
            DEPENDENT_AGE: 70,
        },
        ROUTER_CONFIG: {
            STEP1: true,
            STEP2: true,
            STEP3: true,
            STEP4: true,
        },
        YOUR_FINANCES: {
            HOME_PAY_CPF_EMPLOYED_BREAKDOWN: 6000,
            HOME_PAY_CPF_EMPLOYED_PERCENT: 0.8,
            HOME_PAY_CPF_SELF_EMPLOYED_BREAKDOWN: 6000,
            HOME_PAY_CPF_SELF_EMPLOYED_PERCENT: 0.96,
            SPARE_CASH_EARN_SPEND_PERCENT: 0.75,
            SPARE_CASH_ANNUAL_PERCENT: 0.50
        }
    },
    PAY_OFF_YEAR: 50
};
