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
        portfolio: {
            setInvestmentObjective: 'invest/api/CustomerInvestmentObjective',
            getRiskAssessmentQuestions: 'invest/investment-microservice/RiskAssessment',
            updateRiskAssessment: 'invest/RiskAssessment',
            getAllocationDetails: 'invest/portfolio/recommend'
        },
        investmentAccount: {
            nationalitylist: 'invest/countrylist',
            getAddressByPincode: 'https://gothere.sg/maps/geo?output=json&client=&sensor=false'
        }
    }
};
