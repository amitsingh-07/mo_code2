import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgressTrackerComponent } from './../shared/modal/progress-tracker/progress-tracker.component';

import { BadMoodFundComponent } from './bad-mood-fund/bad-mood-fund.component';
import { ComprehensiveEnableGuard } from './comprehensive-enable-guard';
import { COMPREHENSIVE_ROUTES } from './comprehensive-routes.constants';
import { ComprehensiveStepsComponent } from './comprehensive-steps/comprehensive-steps.component';
import { ComprehensiveComponent } from './comprehensive/comprehensive.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DependantEducationListComponent } from './dependant-education-list/dependant-education-list.component';
import { DependantEducationSelectionComponent } from './dependant-education-selection/dependant-education-selection.component';
import { DependantSelectionComponent } from './dependant-selection/dependant-selection.component';
import { DependantsDetailsComponent } from './dependants-details/dependants-details.component';
import { EducationPreferenceComponent } from './education-preference/education-preference.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { MyEarningsComponent } from './my-earnings/my-earnings.component';
import { MyLiabilitiesComponent } from './my-liabilities/my-liabilities.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MySpendingsComponent } from './my-spendings/my-spendings.component';
import { RegularSavingPlanComponent } from './regular-saving-plan/regular-saving-plan.component';
import { ResultComponent } from './result/result.component';
import { RetirementPlanComponent } from './retirement-plan/retirement-plan.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [ ComprehensiveEnableGuard ],
        children: [
            { path: COMPREHENSIVE_ROUTES.ROOT, component: ComprehensiveComponent },
            { path: COMPREHENSIVE_ROUTES.GETTING_STARTED, component: MyProfileComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_DETAILS, component: DependantsDetailsComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_DETAILS + '/:summary', component: DependantsDetailsComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_LIST, component: DependantEducationListComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_LIST + '/:summary', component: DependantEducationListComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_PREFERENCE, component: EducationPreferenceComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_SELECTION, component: DependantEducationSelectionComponent},
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_EDUCATION_SELECTION + '/:summary', component: DependantEducationSelectionComponent},
            { path: COMPREHENSIVE_ROUTES.MY_EARNINGS, component: MyEarningsComponent },
            { path: COMPREHENSIVE_ROUTES.MY_SPENDINGS, component: MySpendingsComponent },
            { path: COMPREHENSIVE_ROUTES.REGULAR_SAVING_PLAN, component: RegularSavingPlanComponent },
            { path: COMPREHENSIVE_ROUTES.MY_ASSETS, component: MyAssetsComponent },
            { path: COMPREHENSIVE_ROUTES.MY_LIABILITIES, component: MyLiabilitiesComponent },
            { path: COMPREHENSIVE_ROUTES.MY_LIABILITIES + '/:summary', component: MyLiabilitiesComponent },
            { path: COMPREHENSIVE_ROUTES.STEPS + '/:stepNo', component: ComprehensiveStepsComponent },
            { path: COMPREHENSIVE_ROUTES.BAD_MOOD_FUND, component: BadMoodFundComponent },
            { path: COMPREHENSIVE_ROUTES.PROGRESS_TRACKER, component: ProgressTrackerComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_SELECTION, component: DependantSelectionComponent },
            { path: COMPREHENSIVE_ROUTES.DEPENDANT_SELECTION + '/:summary', component: DependantSelectionComponent },
            { path: COMPREHENSIVE_ROUTES.RETIREMENT_PLAN, component: RetirementPlanComponent },
            { path: COMPREHENSIVE_ROUTES.RETIREMENT_PLAN + '/:summary', component: RetirementPlanComponent },
            { path: COMPREHENSIVE_ROUTES.INSURANCE_PLAN , component: InsurancePlanComponent },
            { path: COMPREHENSIVE_ROUTES.INSURANCE_PLAN + '/:summary', component: InsurancePlanComponent },
            { path: COMPREHENSIVE_ROUTES.RESULT, component: ResultComponent },
            { path: COMPREHENSIVE_ROUTES.DASHBOARD , component: DashboardComponent },
            { path: COMPREHENSIVE_ROUTES.ENQUIRY, component: EnquiryComponent}
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class ComprehensiveRoutingModule {}
