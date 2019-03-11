import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import {
    HospitalPlan,
    IChildEndowment,
    IEducationPlan,
    IEPreference,
    IMyAssets,
    IMyDependant,
    IMyEarnings,
    IMyLiabilities,
    IMyProfile,
    IMySpendings,
    IRegularSavePlan
} from './comprehensive-types';

export class ComprehensiveFormData {
    startingPage = SIGN_UP_ROUTE_PATHS.DASHBOARD;
    isToolTipShown = false;
    // myProfile info
    myProfile: IMyProfile;

    hasDependant = 'no';

    // dependant Details
    myDependant: IMyDependant[];
    educationPlan: IEducationPlan;
    educationPreference: IEPreference[];
    hospitalPlanData: HospitalPlan;
    myLiabilities: IMyLiabilities;
    myEarnings: IMyEarnings;
    mySpendings: IMySpendings;
    myAssets: IMyAssets;
    regularSavingsPlan: IRegularSavePlan;
}
