import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CiAssessmentComponent } from './ci-assessment/ci-assessment.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { GuideMeAccessGuard } from './guide-me-access-guard';
import { GUIDE_ME_ROUTES } from './guide-me-routes.constants';
import { HospitalPlanComponent } from './hospital-plan/hospital-plan.component';
import { IncomeComponent } from './income/income.component';
import { InsuranceResultsComponent } from './insurance-results/insurance-results.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { LifeProtectionComponent } from './life-protection/life-protection.component';
import { LtcAssessmentComponent } from './ltc-assessment/ltc-assessment.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { OcpDisabilityComponent } from './ocp-disability/ocp-disability.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';

const routes: Routes = [
  { path: GUIDE_ME_ROUTES.ROOT, component: ProfileComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.PROFILE, component: ProfileComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.GET_STARTED, component: GetStartedComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.FINANCIAL_ASSESSMENT, component: FinAssessmentComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.INSURE_ASSESSMENT, component: InsureAssessmentComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.PROTECTION_NEEDS, component: ProtectionNeedsComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.INCOME, component: IncomeComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.EXPENSES, component: ExpensesComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.ASSETS, component: MyAssetsComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.LIABILITIES, component: LiabilitiesComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.LIFE_PROTECTION, component: LifeProtectionComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.CRITICAL_ILLNESS, component: CiAssessmentComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.LONG_TERM_CARE, component: LtcAssessmentComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.OCCUPATIONAL_DISABILITY, component: OcpDisabilityComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.HOSPITAL_PLAN, component: HospitalPlanComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.INSURANCE_RESULTS, component: InsuranceResultsComponent, canActivate: [GuideMeAccessGuard] },
  { path: GUIDE_ME_ROUTES.RECOMMENDATIONS, component: RecommendationsComponent, canActivate: [GuideMeAccessGuard] },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule { }
