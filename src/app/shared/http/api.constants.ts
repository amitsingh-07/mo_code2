const INVESTMENT_API_BASE_URL = 'invest/investment-microservice/api';
const INSURANCE_API_BASE_URL = 'insurance/insurance-needs-microservice/api';
const INSURANCE_RECOMMEND_API_BASE_URL = 'recommend/recomm-microservice/api';
const ARTICLE_API_BASE_URL = 'product/insurance-product/api/article';
const ABOUT_US_API_BASE_URL = 'product/insurance-product/api';
const ACCOUNT_API_BASE_URL = 'account/account-microservice/api';
const SUBSCRIPTION_API_BASE_URL = 'product/insurance-product/api';
const WILL_WRITING_API_BASE_URL = 'wills/wills-microservice/api/wills';
const NOTIFICATION_API_BASE_URL = 'notification/notify-microservice/api/notifications';

export let apiConstants = {
    endpoint: {
        authenticate: 'account/account-microservice/authenticate',
        login: 'login',
        logout: ACCOUNT_API_BASE_URL + '/logout',
        getProfileList: ACCOUNT_API_BASE_URL + '/getProfileTypeList',
        getProtectionTypesList: INSURANCE_API_BASE_URL + '/getProtectionTypesList',
        getLongTermCareList: INSURANCE_API_BASE_URL + '/getCareGiverList',
        getHospitalPlanList: INSURANCE_API_BASE_URL + '/getHospitalClassList',
        getRiskAssessmentQuestions: 'investment-microservice/RiskAssessment',
        getRecommendations: INSURANCE_RECOMMEND_API_BASE_URL + '/getRecommendations',
        updateProductEnquiry: ACCOUNT_API_BASE_URL + '/updateCustomerEnquiry',
        getMyInfoValues: 'sginfo/myinfo-microservice/api/getMyInfo',
        signUp: ACCOUNT_API_BASE_URL + '/signupV2',
        updateUserId: ACCOUNT_API_BASE_URL + '/updatePersonalDetails?handleError=true',
        verifyOTP: ACCOUNT_API_BASE_URL + '/verifyOTP',
        resendOTP: ACCOUNT_API_BASE_URL + '/resendOTP',
        verifyEmail: ACCOUNT_API_BASE_URL + '/verifyEmail',
        resetPassword: ACCOUNT_API_BASE_URL + '/resetPassword',
        forgotPassword: ACCOUNT_API_BASE_URL + '/forgotPassword',
        userProfileInfo: ACCOUNT_API_BASE_URL + '/getCustomerProfileDetails?handleError=true',
        editContactDeatails: ACCOUNT_API_BASE_URL + '/updateAddress',
        editPassword: ACCOUNT_API_BASE_URL + '/editPassword',
        editProfile: ACCOUNT_API_BASE_URL + '/customer/customerProfile',
        editEmployerAddress: ACCOUNT_API_BASE_URL + '/updateEmployment',
        emailValidityCheck: ACCOUNT_API_BASE_URL + '/emailValidityCheck',
        detailCustomerSummary: ACCOUNT_API_BASE_URL + '/getDetailedCustomerSummary',
        getCustomerInsuranceDetails: INSURANCE_RECOMMEND_API_BASE_URL + '/customer/getDetailedInsuranceSummary?handleError=true',
        resendEmailVerification: ACCOUNT_API_BASE_URL + '/resendEmailVerification',
        editMobileNumber: ACCOUNT_API_BASE_URL + '/update-mobileno',
        registerBundleEnquiry: ACCOUNT_API_BASE_URL + '/registerBundleEnquiry',
        enquiryByEmail: ACCOUNT_API_BASE_URL + '/enquiryByEmail',
        getSrsPopStatus: ACCOUNT_API_BASE_URL + '/getSrsPopStatus',
        setSrsPopStatus: ACCOUNT_API_BASE_URL + '/setSrsPopStatus',
        article: {
            getRecentArticles: ARTICLE_API_BASE_URL + '/getTop8Articles',
            getArticleCategory: ARTICLE_API_BASE_URL + '/getCountForAllTags',
            getArticleCategoryList: ARTICLE_API_BASE_URL + '/getArticlesByTagId',
            getArticleCategoryAllList: ARTICLE_API_BASE_URL + '/getAllArticles',
            getArticle: ARTICLE_API_BASE_URL + '/getArticleById',
            getRelatedArticle: ARTICLE_API_BASE_URL + '/getTop3ArticlesByTagId'
        },
        aboutus: {
            getCustomerReviews: ABOUT_US_API_BASE_URL + '/review/getAllReviews',
            sendContactUs: ACCOUNT_API_BASE_URL + '/contactus'
        },
        subscription: {
            base: SUBSCRIPTION_API_BASE_URL + '/mailinglist/subscribe'
        },
        portfolio: {
            setInvestmentObjective: INVESTMENT_API_BASE_URL + '/CustomerInvestmentObjective',
            setOneTimeInvestmentObjective: INVESTMENT_API_BASE_URL + '/portfolio/awaitingTransactions',
            getRiskAssessmentQuestions: INVESTMENT_API_BASE_URL + '/RiskAssessment',
            updateRiskAssessment: INVESTMENT_API_BASE_URL + '/RiskAssessment',
            getAllocationDetails: INVESTMENT_API_BASE_URL + '/portfolio/recommend'
        },
        investmentAccount: {
            nationalityCountrylist: INVESTMENT_API_BASE_URL + '/groupedCountryList',
            nationalitylist: INVESTMENT_API_BASE_URL + '/countrylist',
            lndustrylist: INVESTMENT_API_BASE_URL + '/industrylist',
            occupationlist: INVESTMENT_API_BASE_URL + '/occupationlist',
            allDropdownlist: INVESTMENT_API_BASE_URL + '/optionListCollection',
            updateInvestment: INVESTMENT_API_BASE_URL + '/UpdateCustomerInvestmentObjective',
            createInvestmentAccount: INVESTMENT_API_BASE_URL + '/createIFastAccount?handleError=true',
            verifyAML: ACCOUNT_API_BASE_URL + '/verifyAML?handleError=true',
            getFundTransferDetails: INVESTMENT_API_BASE_URL + '/getIFastBankDetails',
            buyPortfolio: INVESTMENT_API_BASE_URL + '/portfolio/buy?handleError=true',
            deletePortfolio: INVESTMENT_API_BASE_URL + '/customer/portfolios',
            monthlyInvestment: INVESTMENT_API_BASE_URL + '/customer/InvestmentObjective/monthlyInvestment?handleError=true',
            sellPortfolio: INVESTMENT_API_BASE_URL + '/portfolio/sell?handleError=true',
            saveNationality: INVESTMENT_API_BASE_URL + '/customer/setNationality',
            investmentoverview: INVESTMENT_API_BASE_URL + '/portfolio/holdings?handleError=true',
            porfolioDetails: INVESTMENT_API_BASE_URL + '/portfolios/detail',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false',
            uploadDocument: ACCOUNT_API_BASE_URL + '/saveDocuments',
            saveInvestmentAccount: ACCOUNT_API_BASE_URL + '/saveCustomerDetails'
        },
        investment: {
            getUserAddress: ACCOUNT_API_BASE_URL + '/customer/address',
            getUserBankList: ACCOUNT_API_BASE_URL + '/customer/banks',
            addNewBank: INVESTMENT_API_BASE_URL + '/customer/bank?handleError=true',
            getTransactions: INVESTMENT_API_BASE_URL + '/customer/transactions',
            getStatement: INVESTMENT_API_BASE_URL + '/getStatements',
            monthlyInvestmentInfo: INVESTMENT_API_BASE_URL + '/CustomerInvestmentObjective',
        },
        notification: {
            getRecentNotifications: NOTIFICATION_API_BASE_URL + '/recent',
            getAllNotifications: NOTIFICATION_API_BASE_URL + '/getNotification',
            updateNotifications: NOTIFICATION_API_BASE_URL + '/updateNotification'
        },
        willWriting: {
            verifyPromoCode: ACCOUNT_API_BASE_URL + '/promocode/validatePromoCode',
            createWill: WILL_WRITING_API_BASE_URL + '/createWillProfile?handleError=true',
            getWill: WILL_WRITING_API_BASE_URL + '/getWillProfile',
            updateWill: WILL_WRITING_API_BASE_URL + '/updateWillProfile?handleError=true',
            downloadWill: WILL_WRITING_API_BASE_URL + '/downloadWillDocument'
        }
    }
};
