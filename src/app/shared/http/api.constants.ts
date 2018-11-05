const PORTFOLIO_API_BASE_URL = 'invest/investment-microservice/';

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
        getMyInfoValues: 'myinfo-microservice/api/getMyInfo',
        signUp: 'account/account-microservice/api/signup',
        verifyOTP: 'account/account-microservice/api/verifyOTP',
        resendOTP: 'account/account-microservice/api/resendOTP',
        setPassword: 'account/account-microservice/api/setPassword',
        verifyEmail: 'account/account-microservice/api/verifyEmail',
        resetPassword: 'account/account-microservice/api/resetPassword',
        forgotPassword: 'account/account-microservice/api/forgotPassword',
        userProfileInfo: 'account/account-microservice/api/getProfileSummary',
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
            setInvestmentObjective: PORTFOLIO_API_BASE_URL + 'api/CustomerInvestmentObjective',
            getRiskAssessmentQuestions: PORTFOLIO_API_BASE_URL + 'RiskAssessment',
            updateRiskAssessment: PORTFOLIO_API_BASE_URL + 'RiskAssessment',
            getAllocationDetails: PORTFOLIO_API_BASE_URL + 'portfolio/recommend'
        },
        investmentAccount: {
            nationalityCountrylist: 'invest/investment-microservice/groupedCountryList',
            nationalitylist: 'invest/investment-microservice/countrylist',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false',
            lndustrylist: 'invest/investment-microservice/industrylist',
            occupationlist: 'invest/investment-microservice/occupationlist',
            allDropdownlist: 'invest/investment-microservice/optionListCollection',
        },
        getPromoCode: '',
        verifyPromoCode: 'account/account-microservice/api/promocode/validatePromoCode'
    }
};
