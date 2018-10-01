const PORTFOLIO_API_BASE_URL = 'invest/investment-microservice/';

export let apiConstants = {
    endpoint : {
        authenticate: 'account/account-microservice/authenticate',
        login: 'login',
        getProfileList: 'account/account-microservice/api/getProfileTypeList',
        getProtectionTypesList: 'insurance/insurance-needs-microservice/api/getProtectionTypesList',
        getLongTermCareList: 'insurance/insurance-needs-microservice/api/getCareGiverList',
        getHospitalPlanList: 'insurance/insurance-needs-microservice/api/getHospitalClassList',
        getRiskAssessmentQuestions: 'investment-microservice/RiskAssessment',
        getRecommendations: 'recommend/recomm-microservice/api/getRecommendations',
        getMyInfoValues: 'account/account-microservice/api/getMyInfoValues',
        signUp: 'account/account-microservice/api/signup',
        verifyOTP: 'account/account-microservice/api/verifyOTP',
        resendOTP: 'account/account-microservice/api/resendOTP',
        setPassword: 'account/account-microservice/api/setPassword',
        verifyEmail: 'account/account-microservice/api/verifyEmail',
        resetPassword: 'account/account-microservice/api/resetPassword',
        forgotPassword: 'account/account-microservice/api/forgotPassword',
        userProfileInfo: 'account/account-microservice/api/getProfileSummary',
        portfolio: {
            setInvestmentObjective: PORTFOLIO_API_BASE_URL + 'api/CustomerInvestmentObjective',
            getRiskAssessmentQuestions: PORTFOLIO_API_BASE_URL + 'RiskAssessment',
            updateRiskAssessment: PORTFOLIO_API_BASE_URL + 'RiskAssessment',
            getAllocationDetails: PORTFOLIO_API_BASE_URL + 'portfolio/recommend'
        },
        investmentAccount: {
            nationalitylist: 'invest/investment-microservice/countrylist',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false'
        }
    }
};
