export let INVESTMENT_ACCOUNT_CONSTANTS = {
  MY_INFO_ATTRIBUTES: [
    'nationality',
    'name',
    'birthcountry',
    'passportnumber',
    'passportexpirydate',
    'dob',
    'sex',
    'regadd',
    'mailadd',
    'employment',
    'occupation'
  ],
  INVESTMENT_ACCOUNT_GUARD_STATUS: [
    'PORTFOLIO_PURCHASED',
    'ACCOUNT_CREATED',
    'CDD_CHECK_PENDING',
    'EDD_CHECK_PENDING',
    'EDD_CHECK_FAILED',
    'ACCOUNT_SUSPENDED',
    'EDD_CHECK_CLEARED',
    'ACCOUNT_FUNDED'
  ],
  SINGAPORE_NATIONALITY_CODE: 'SG',
  SINGAPORE_COUNTRY_CODE: 'SG',
  MALAYSIA_COUNTRY_CODE: 'MY',
  INDONESIA_COUNTRY_CODE: 'ID',
  INDIA_COUNTRY_CODE: 'IN',
  CHINA_COUNTRY_CODE: 'CN',
  PHILLIPINES_COUNTRY_CODE: 'PH',
  PRIORITIZED_COUNTRY_LIST_CODES: ['SG', 'MY', 'ID', 'IN', 'CN', 'PH', 'HK', 'TH', 'UK', 'VN'],
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
    nationality_selected: 'nationality_selected',
    ddc_submitted: 'ddc_submitted',
    account_creation_pending: 'account_creation_pending',
    account_creation_confirmed: 'confirmed',
    documents_pending: 'documents_pending'
  },
  ADDITIONAL_DECLARATION_TWO: {
    PERSONAL_SAVING: 'savings',
    GIFT_INHERITANCE: 'gift',
    INVESTMENT_EARNINGS: 'earnings',
    OTHERS: 'others',
  },
  ADDITIONAL_DECLARATION_ONE: {
    OTHERS: 'Others'
  },
  EMPLOYEMENT_DETAILS: {
    SELE_EMPLOYED: 'Self Employed',
    EMPLOYED: 'Employed',
    UNEMPLOYED: 'Unemployed'
  },
  DISABLE_FIELDS_FOR_NON_SG: ['companyName',  'employmentStatus', 'occupation', 'otherOccupation']
};
