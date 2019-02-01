export let INVESTMENT_ACCOUNT_CONFIG = {
  INVESTMENT_ACCOUNT_GUARD_STATUS: [
    'PORTFOLIO_PURCHASED',
    'ACCOUNT_CREATED',
    'CDD_CHECK_PENDING',
    'CDD_CHECK_FAILED',
    'EDD_CHECK_PENDING',
    'EDD_CHECK_FAILED',
    'SUSPENDED_ACCOUNT'
  ],
  SINGAPORE_NATIONALITY_CODE: 'SG',
  SINGAPORE_COUNTRY_CODE: 'SG',
  OTHERS: 'Others',
  personal_info: {
    min_age: 18,
    min_passport_expiry: 6 // in months
  },
  residential_info: {
    isMailingAddressSame: true
  },
  employmentDetails: {},
  upload_documents: {
    default_thumb: 'cam-icon.svg',
    max_file_size: 10, // in MB
    file_types: ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'PDF']
  },
  confirm_portfolio: {
    fees: {
      moneyowl_fees: '0.65%',
      platform_fees: '0.15%',
      fund_expense_ratio: '0.2% to 0.4%',
      total: '1% to 1.2%'
    }
  },
  status: {
    aml_pending: 'PENDING',
    aml_cleared: 'CLEARED',
    aml_accepted: 'ACCEPTED',
    aml_rejected: 'REJECTED',
    aml_failed: 'FAILED',
    ddc_submitted: 'ddc_submitted',
    account_creation_pending: 'account_creation_pending',
    documents_pending: 'documents_pending'
  },
  ADDITIONAL_DECLARATION_TWO: {
    SAVING: 'Saving',
    GIFT_INHERITANCE: 'Gift/Inheritance',
    INVESTMENT_EARNINGS: 'Investment Earnings',
    BUSINESS_PROFITS: 'Business Profits',
    SALE_OF_REAL_ESTATE: 'Sale of Real Estate',
    SALARY: 'Salary'
  },
  ADDITIONAL_DECLARATION_ONE: {
    OTHERS: 'Others'
  },
  EMPLOYEMENT_DETAILS: {
    SELE_EMPLOYED: 'Self Employed',
    EMPLOYED: 'Employed'
  }
};
