
import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import {IMyDependant, IMyProfile } from './comprehensive-types';

export class ComprehensiveFormData {
    startingPage = SIGN_UP_ROUTE_PATHS.DASHBOARD;
    isToolTipShown = false;
    // myProfile info
    myProfile: IMyProfile;

    // dependant Details
    myDependant: IMyDependant[];

}
