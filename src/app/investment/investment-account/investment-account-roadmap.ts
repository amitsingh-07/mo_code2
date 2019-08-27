import { ERoadmapStatus, IRoadmap } from '../../shared/components/roadmap/roadmap.interface';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from './investment-account-routes.constants';

export let INVESTMENT_ACCOUNT_ROADMAP: IRoadmap = {
  title: 'Investment Account Opening',
  items: [
    {
      title: 'Personal Information',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_INFO],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Residential Address',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.RESIDENTIAL_ADDRESS],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Employment Details',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.EMPLOYMENT_DETAILS],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Financial Details',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.FINANICAL_DETAILS],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Tax Information',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.TAX_INFO],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Personal Declaration',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.PERSONAL_DECLARATION],
      status: ERoadmapStatus.NOT_STARTED
    }
  ],
  notStartedClass: 'not-started',
  inProgressClass: 'in-progress',
  completedClass: 'completed'
};

export let INVESTMENT_ACCOUNT_DDC_ROADMAP: IRoadmap = {
  title: 'Additional Declaration',
  items: [
    {
      title: 'PEP Details',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONALDECLARATION_STEP1],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Investments',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2],
      status: ERoadmapStatus.NOT_STARTED
    }
  ],
  notStartedClass: 'not-started',
  inProgressClass: 'in-progress',
  completedClass: 'completed'
};

export let INVESTMENT_ACCOUNT_DDC2_ROADMAP: IRoadmap = {
  title: 'Additional Declaration',
  items: [
    {
      title: 'Investments',
      path: [INVESTMENT_ACCOUNT_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2],
      status: ERoadmapStatus.NOT_STARTED
    }
  ],
  notStartedClass: 'not-started',
  inProgressClass: 'in-progress',
  completedClass: 'completed'
};
