export let INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS = {
  personal_info: {
    max_investment_years: 40,
    min_investment_period: 3 // years
  },
  my_financials: {
    sufficient_emergency_fund: 'yes'
  },
  risk_profile: {
    should_not_invest_id: 6
  },
  risk_assessment: {
    special_question_order: 4
  },
  SELECT_POROFOLIO_TYPE: {
    INVEST_PORTFOLIO: 'investPortfolio',
    WISESAVER_PORTFOLIO: 'wiseSaverPortfolio',
    WISEINCOME_PORTFOLIO: 'wiseIncomePortfolio',
    INVESTMENT: 'Investment',
    WISESAVER: 'Wisesaver',
    WISEINCOME: 'WiseIncome',
    CPF_PORTFOLIO: 'CPF'
  },
  FUND_DOC_PATH: 'assets/docs/portfolio/fund/',
  PROSPECTUS_FILE: {
    INVESTMENT: 'Product Prospectus.pdf',
    WISESAVER: 'prospectus_wise_saver.pdf',
    WISEINCOME: 'prospectus_wise_income.pdf',
    CPF_LGI: 'Prospectus_CPF_LGI fund.pdf',
    CPF_UOB: 'Prospectus_CPF_UOB fund.pdf'
  },
  PAYOUT_FUNDLIST: {
    GROW: 'Grow & invest payout_Cash',
    FOUR_PERCENT: '4.5%* p.a. income payout_Cash',
    EIGHT_PERCENT: '8% p.a. income payout_Cash',
  },
  DEFAULT_PAYOUT: {
    GROW: '0%'
  },
  PORTFOLIO_TYPE: {
    JOINT_ACCOUNT: 'joint-account',
    PERSONAL_ACCOUNT: 'personal-account',
    JOINT_ACCOUNT_ID: '2',
    PERSONAL_ACCOUNT_ID: '1'
  },
  NAVIGATION_TYPE: {
    EDIT: "edit",
    CREATE: "create"
  },
  UPLOAD_TYPE: {
    NRIC: 'NRIC',
    BIRTH_CERTIFICATE: 'Birth Certificate',
    PASSPORT: 'Passport'
  },
  UPLOAD_SINGAPOREAN_DOC_LIST: [{ "name": "NRIC", "value": "NRIC" }, { "name": "Birth Certificate", "value": "Birth Certificate" }],
  UPLOAD_NON_SINGAPOREAN_DOC_LIST: [{ "name": "Passport", "value": "Passport" }],
  NATIONALITY: {
    COUNTRY_NAME: "SINGAPOREAN",
    COUNTRY_CODE: "SG"
  },
  riskProfileIcon: {
    "balanced-cpfis-icon": 'assets/images/balanced-cpfis-icon.svg',
    "conservative": 'assets/images/conservative.svg',
    "moderate": 'assets/images/moderate.svg',
    "balanced": 'assets/images/balanced.svg',
    "growth": 'assets/images/growth.svg',
    "norisk": 'assets/images/nosutable.svg',
    "equity": 'assets/images/equity.svg',
    "no recommended portfolio": 'assets/images/nosutable.svg'
  }
};
