import { map } from 'rxjs/operators';
export const INVESTMENT_API_BASE_URL = 'invest/investment-microservice/';
const ARTICLE_API_BASE_URL = 'product/insurance-product';
const ABOUT_US_API_BASE_URL = 'product/insurance-product';
const ACCOUNT_API_BASE_URL = 'account/account-microservice/api/';
const SUBSCRIPTION_API_BASE_URL = 'product/insurance-product';
const WILL_WRITING_API_BASE_URL = 'wills/wills-microservice/';
const NOTIFICATION_API_BASE_URL = 'notification/notify-microservice';
const COMPREHENSIVE_API_BASE_URL = 'recommend/recomm-microservice/api/customer/comprehensive/';
const FINANCE_API_BASE_URL = 'finance/finhealth/api/customer/comprehensive/';
const INSURANCE_API_BASE_URL = 'insurance/insurance-needs-microservice/api/customer/comprehensive/';
const COMPREHENSIVE_REPORT_API_BASE_URL = "comprehensive/comprehensive-microservice/api/"

export let apiConstants = {
    endpoint: {
        authenticate: 'account/account-microservice/authenticate',
        login: 'login',
        logout: 'account/account-microservice/api/logout',
        getProfileList: 'account/account-microservice/api/getProfileTypeList',
        getProtectionTypesList: 'insurance/insurance-needs-microservice/api/getProtectionTypesList',
        getLongTermCareList: 'insurance/insurance-needs-microservice/api/getCareGiverList',
        getHospitalPlanList: 'insurance/insurance-needs-microservice/api/getHospitalClassList',
        getRiskAssessmentQuestions: 'investment-microservice/RiskAssessment',
        getRecommendations: 'recommend/recomm-microservice/api/getRecommendations',
        updateProductEnquiry: 'account/account-microservice/api/updateCustomerEnquiry',
        getMyInfoValues: 'sginfo/myinfo-microservice/api/getMyInfo',
        signUp: 'account/account-microservice/api/signupV2',
        updateUserId: 'account/account-microservice/api/updatePersonalDetails?handleError=true',
        verifyOTP: 'account/account-microservice/api/verifyOTP',
        resendOTP: 'account/account-microservice/api/resendOTP',
        verifyEmail: 'account/account-microservice/api/verifyEmail',
        resetPassword: 'account/account-microservice/api/resetPassword',
        forgotPassword: 'account/account-microservice/api/forgotPassword',
        userProfileInfo: 'account/account-microservice/api/getCustomerProfileDetails?handleError=true',
        editContactDeatails: 'account/account-microservice/api/updateAddress',
        editPassword: 'account/account-microservice/api/editPassword',
        editProfile: 'account/account-microservice/api/customer/customerProfile',
        editEmployerAddress: 'account/account-microservice/api/updateEmployment',
        emailValidityCheck: 'account/account-microservice/api/emailValidityCheck',
        detailCustomerSummary: 'account/account-microservice/api/getDetailedCustomerSummary',
        getCustomerInsuranceDetails: 'recommend/recomm-microservice/api/customer/getCustomerInsuranceDetails',
        resendEmailVerification: 'account/account-microservice/api/resendEmailVerification',
        editMobileNumber: 'account/account-microservice/api/update-mobileno',
        sendWelcomeMail: 'account/account-microservice/api/sendWelcomeMail',
        article: {
            getRecentArticles: ARTICLE_API_BASE_URL + '/api/article/getTop8Articles',
            getArticleCategory: ARTICLE_API_BASE_URL + '/api/article/getCountForAllTags',
            getArticleCategoryList: ARTICLE_API_BASE_URL + '/api/article/getArticlesByTagId',
            getArticleCategoryAllList: ARTICLE_API_BASE_URL + '/api/article/getAllArticles',
            getArticle: ARTICLE_API_BASE_URL + '/api/article/getArticleById',
            getRelatedArticle: ARTICLE_API_BASE_URL + '/api/article/getTop3ArticlesByTagId'
        },
        aboutus: {
            getCustomerReviews: ABOUT_US_API_BASE_URL + '/api/review/getAllReviews',
            sendContactUs: ACCOUNT_API_BASE_URL + 'contactus'
        },
        subscription: {
            base: SUBSCRIPTION_API_BASE_URL + '/api/mailinglist/subscribe'
        },
        portfolio: {
            setInvestmentObjective: INVESTMENT_API_BASE_URL + 'api/CustomerInvestmentObjective',
            getRiskAssessmentQuestions: INVESTMENT_API_BASE_URL + 'RiskAssessment',
            updateRiskAssessment: INVESTMENT_API_BASE_URL + 'RiskAssessment',
            getAllocationDetails: INVESTMENT_API_BASE_URL + 'portfolio/recommend'
        },
        investmentAccount: {
            nationalityCountrylist: INVESTMENT_API_BASE_URL + 'groupedCountryList',
            nationalitylist: INVESTMENT_API_BASE_URL + 'countrylist',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false',
            lndustrylist: INVESTMENT_API_BASE_URL + 'industrylist',
            occupationlist: INVESTMENT_API_BASE_URL + 'occupationlist',
            allDropdownlist: INVESTMENT_API_BASE_URL + 'optionListCollection',
            uploadDocument: 'account/account-microservice/saveDocuments',
            saveInvestmentAccount: 'account/account-microservice/api/saveCustomerDetails',
            saveNationality: 'invest/investment-microservice/customer/setNationality',
            updateInvestment: INVESTMENT_API_BASE_URL + 'api/UpdateCustomerInvestmentObjective',
            createInvestmentAccount: INVESTMENT_API_BASE_URL + 'createIFastAccount?handleError=true',
            verifyAML: ACCOUNT_API_BASE_URL + '/api/verifyAML?handleError=true',
            getFundTransferDetails: INVESTMENT_API_BASE_URL + 'getIFastBankDetails',
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
            getStatement: INVESTMENT_API_BASE_URL + '/getStatements'
        },
        notification: {
            getRecentNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/recent',
            getAllNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/getNotification',
            updateNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/updateNotification'
        },
        willWriting: {
            verifyPromoCode: 'account/account-microservice/api/promocode/validatePromoCode',
            createWill: WILL_WRITING_API_BASE_URL + 'api/wills/createWillProfile?handleError=true',
            getWill: WILL_WRITING_API_BASE_URL + 'api/wills/getWillProfile',
            updateWill: WILL_WRITING_API_BASE_URL + 'api/wills/updateWillProfile?handleError=true',
            downloadWill: WILL_WRITING_API_BASE_URL + 'api/wills/downloadWillDocument'
        },
        comprehensive: {
            getComprehensiveSummary: COMPREHENSIVE_API_BASE_URL + 'getComprehensiveUserSummary',
            getPersonalDetails: ACCOUNT_API_BASE_URL + 'customer/comprehensive/getPersonalDetails',
            addPersonalDetails: ACCOUNT_API_BASE_URL + 'customer/comprehensive/addPersonalDetails',
            getDependents: ACCOUNT_API_BASE_URL + 'customer/comprehensive/getDependents',
            addDependents: ACCOUNT_API_BASE_URL + 'customer/comprehensive/saveDependents',
            getEndowmentPlan: ACCOUNT_API_BASE_URL + 'customer/comprehensive/getChildEndowmentPlans',
            saveEndowmentPlan: ACCOUNT_API_BASE_URL + 'customer/comprehensive/saveChildEndowmentPlans',
            getEarnings: COMPREHENSIVE_API_BASE_URL + 'getEarnings',
            saveEarnings: FINANCE_API_BASE_URL + 'saveEarnings',
            getSpendings: COMPREHENSIVE_API_BASE_URL + 'getExpenses',
            saveSpendings: FINANCE_API_BASE_URL + 'saveExpenses',
            saveDownOnLuck: FINANCE_API_BASE_URL + 'saveDownOnLuck',
            saveRegularSavings: FINANCE_API_BASE_URL + 'saveRegularSavings',
            saveInsurancePlan: INSURANCE_API_BASE_URL + 'saveInsurancePlanning',
            saveRetirementPlan: INSURANCE_API_BASE_URL + 'saveRetirementPlanning',
            saveAssets: FINANCE_API_BASE_URL + 'saveComprehensiveAssets',
            saveLiabilities: FINANCE_API_BASE_URL + 'saveComprehensiveLiabilities',
            getPromoCode: ACCOUNT_API_BASE_URL + 'customer/comprehensive/requestComprehensivePromoCode?category=COMPRE',
            validatePromoCode: ACCOUNT_API_BASE_URL + 'customer/comprehensive/validateComprehensivePromoCode',
            downloadComprehensiveReport: COMPREHENSIVE_REPORT_API_BASE_URL + 'downloadReportPdf',
            saveStepIndicator: COMPREHENSIVE_API_BASE_URL + 'saveComprehensiveStepCompletion',
            generateComprehensiveReport: COMPREHENSIVE_API_BASE_URL + 'generateComprehensiveReport',
            createReportRequest: COMPREHENSIVE_REPORT_API_BASE_URL + 'createReportRequest',
            getReport: COMPREHENSIVE_REPORT_API_BASE_URL + 'getReport',

        }
    }
};
