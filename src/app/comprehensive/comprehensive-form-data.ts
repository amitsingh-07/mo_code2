
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import {HospitalPlan, IChildEndowment, IEducationPlan, IEPreference, IMyDependant, IMyEarnings
       , IMyLiabilities, IMyProfile, IMySpendings} from './comprehensive-types';

export class ComprehensiveFormData {
    startingPage = SIGN_UP_ROUTE_PATHS.DASHBOARD;
    isToolTipShown = false;
    // myProfile info
    myProfile: IMyProfile;

    hasDependant = 'no';

    // dependant Details
    myDependant: IMyDependant[];
    hasEducationPlan: IEducationPlan;
    educationPreference: IEPreference[];
    hospitalPlanData: HospitalPlan;
    myLiabilities: IMyLiabilities;
    myEarnings: IMyEarnings;
    mySpendings: IMySpendings;
}
