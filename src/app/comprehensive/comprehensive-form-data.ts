import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import {
    HospitalPlan,
    IChildEndowment,
    IComprehensiveDetails,
    IMyAssets,
    IMyEarnings,
    IMyLiabilities,
    IMySpendings,
    IRegularSavings
} from './comprehensive-types';

export class ComprehensiveFormData {
    comprehensiveDetails: IComprehensiveDetails;
    startingPage = SIGN_UP_ROUTE_PATHS.DASHBOARD;
    isToolTipShown = false;
    hospitalPlanData: HospitalPlan;
    myLiabilities: IMyLiabilities;
    myEarnings: IMyEarnings;
    mySpendings: IMySpendings;
    myAssets: IMyAssets;
    regularSavingsPlan: IRegularSavings;
}
