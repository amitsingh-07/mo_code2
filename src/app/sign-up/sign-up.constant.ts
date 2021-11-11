export let SIGN_UP_CONFIG = {
    MY_INFO_ATTRIBUTES: [
        'name',
        'email',
        'mobileno',
        'dob',
        'sex'   
      ],
    SHOW_BANK_DETAILS: [
        'PORTFOLIO_PURCHASED',
        'ACCOUNT_CREATED',
        'ACCOUNT_FUNDED'
      ],
    NOTIFICATION_MAX_LIMIT: 99,
    ACCOUNT_NUM_MAX_LIMIT: 100,
    RECENT_NOTIFICATION_COUNT: 3,
    NOTIFICATION: {
        READ_PAYLOAD_KEY: 'READ',
        DELETE_PAYLOAD_KEY: 'DELETE'
    },
    INVESTMENT: {
        START_INVESTING: 'START_INVESTING',
        PORTFOLIO_PURCHASED: 'PORTFOLIO_PURCHASED',
        ACCOUNT_CREATED: 'ACCOUNT_CREATED',
        INVESTMENT_ACCOUNT_DETAILS_SAVED: 'INVESTMENT_ACCOUNT_DETAILS_SAVED',
        ACCOUNT_CREATION_FAILED: 'ACCOUNT_CREATION_FAILED',
        CDD_CHECK_PENDING: 'CDD_CHECK_PENDING',
        RECOMMENDED: 'RECOMMENDED',
        PROPOSED: 'PROPOSED',
        ACCEPTED_NATIONALITY: 'ACCEPTED_NATIONALITY',
        CDD_CHECK_FAILED: 'CDD_CHECK_FAILED',
        BLOCKED_NATIONALITY: 'BLOCKED_NATIONALITY',
        EDD_CHECK_PENDING: 'EDD_CHECK_PENDING',
        EDD_CHECK_FAILED: 'EDD_CHECK_FAILED',
        ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
        DOCUMENTS_UPLOADED: 'DOCUMENTS_UPLOADED',
        EDD_CHECK_CLEARED: 'EDD_CHECK_CLEARED',
        ACCOUNT_FUNDED: 'ACCOUNT_FUNDED',
        PORTFOLIO_CONFIRMED: 'PORTFOLIO_CONFIRMED'
    },
    BANK_KEYS: { /* ACCOUNT NUMBER LENGTH FOR LIST OF BANK CODES */
        BANK_OF_CHINA: 'Bank of China',
        STANDARD_CHARTED_BANK: 'Standard Chartered Bank',
        DBS: 'DBS',
        CITIBANK: 'Citibank',
        MAYBANK: 'MayBank',
        OCBC: 'OCBC',
        RHB_BANK: 'RHB Bank',
        UOB: 'UOB',
        ANZ_BANK: 'ANZ Bank',
        CIMB: 'CIMB',
        HSBC: 'HSBC',
        POSB: 'POSB'
    },
    LOGIN: {
        FINLIT_LOGIN: true
    },
      SIGN_UP : {
      EMAIL:"email"
    },
    SINGPASSLINKSTATUS:{
        LINKED: "LINKED",
        NOT_LINKED: "NOT_LINKED", 
        DISABLED: "DISABLED"
    },
    CREATE_ACCOUNT_STATIC :{
      SUCCESS :"SUCCESS",
      CANCELLED:"CANCELLED"
    },
    SINGPASS :"SINGPASS",
    VERIFY_MOBILE:{
      TWO_FA:"2FA",
      UPDATE_CONTACT:"Update Contact",
      SIGN_UP:"Signup"
    },
    SOCIAL_REFERRER_LINK: {
      FACEBOOK: "https://www.facebook.com/sharer.php?quote=",
      TELEGRAM: "https://telegram.me/share/url?url=",
      WHATSAPP: "https://api.whatsapp.com/send?text=",
      MAILTO: "mailto:?body=",
      SIGN_UP_URL: "/app/accounts/sign-up?referral_code="
    },
    REFEREE_REWARDS: {
      CFP: "CFP",
      INVESTMENT: "INVESTMENT",
      INSURANCE: "INSURANCE",
      NOT_ISSUED: "NOT_ISSUED",
      ISSUED: "ISSUED",
      NOT_APPLICABLE: "NOT_APPLICABLE",
      REFER_A_FRIEND: "refer-a-friend",
      DASHBOARD: "dashboard",
      GRAB_FOOD: "GrabFood"
    },
    AUTH_2FA_ENABLED: true,
    ROLE_2FA: 'ROLE_2FA',
    LOGIN_TYPE_2FA: 'MANUAL',
    ACCOUNT_CREATION: {
      DOB:{
        DATE_PICKER_MIN_YEAR: 0,
        DATE_PICKER_MAX_YEAR: 100
      }
    },
    EDIT_ROUTE_TYPE: {
      EMAIL: 'email',
      MOBILE: 'mobile'
    },
    SINGAPORE_COUNTRY_CODE: '+65'
};
