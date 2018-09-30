export interface IApiConfig {
    endpoint: {
        authenticate: string,
        login: string,
        getProfileList: string,
        getProtectionTypesList: string,
        getLongTermCareList: string,
        getHospitalPlanList: string,
        getRiskAssessmentQuestions: string,
        getRecommendations: string,
        getMyInfoValues: string,
        signUp: string,
        verifyOTP: string,
        resendOTP: string,
        setPassword: string,
        verifyEmail: string,
        resetPassword: string,
        forgotPassword: string,
        portfolio: {
            setInvestmentObjective: string,
            getRiskAssessmentQuestions: string,
            updateRiskAssessment: string,
            getAllocationDetails: string
        },
        investmentAccount: {
            nationalitylist: string,
            getAddressByPincode: string
        }
    };
}
