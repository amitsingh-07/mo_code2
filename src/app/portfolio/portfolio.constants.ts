export let PORTFOLIO_CONFIG = {
  personal_info: {
    max_investment_years: 40,
    range_with_desc: [
      {
        min: 0,
        max: 3,
        content: 'PERSONAL_INFO.RANGE_1_3_DESC'
      },
      {
        min: 3,
        max: 7,
        content: 'PERSONAL_INFO.RANGE_3_7_DESC'
      },
      {
        min: 7,
        max: 14,
        content: 'PERSONAL_INFO.RANGE_7_14_DESC'
      },
      {
        min: 14,
        max: 40,
        content: 'PERSONAL_INFO.RANGE_14_DESC'
      }
    ],
    min_investment_period: 3 // years
  },
  my_financials: {
    sufficient_emergency_fund: 'yes',
    min_monthly_amount: 50,
    min_initial_amount: 100
  },
  risk_profile: {
    should_not_invest_id: 6
  },
  risk_assessment: {
    special_question_order: 4
  }
};
