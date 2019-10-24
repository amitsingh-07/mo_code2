export const INVESTMENT_ACCOUNT_BASE_ROUTE = '../investment/account/';
export const MY_INFO_START_PATH = '/account/nationality';

export const INVESTMENT_ACCOUNT_ROUTES = {
  ROOT: '',
  SELECT_NATIONALITY: 'nationality',
  PERSONAL_INFO: 'personal-info',
  RESIDENTIAL_ADDRESS: 'residential-address',
  EMPLOYMENT_DETAILS: 'employment-details',
  FINANICAL_DETAILS: 'financial-details',
  TAX_INFO: 'tax-info',
  UPLOAD_DOCUMENTS: 'upload-documents',
  PERSONAL_DECLARATION: 'persoanl-declaration',
  ADDITIONALDECLARATION: 'additional-declaration',
  ADDITIONALDECLARATION_STEP1: 'additional-declaration/1',
  ADDITIONAL_DECLARATION_SCREEN_2: 'additional-declaration/2',
  SETUP_PENDING: 'status',
  UPLOAD_DOCUMENTS_BO: 'upload-documents-bo',
  START: 'start'
};
export const INVESTMENT_ACCOUNT_ROUTE_PATHS = {
  ROOT: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.ROOT,
  START: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.START,
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
  ADDITIONALDECLARATION:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION,
  ADDITIONALDECLARATION_STEP1:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.ADDITIONALDECLARATION_STEP1,
  SETUP_PENDING: INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.SETUP_PENDING,
  UPLOAD_DOCUMENTS_BO:
    INVESTMENT_ACCOUNT_BASE_ROUTE + INVESTMENT_ACCOUNT_ROUTES.UPLOAD_DOCUMENTS_BO
};
