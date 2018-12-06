export const INVESTMENT_API_BASE_URL = 'invest/investment-microservice/';
const ARTICLE_API_BASE_URL = 'product/insurance-product';
const ABOUT_US_API_BASE_URL = 'product/insurance-product';
const CONTACT_US_API_BASE_URL = 'account/account-microservice';
const SUBSCRIPTION_API_BASE_URL = 'product/insurance-product';
const WILL_WRITING_API_BASE_URL = 'wills/wills-microservice/';
const NOTIFICATION_API_BASE_URL = 'notification/notify-microservice';

export let apiConstants = {
    endpoint: {
        authenticate: 'account/account-microservice/authenticate',
        login: 'login',
        getProfileList: 'account/account-microservice/api/getProfileTypeList',
        getProtectionTypesList: 'insurance/insurance-needs-microservice/api/getProtectionTypesList',
        getLongTermCareList: 'insurance/insurance-needs-microservice/api/getCareGiverList',
        getHospitalPlanList: 'insurance/insurance-needs-microservice/api/getHospitalClassList',
        getRiskAssessmentQuestions: 'investment-microservice/RiskAssessment',
        getRecommendations: 'recommend/recomm-microservice/api/getRecommendations',
        updateProductEnquiry: 'account/account-microservice/api/updateCustomerEnquiry',
        //getMyInfoValues: 'sginfo/myinfo-microservice/api/getMyInfo',
        getMyInfoValues: 'sginfo/myinfo-microservice/api/getMyInfoMock',
        signUp: 'account/account-microservice/api/signup',
        updateUserId: 'account/account-microservice/api/updatePersonalDetails?handleError=true',
        verifyOTP: 'account/account-microservice/api/verifyOTP',
        resendOTP: 'account/account-microservice/api/resendOTP',
        setPassword: 'account/account-microservice/api/setPassword',
        verifyEmail: 'account/account-microservice/api/verifyEmail',
        resetPassword: 'account/account-microservice/api/resetPassword',
        forgotPassword: 'account/account-microservice/api/forgotPassword',
        userProfileInfo: 'account/account-microservice/api/getCustomerProfileDetails',
        editContactDeatails: 'account/account-microservice/api/updateAddress',
        editPassword: 'account/account-microservice/api/editPassword',
        editProfile: 'account/account-microservice/api/customer/customerProfile',
        editEmployerAddress: 'account/account-microservice/api/updateEmployment',
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
            sendContactUs: CONTACT_US_API_BASE_URL + '/api/contactus'
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
            //uploadDocument: 'account/account-microservice/saveInvestmentDetails',
            uploadDocument: 'account/account-microservice/saveDocuments',
            //saveInvestmentAccount: 'account/account-microservice/saveInvestmentAccountDetails',
            saveInvestmentAccount: 'account/account-microservice/api/saveCustomerDetails',
            updateInvestment: INVESTMENT_API_BASE_URL + 'api/UpdateCustomerInvestmentObjective',
            createInvestmentAccount: INVESTMENT_API_BASE_URL + 'createIFastAccount',
            getFundTransferDetails: INVESTMENT_API_BASE_URL + 'getIFastBankDetails',
            buyPortfolio: INVESTMENT_API_BASE_URL + 'portfolio/buy',
            sellPortfolio: INVESTMENT_API_BASE_URL + 'portfolio/sell',
            investmentoverview: 'invest/investment-microservice/portfolio/holdings'
        },
        investment: {
            getUserAddress: 'account/account-microservice/api/customer/address',
            getUserBankList: 'account/account-microservice/api/customer/banks',
            addNewBank: 'account/account-microservice/api/customer/bank',
            getTransactions: INVESTMENT_API_BASE_URL + '/portfolio/transactions'
        },
        notification: {
            getRecentNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/recent'
        },
        willWriting: {
            verifyPromoCode: 'account/account-microservice/api/promocode/validatePromoCode',
            createWill: WILL_WRITING_API_BASE_URL + 'api/wills/createWillProfile?handleError=true',
            getWill: WILL_WRITING_API_BASE_URL + 'api/wills/getWillProfile',
            updateWill: WILL_WRITING_API_BASE_URL + 'api/wills/updateWillProfile?handleError=true',
            downloadWill: WILL_WRITING_API_BASE_URL + 'api/wills/downloadWillDocument'
        }
    }
};
