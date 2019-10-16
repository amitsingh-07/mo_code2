import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CiAssessmentComponent } from './ci-assessment/ci-assessment.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedComponent } from './get-started/get-started.component';
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
  { path: GUIDE_ME_ROUTES.ROOT, component: ProfileComponent },
  { path: GUIDE_ME_ROUTES.PROFILE, component: ProfileComponent },
  { path: GUIDE_ME_ROUTES.GET_STARTED, component: GetStartedComponent },
  { path: GUIDE_ME_ROUTES.FINANCIAL_ASSESSMENT, component: FinAssessmentComponent },
  { path: GUIDE_ME_ROUTES.INSURE_ASSESSMENT, component: InsureAssessmentComponent },
  { path: GUIDE_ME_ROUTES.PROTECTION_NEEDS, component: ProtectionNeedsComponent },
  { path: GUIDE_ME_ROUTES.INCOME, component: IncomeComponent },
  { path: GUIDE_ME_ROUTES.EXPENSES, component: ExpensesComponent },
  { path: GUIDE_ME_ROUTES.ASSETS, component: MyAssetsComponent },
  { path: GUIDE_ME_ROUTES.LIABILITIES, component: LiabilitiesComponent },
  { path: GUIDE_ME_ROUTES.LIFE_PROTECTION, component: LifeProtectionComponent },
  { path: GUIDE_ME_ROUTES.CRITICAL_ILLNESS, component: CiAssessmentComponent },
  { path: GUIDE_ME_ROUTES.LONG_TERM_CARE, component: LtcAssessmentComponent },
  { path: GUIDE_ME_ROUTES.OCCUPATIONAL_DISABILITY, component: OcpDisabilityComponent },
  { path: GUIDE_ME_ROUTES.HOSPITAL_PLAN, component: HospitalPlanComponent },
  { path: GUIDE_ME_ROUTES.INSURANCE_RESULTS, component: InsuranceResultsComponent },
  { path: GUIDE_ME_ROUTES.RECOMMENDATIONS, component: RecommendationsComponent },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: []
})
export class GuideMeRoutingModule { }
