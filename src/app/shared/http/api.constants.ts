export const INVESTMENT_API_BASE_URL = 'invest/investment-microservice/';

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
            getRecentArticles: 'article/article-microservice/api/getRecentArticles',
            getArticleCategoryList: 'article/article-microservice/api/getArticleCategoryList',
            getArticleCategory: 'article/article-micorservice/api/getArticleCategory',
            getArticle: 'article/article-microservice/api/getArticle'
        },
        aboutus: {
            getCustomerReviews: 'aboutus/aboutus-microservice/api/getCustomerReviews',
            sendContactUs: 'aboutus/aboutus-microservice/api/sendContactUs'
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
            uploadDocument: 'account/account-microservice/saveInvestmentDetails',
            saveInvestmentAccount: 'account/account-microservice/saveInvestmentAccountDetails',
            updateInvestment: INVESTMENT_API_BASE_URL + 'api/UpdateCustomerInvestmentObjective',
            createInvestmentAccount: 'account/account-microservice/createIFastAccount',
            getFundTransferDetails: INVESTMENT_API_BASE_URL + 'getIFastBankDetails'
        },
        getPromoCode: '',
        verifyPromoCode: 'account/account-microservice/api/promocode/validatePromoCode'
    }
};
