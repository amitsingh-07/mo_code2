export let PORTFOLIO_CONFIG = {
  personal_info: {
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
        max: 99,
        content: 'PERSONAL_INFO.RANGE_14_DESC'
      }
    ],
    min_investment_period: 3 // years
  },
  my_financials: {
    sufficient_emergency_fund: 'yes'
  },
  risk_assessment: {
    chart_legend: {
      1: 'vhfvhr',
      2: 'hfhr',
      3: 'mfmr',
      4: 'lflr'
    }
  }
};
