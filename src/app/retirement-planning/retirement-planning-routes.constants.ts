export const RETIREMENT_PLANNING_BASE_ROUTE = '../retirement-planning/';

export const RETIREMENT_PLANNING_ROUTES = {
  ROOT: '',
  GET_STARTED: 'get-started',
  RETIREMENT_NEEDS: 'retirement-needs',
  PERSONALIZE_YOUR_RETIREMENT: 'personalize-your-retirement',
  ENQUIRY_SUCCESS: 'enquiry-success',
};

export const RETIREMENT_PLANNING_ROUTE_PATHS = {
  ROOT: '',
  GET_STARTED: RETIREMENT_PLANNING_BASE_ROUTE + RETIREMENT_PLANNING_ROUTES.GET_STARTED,
  RETIREMENT_NEEDS: RETIREMENT_PLANNING_BASE_ROUTE + RETIREMENT_PLANNING_ROUTES.RETIREMENT_NEEDS,
  PERSONALIZE_YOUR_RETIREMENT: RETIREMENT_PLANNING_BASE_ROUTE + RETIREMENT_PLANNING_ROUTES.PERSONALIZE_YOUR_RETIREMENT,
  ENQUIRY_SUCCESS: RETIREMENT_PLANNING_BASE_ROUTE + RETIREMENT_PLANNING_ROUTES.ENQUIRY_SUCCESS
};
