export const INVESTMENT_API_BASE_URL = 'invest/investment-microservice/';
const ARTICLE_API_BASE_URL = 'product/insurance-product';
const ABOUT_US_API_BASE_URL = 'product/insurance-product';
const ACCOUNT_API_BASE_URL = 'account-microservice';
const SUBSCRIPTION_API_BASE_URL = 'product/insurance-product';
const WILL_WRITING_API_BASE_URL = 'wills/wills-microservice/';
const NOTIFICATION_API_BASE_URL = 'notification/notify-microservice';
const COMPREHENSIVE_API_BASE_URL = 'account-microservice/api/customer/comprehensive/';

export let apiConstants = {
    endpoint: {
        authenticate: 'account-microservice/authenticate',
        login: 'login',
        logout: 'account-microservice/api/logout',
        getProfileList: 'account-microservice/api/getProfileTypeList',
        getProtectionTypesList: 'insurance/insurance-needs-microservice/api/getProtectionTypesList',
        getLongTermCareList: 'insurance/insurance-needs-microservice/api/getCareGiverList',
        getHospitalPlanList: 'insurance/insurance-needs-microservice/api/getHospitalClassList',
        getRiskAssessmentQuestions: 'investment-microservice/RiskAssessment',
        getRecommendations: 'recommend/recomm-microservice/api/getRecommendations',
        createEnquiry: 'recommend/recomm-microservice/api/createEnquiry',
        updateProductEnquiry: 'account-microservice/api/updateCustomerEnquiry',
        getMyInfoValues: 'sginfo/myinfo-microservice/api/getMyInfo',
        signUp: 'account-microservice/api/signup',
        updateUserId: 'account-microservice/api/updatePersonalDetails?handleError=true',
        verifyOTP: 'account-microservice/api/verifyOTP',
        resendOTP: 'account-microservice/api/resendOTP',
        setPassword: 'account-microservice/api/setPassword',
        verifyEmail: 'account-microservice/api/verifyEmail',
        resetPassword: 'account-microservice/api/resetPassword',
        forgotPassword: 'account-microservice/api/forgotPassword',
        userProfileInfo: 'account-microservice/api/getCustomerProfileDetails',
        editContactDeatails: 'account-microservice/api/updateAddress',
        editPassword: 'account-microservice/api/editPassword',
        editProfile: 'account-microservice/api/customer/customerProfile',
        editEmployerAddress: 'account-microservice/api/updateEmployment',
        emailValidityCheck: 'account-microservice/api/emailValidityCheck',
        detailCustomerSummary: 'account-microservice/api/getDetailedCustomerSummary',
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
            sendContactUs: ACCOUNT_API_BASE_URL + '/api/contactus'
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
            uploadDocument: 'account-microservice/saveDocuments',
            saveInvestmentAccount: 'account-microservice/api/saveCustomerDetails',
            saveNationality: 'invest/investment-microservice/customer/setNationality',
            updateInvestment: INVESTMENT_API_BASE_URL + 'api/UpdateCustomerInvestmentObjective',
            createInvestmentAccount: INVESTMENT_API_BASE_URL + 'createIFastAccount',
            verifyAML: ACCOUNT_API_BASE_URL + '/api/verifyAML?handleError=true',
            getFundTransferDetails: INVESTMENT_API_BASE_URL + 'getIFastBankDetails',
            buyPortfolio: INVESTMENT_API_BASE_URL + 'portfolio/buy',
            deletePortfolio: INVESTMENT_API_BASE_URL + 'customer/portfolios',
            monthlyInvestment: INVESTMENT_API_BASE_URL + 'customer/InvestmentObjective/monthlyInvestment',
            sellPortfolio: INVESTMENT_API_BASE_URL + 'portfolio/sell',
            investmentoverview: 'invest/investment-microservice/portfolio/holdings',
            porfolioDetails: 'invest/investment-microservice/portfolios/detail'
        },
        investment: {
            getUserAddress: 'account-microservice/api/customer/address',
            getUserBankList: 'account-microservice/api/customer/banks',
            addNewBank: 'account-microservice/api/customer/bank',
            getTransactions: INVESTMENT_API_BASE_URL + '/portfolio/transactions'
        },
        notification: {
            getRecentNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/recent',
            getAllNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/getNotification',
            updateNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/updateNotification'
        },
        willWriting: {
            verifyPromoCode: 'account-microservice/api/promocode/validatePromoCode',
            createWill: WILL_WRITING_API_BASE_URL + 'api/wills/createWillProfile?handleError=true',
            getWill: WILL_WRITING_API_BASE_URL + 'api/wills/getWillProfile',
            updateWill: WILL_WRITING_API_BASE_URL + 'api/wills/updateWillProfile?handleError=true',
            downloadWill: WILL_WRITING_API_BASE_URL + 'api/wills/downloadWillDocument'
        },
        comprehensive: {
            getComprehensiveSummary: 'account-microservice/api/getComprehensiveSummary',
            getPersonalDetails: COMPREHENSIVE_API_BASE_URL + 'getPersonalDetails',
            addPersonalDetails: COMPREHENSIVE_API_BASE_URL + 'addPersonalDetails',
            getDependents: COMPREHENSIVE_API_BASE_URL + 'getDependents',
            addDependents: COMPREHENSIVE_API_BASE_URL + 'saveDependents',
            getEarnings: COMPREHENSIVE_API_BASE_URL + 'getEarnings',
            saveEarnings: COMPREHENSIVE_API_BASE_URL + 'saveEarnings',
            getSpendings: COMPREHENSIVE_API_BASE_URL + 'getExpenses',
            saveSpendings: COMPREHENSIVE_API_BASE_URL + 'saveExpenses'
        }
    }
};
