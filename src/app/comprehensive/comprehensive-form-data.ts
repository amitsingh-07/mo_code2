
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import {HospitalPlan, IMyDependant, IMyLiabilities, IMyProfile } from './comprehensive-types';

export class ComprehensiveFormData {
    startingPage = SIGN_UP_ROUTE_PATHS.DASHBOARD;
    isToolTipShown = false;
    // myProfile info
    myProfile: IMyProfile;

    hasDependant = 'no';

    // dependant Details
    myDependant: IMyDependant[];
    hospitalPlanData: HospitalPlan;
    myLiabilities: IMyLiabilities;
}
