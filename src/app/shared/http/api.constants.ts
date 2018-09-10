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
        signUp: 'account/account-microservice/api/signup',
        portfolio: {
            setInvestmentObjective: 'invest/api/CustomerInvestmentObjective',
            getRiskAssessmentQuestions: 'invest/investment-microservice/RiskAssessment',
            updateRiskAssessment: 'invest/RiskAssessment',
            getAllocationDetails: 'invest/portfolio/recommend'
        }
    }
};
