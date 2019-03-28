export const COMPREHENSIVE_CONST = {
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
            MONTHLY_INPUT_CALC : [],
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
            BUCKET_INPUT_CALC: ['homeLoanOutstandingAmount', 'otherLoanOutstandingAmount', 'carLoansAmount']
        }
    },
    SUMMARY_CALC_CONST: {
        EDUCATION_ENDOWMENT: {
            DEPENDANT: {
                UNIVERSITY_FEE: {
                    'Medicine': {
                        'Singapore': 160000,
                        'Singapore PR': 220000,
                        'USA': 676800,
                        'United Kingdom': 482400,
                        'Australia': 489600
                    },
                    'Non-Medicine': {
                        'Singapore': 44000,
                        'Singapore PR': 64000,
                        'USA': 252800,
                        'United Kingdom': 210800,
                        'Australia': 163600
                    },
                    'PERCENT': 6
                },
                LIVING_EXPENSES: {
                    'Medicine': {
                        'Singapore': 60000,
                        'Singapore PR': 60000,
                        'USA': 96400,
                        'United Kingdom': 92000,
                        'Australia': 96400
                    },
                    'Non-Medicine': {
                        'Singapore': 48000,
                        'Singapore PR': 48000,
                        'USA': 96400,
                        'United Kingdom': 92000,
                        'Australia': 116800
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
            TERM_INSURANCE: 90,
            WHOLE_LIFE: 450
        }
    }
};
