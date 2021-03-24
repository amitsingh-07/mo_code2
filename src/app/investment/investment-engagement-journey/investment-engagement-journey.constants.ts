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
  SELECT_POROFOLIO_TYPE :{
    INVEST_PORTFOLIO:'investPortfolio',
    WISESAVER_PORTFOLIO:'wiseSaverPortfolio',
    WISEINCOME_PORTFOLIO:'wiseIncomePortfolio',
    INVESTMENT:'Investment',
    WISESAVER:'Wisesaver',
    WISEINCOME:'WiseIncome'
  },
  PROSPECTUS_FILE:{
    INVESTMENT: 'prospectus_investment.pdf',
    WISESAVER: 'prospectus_wise_saver.pdf',
    WISEINCOME: 'prospectus_wise_income.pdf'      
                },
  PAYOUT_FUNDLIST: {
    GROW: 'Grow & invest payout_Cash',
    FOUR_PERCENT: '4.5% p.a. income payout_Cash',
    EIGHT_PERCENT: '8% p.a. income payout_Cash',
  },
  DEFAULT_PAYOUT: {
    GROW : '0%'
  }
};
