const ARTICLE_API_BASE_URL = 'product/insurance-product';
const ABOUT_US_API_BASE_URL = 'product/insurance-product';
const ACCOUNT_API_BASE_URL = 'account/account-microservice';
const SUBSCRIPTION_API_BASE_URL = 'product/insurance-product';
const WILL_WRITING_API_BASE_URL = 'wills/wills-microservice/';
const NOTIFICATION_API_BASE_URL = 'notification/notify-microservice';

export let apiConstants = {
    endpoint: {
        authenticate: 'account/account-microservice/authenticate',
        login: 'login',
        logout: 'account/account-microservice/api/logout',
        getProfileList: 'account/account-microservice/api/getProfileTypeList',
        getProtectionTypesList: 'insurance/insurance-needs-microservice/api/getProtectionTypesList',
        getLongTermCareList: 'insurance/insurance-needs-microservice/api/getCareGiverList',
        getHospitalPlanList: 'insurance/insurance-needs-microservice/api/getHospitalClassList',
        getRiskAssessmentQuestions: 'investment-microservice/RiskAssessment',
        getRecommendations: 'recommend/recomm-microservice/api/getRecommendations',
        updateProductEnquiry: 'account/account-microservice/api/updateCustomerEnquiry',
        getMyInfoValues: 'sginfo/myinfo-microservice/api/getMyInfo',
        signUp: 'account/account-microservice/api/signupV2',
        updateUserId: 'account/account-microservice/api/updatePersonalDetails?handleError=true',
        verifyOTP: 'account/account-microservice/api/verifyOTP',
        resendOTP: 'account/account-microservice/api/resendOTP',
        verifyEmail: 'account/account-microservice/api/verifyEmail',
        resetPassword: 'account/account-microservice/api/resetPassword',
        forgotPassword: 'account/account-microservice/api/forgotPassword',
        userProfileInfo: 'account/account-microservice/api/getCustomerProfileDetails?handleError=true',
        editContactDeatails: 'account/account-microservice/api/updateAddress',
        editPassword: 'account/account-microservice/api/editPassword',
        editProfile: 'account/account-microservice/api/customer/customerProfile',
        editEmployerAddress: 'account/account-microservice/api/updateEmployment',
        emailValidityCheck: 'account/account-microservice/api/emailValidityCheck',
        detailCustomerSummary: 'account/account-microservice/api/getDetailedCustomerSummary',
        getCustomerInsuranceDetails: 'recommend/recomm-microservice/api/customer/getDetailedInsuranceSummary',
        resendEmailVerification: 'account/account-microservice/api/resendEmailVerification',
        editMobileNumber: 'account/account-microservice/api/update-mobileno',
        registerBundleEnquiry: 'account/account-microservice/api/registerBundleEnquiry',
        enquiryByEmail: 'account/account-microservice/api/enquiryByEmail',
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
            sendContactUs: ACCOUNT_API_BASE_URL + '/api/contactus'
        },
        subscription: {
            base: SUBSCRIPTION_API_BASE_URL + '/api/mailinglist/subscribe'
        },
        notification: {
            getRecentNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/recent',
            getAllNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/getNotification',
            updateNotifications: NOTIFICATION_API_BASE_URL + '/api/notifications/updateNotification'
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
