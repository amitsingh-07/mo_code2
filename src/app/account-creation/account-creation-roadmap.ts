import { ERoadmapStatus, IRoadmap } from '../shared/components/roadmap/roadmap.interface';
import { ACCOUNT_CREATION_ROUTE_PATHS } from './account-creation-routes.constants';

export let ACCOUNT_CREATION_ROADMAP: IRoadmap = {
  title: 'Investment Account Opening',
  items: [
    {
      title: 'Personal Information',
      path: [ACCOUNT_CREATION_ROUTE_PATHS.PERSONAL_INFO],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Residential Address',
      path: [ACCOUNT_CREATION_ROUTE_PATHS.RESIDENTIAL_ADDRESS],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Employment Details',
      path: [ACCOUNT_CREATION_ROUTE_PATHS.EMPLOYMENT_DETAILS],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Financial Details',
      path: [ACCOUNT_CREATION_ROUTE_PATHS.FINANICAL_DETAILS],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Tax Information',
      path: [ACCOUNT_CREATION_ROUTE_PATHS.TAX_INFO],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Personal Declaration',
      path: [ACCOUNT_CREATION_ROUTE_PATHS.PERSONAL_DECLARATION],
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
      path: [ACCOUNT_CREATION_ROUTE_PATHS.ADDITIONALDECLARATION_STEP1],
      status: ERoadmapStatus.NOT_STARTED
    },
    {
      title: 'Investments',
      path: [ACCOUNT_CREATION_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2],
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
      path: [ACCOUNT_CREATION_ROUTE_PATHS.ADDITIONAL_DECLARATION_SCREEN_2],
      status: ERoadmapStatus.NOT_STARTED
    }
  ],
  notStartedClass: 'not-started',
  inProgressClass: 'in-progress',
  completedClass: 'completed'
};
