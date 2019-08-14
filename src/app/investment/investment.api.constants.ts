export const INVESTMENT_API_BASE_URL = 'invest/investment-microservice/';
const ACCOUNT_API_BASE_URL = 'account/account-microservice';

export let investmentApiConstants = {
    endpoint: {
        portfolio: {
            setInvestmentObjective: INVESTMENT_API_BASE_URL + 'api/CustomerInvestmentObjective',
            setOneTimeInvestmentObjective: INVESTMENT_API_BASE_URL + 'api/portfolio/awaitingTransactions',
            getRiskAssessmentQuestions: INVESTMENT_API_BASE_URL + 'api/RiskAssessment',
            updateRiskAssessment: INVESTMENT_API_BASE_URL + 'api/RiskAssessment',
            getAllocationDetails: INVESTMENT_API_BASE_URL + 'api/portfolio/recommend'
        },
        investmentAccount: {
            nationalityCountrylist: INVESTMENT_API_BASE_URL + 'api/groupedCountryList',
            nationalitylist: INVESTMENT_API_BASE_URL + 'countrylist',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false',
            lndustrylist: INVESTMENT_API_BASE_URL + 'api/industrylist',
            occupationlist: INVESTMENT_API_BASE_URL + 'api/occupationlist',
            allDropdownlist: INVESTMENT_API_BASE_URL + 'api/optionListCollection',
            uploadDocument: 'account/account-microservice/api/saveDocuments',
            saveInvestmentAccount: 'account/account-microservice/api/saveCustomerDetails',
            saveNationality: 'invest/investment-microservice/api/customer/setNationality',
            updateInvestment: INVESTMENT_API_BASE_URL + 'api/UpdateCustomerInvestmentObjective',
            createInvestmentAccount: INVESTMENT_API_BASE_URL + 'api/createIFastAccount?handleError=true',
            verifyAML: ACCOUNT_API_BASE_URL + '/api/verifyAML?handleError=true',
            getFundTransferDetails: INVESTMENT_API_BASE_URL + 'api/getIFastBankDetails',
            buyPortfolio: INVESTMENT_API_BASE_URL + 'portfolio/buy?handleError=true',
            deletePortfolio: INVESTMENT_API_BASE_URL + 'customer/portfolios',
            monthlyInvestment: INVESTMENT_API_BASE_URL + 'customer/InvestmentObjective/monthlyInvestment?handleError=true',
            sellPortfolio: INVESTMENT_API_BASE_URL + 'portfolio/sell?handleError=true',
            investmentoverview: 'invest/investment-microservice/portfolio/holdings?handleError=true',
            porfolioDetails: 'invest/investment-microservice/portfolios/detail'
        },
        investment: {
            getUserAddress: 'account/account-microservice/api/customer/address',
            getUserBankList: 'account/account-microservice/api/customer/banks',
            addNewBank: INVESTMENT_API_BASE_URL + '/api/customer/bank?handleError=true',
            getTransactions: INVESTMENT_API_BASE_URL + '/customer/transactions',
            getStatement: INVESTMENT_API_BASE_URL + '/getStatements',
            monthlyInvestmentInfo: INVESTMENT_API_BASE_URL + 'api/CustomerInvestmentObjective',
        }
    }
};
