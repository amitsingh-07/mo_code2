const PORTFOLIO_API_BASE_URL = 'invest/investment-microservice/';
const ARTICLE_API_BASE_URL = 'insuranceproduct-microservice';
const ABOUT_US_API_BASE_URL = 'insuranceproduct-microservice';
const CONTACT_US_API_BASE_URL = 'account-microservice';
const SUBSCRIPTION_API_BASE_URL = 'insuranceproduct-microservice';

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
        getMyInfoValues: 'sginfo/myinfo-microservice/api/getMyInfo',
        signUp: 'account/account-microservice/api/signup',
        verifyOTP: 'account/account-microservice/api/verifyOTP',
        resendOTP: 'account/account-microservice/api/resendOTP',
        setPassword: 'account/account-microservice/api/setPassword',
        verifyEmail: 'account/account-microservice/api/verifyEmail',
        resetPassword: 'account/account-microservice/api/resetPassword',
        forgotPassword: 'account/account-microservice/api/forgotPassword',
        userProfileInfo: 'account/account-microservice/api/getProfileSummary',
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
            setInvestmentObjective: PORTFOLIO_API_BASE_URL + 'api/CustomerInvestmentObjective',
            getRiskAssessmentQuestions: PORTFOLIO_API_BASE_URL + 'RiskAssessment',
            updateRiskAssessment: PORTFOLIO_API_BASE_URL + 'RiskAssessment',
            getAllocationDetails: PORTFOLIO_API_BASE_URL + 'portfolio/recommend'
        },
        investmentAccount: {
            nationalitylist: 'invest/investment-microservice/countrylist',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false',
            lndustrylist: 'invest/investment-microservice/industrylist',
            occupationlist: 'invest/investment-microservice/occupationlist',
            allDropdownlist: 'invest/investment-microservice/optionListCollection',
}
    }
};
