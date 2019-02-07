export const INVESTMENT_ACCOUNT_BASE_ROUTE = '../invest/account/';

export const INVESTMENT_ACCOUNT_ROUTES = {
  ROOT: '',
  SELECT_NATIONALITY: 'select-nationality',
  PERSONAL_INFO: 'personal-info',
  RESIDENTIAL_ADDRESS: 'residential-address',
  EMPLOYMENT_DETAILS: 'employment-details',
  FINANICAL_DETAILS: 'financial-details',
  TAX_INFO: 'tax-info',
  UPLOAD_DOCUMENTS: 'upload-documents',
  PERSONAL_DECLARATION: 'persoanl-declaration',
  CONFIRM_PORTFOLIO: 'confirm-portfolio',
  ACKNOWLEDGEMENT: 'acknowledgement',
  ADDITIONALDECLARATION: 'due-diligence-check',
  ADDITIONALDECLARATION_STEP1: 'due-diligence-check/1',
  ADDITIONAL_DECLARATION_SCREEN_2: 'due-diligence-check/2',
  SETUP_PENDING: 'setup-pending',
  SETUP_COMPLETED: 'setup-completed',
  UPLOAD_DOCUMENTS_BO: 'upload-documents-bo',
  POSTLOGIN: 'start',
  FUND_INTRO: 'fund-intro'
};
export const INVESTMENT_ACCOUNT_ROUTE_PATHS = {
  ROOT: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.ROOT,
  POSTLOGIN: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.POSTLOGIN,
  PERSONAL_INFO: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.PERSONAL_INFO,
  RESIDENTIAL_ADDRESS:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.RESIDENTIAL_ADDRESS,
  SELECT_NATIONALITY:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.SELECT_NATIONALITY,
  EMPLOYMENT_DETAILS:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.EMPLOYMENT_DETAILS,
  FINANICAL_DETAILS:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.FINANICAL_DETAILS,
  TAX_INFO: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.TAX_INFO,
  UPLOAD_DOCUMENTS:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS,
  PERSONAL_DECLARATION:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.PERSONAL_DECLARATION,
  ADDITIONAL_DECLARATION_SCREEN_2:
    INVESTMENT_ACCOUNT_BASE_ROUTE +
    INVESTMENT_ACCOUNT_ROUTES.ADDITIONAL_DECLARATION_SCREEN_2,
  CONFIRM_PORTFOLIO:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.CONFIRM_PORTFOLIO,
  ACKNOWLEDGEMENT:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.ACKNOWLEDGEMENT,
  ADDITIONALDECLARATION:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION,
  ADDITIONALDECLARATION_STEP1:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION_STEP1,
  SETUP_COMPLETED:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.SETUP_COMPLETED,
  SETUP_PENDING: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.SETUP_PENDING,
  UPLOAD_DOCUMENTS_BO:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS_BO,
  FUND_INTRO: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.FUND_INTRO
};
