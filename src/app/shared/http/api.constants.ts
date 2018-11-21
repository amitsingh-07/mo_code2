export const INVESTMENT_API_BASE_URL = 'invest/investment-microservice/';
const ARTICLE_API_BASE_URL = 'product/insurance-product';
const ABOUT_US_API_BASE_URL = 'product/insurance-product';
const CONTACT_US_API_BASE_URL = 'account-microservice';
const SUBSCRIPTION_API_BASE_URL = 'product/insurance-product';
const WILL_WRITING_API_BASE_URL = 'wills/wills-microservice/';

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
        updateUserId: 'account/account-microservice/api/update?handleError=true',
        verifyOTP: 'account/account-microservice/api/verifyOTP',
        resendOTP: 'account/account-microservice/api/resendOTP',
        setPassword: 'account/account-microservice/api/setPassword',
        verifyEmail: 'account/account-microservice/api/verifyEmail',
        resetPassword: 'account/account-microservice/api/resetPassword',
        forgotPassword: 'account/account-microservice/api/forgotPassword',
        userProfileInfo: 'account/account-microservice/api/getProfileSummary',
        editContactDeatails: 'account/account-microservice/api/updateAddress',
        editPassword: 'account/account-microservice/api/editPassword',
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
            getFundTransferDetails: INVESTMENT_API_BASE_URL + 'getIFastBankDetails'
        },
        willWriting: {
            verifyPromoCode: 'account/account-microservice/api/promocode/validatePromoCode',
            createWill: WILL_WRITING_API_BASE_URL + 'api/wills/createWillProfile',
            getWill: WILL_WRITING_API_BASE_URL + 'api/wills/getWillProfile',
            updateWill: WILL_WRITING_API_BASE_URL + 'api/wills/updateWillProfile',
            downloadWill: WILL_WRITING_API_BASE_URL + 'api/wills/downloadWillDocument'
        }
    }
};
