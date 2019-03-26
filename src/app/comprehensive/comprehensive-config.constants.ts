export const COMPREHENSIVE_CONST = {
    YOUR_FINANCES: {
        YOUR_EARNINGS: {
            API_KEY: 'comprehensiveIncome',
            API_TOTAL_BUCKET_KEY: 'totalAnnualIncomeBucket',
            MONTHLY_INPUT_CALC : ['monthlySalary', 'monthlyRentalIncome', 'otherMonthlyWorkIncome', 'otherMonthlyIncome'],
            POP_FORM_INPUT: ['enquiryId', 'totalAnnualIncomeBucket'],
            BUCKET_INPUT_CALC: ['monthlySalary', 'annualBonus']
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
            'homeMarketValue', 'investmentAmount_0', 'otherAssetsValue']
        },
        YOUR_LIABILITIES: {
            API_KEY: 'comprehensiveLiabilities',
            API_TOTAL_BUCKET_KEY: 'totalAnnualLiabilities',
            MONTHLY_INPUT_CALC : [],
            POP_FORM_INPUT: ['enquiryId', 'totalAnnualLiabilities'],
            BUCKET_INPUT_CALC: ['homeLoanOutstandingAmount', 'otherLoanOutstandingAmount', 'carLoansAmount']
        }
    }
};
