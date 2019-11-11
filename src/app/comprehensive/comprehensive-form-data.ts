import { SIGN_UP_ROUTE_PATHS } from '../sign-up/sign-up.routes.constants';
import {
    IComprehensiveDetails,
    IHospitalPlanList,
    IPromoCode,
} from './comprehensive-types';

export class ComprehensiveFormData {
    comprehensiveDetails: IComprehensiveDetails;
    startingPage = SIGN_UP_ROUTE_PATHS.DASHBOARD;
    isToolTipShown = false;
    hospitalPlanList: IHospitalPlanList[];
    promoCodeActionType: string;
    promoCode: IPromoCode;
}
