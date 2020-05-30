const INVESTMENT_API_BASE_URL = 'svc/invest/investment-microservice/api';
const ACCOUNT_API_BASE_URL = 'svc/account/account-microservice/api';



export let investmentApiConstants = {
    endpoint: {
        portfolio: {
            setInvestmentObjective: INVESTMENT_API_BASE_URL + '/CustomerInvestmentObjective',
            setAwaitingOrPendingInfo: INVESTMENT_API_BASE_URL + '/portfolios/$CUSTOMER_PORTFOLIO_ID$/transactions/$AWAITING_PENDING_PARAM$',
            getRiskAssessmentQuestions: INVESTMENT_API_BASE_URL + '/RiskAssessment',
            updateRiskAssessment: INVESTMENT_API_BASE_URL + '/RiskAssessment',
            getFinancialDetails: INVESTMENT_API_BASE_URL + '/customer/getFinancialDetailsForInvestment',
            getAllocationDetails: INVESTMENT_API_BASE_URL + '/enquiries/$ENQUIRY_ID$/portfolios/recommend'
        },
        investmentAccount: {
            nationalityCountrylist: INVESTMENT_API_BASE_URL + '/groupedCountryList',
            nationalitylist: INVESTMENT_API_BASE_URL + '/countrylist',
            lndustrylist: INVESTMENT_API_BASE_URL + '/industrylist',
            occupationlist: INVESTMENT_API_BASE_URL + '/occupationlist',
            allDropdownlist: INVESTMENT_API_BASE_URL + '/optionListCollection',
            fundingMethodList: INVESTMENT_API_BASE_URL + '/optionListCollection?groupName=portfolioFundingMethod',
            getSpecificDropList: INVESTMENT_API_BASE_URL + '/optionListCollection?groupName=$GROUP_NAME$',
            investmentsSummary: INVESTMENT_API_BASE_URL + '/customers/investment-profile/summary',
            updateInvestment: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/UpdateCustomerInvestmentObjective',
            createInvestmentAccount: INVESTMENT_API_BASE_URL + '/customers/investment-accounts?handleError=true',
            verifyAML: ACCOUNT_API_BASE_URL + '/verifyAML?handleError=true',
            getFundTransferDetails: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/ifast/bank-details',
            buyPortfolio: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/transactions/buy?handleError=true',
            deletePortfolio: INVESTMENT_API_BASE_URL + '/customer/portfolios',
            monthlyInvestment: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/InvestmentObjective/monthlyInvestment?handleError=true',
            sellPortfolio: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/transactions/sell?handleError=true',
            saveNationality: INVESTMENT_API_BASE_URL + '/customer/setNationality',
            investmentoverview: INVESTMENT_API_BASE_URL + '/customers/investment-profile?handleError=true',
            porfolioDetails: INVESTMENT_API_BASE_URL + '/customer/portfolios/$CUSTOMER_PORTFOLIO_ID$/summary',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false',
            uploadDocument: ACCOUNT_API_BASE_URL + '/saveDocuments',
            saveInvestmentAccount: ACCOUNT_API_BASE_URL + '/saveCustomerDetails',
            confirmPortfolio: INVESTMENT_API_BASE_URL + '/customer/portfolios/$customerPortfolioId$/accept?handleError=true',
            savePortfolioName: INVESTMENT_API_BASE_URL + '/customer/saveOrUpdatePortfolioName?handleError=true',
            getPortfolioDetailsWithAuth: INVESTMENT_API_BASE_URL + '/portfolios/recent',
            gerSrsDetails: ACCOUNT_API_BASE_URL + '/customer/getSrsBankDetails',
            saveSrsAccountDetails: ACCOUNT_API_BASE_URL + '/customer/$CUSTOMER_PORTFOLIO_ID$/srsbankDetails',
            getInvestmentNote: INVESTMENT_API_BASE_URL + '/holiday/alert?handleError=true'
        },
        investment: {
            getUserAddress: ACCOUNT_API_BASE_URL + '/customer/address',
            getUserBankList: ACCOUNT_API_BASE_URL + '/customer/banks',
            addNewBank: ACCOUNT_API_BASE_URL + '/customer/bank?handleError=true',
            getTransactions: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/transactions/search',
            getStatement: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/statements/',
            monthlyInvestmentInfo: INVESTMENT_API_BASE_URL + '/customers/portfolios/$CUSTOMER_PORTFOLIO_ID$/CustomerInvestmentObjective',
            getFirstInvAccountCreationStatus: INVESTMENT_API_BASE_URL + '/customer/investmentAccount/actions',
            featurePromotions: INVESTMENT_API_BASE_URL + '/featurePromotions?handleError=true',
        }
    }
};
