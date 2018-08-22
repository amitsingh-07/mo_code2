import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NouisliderModule } from 'ng2-nouislider';
import { CustomCurrencyPipe } from '../shared/Pipes/custom-currency.pipe';

import { CurrencyInputDirective } from '../shared/directives/currency-input.directive';
import { SharedModule } from '../shared/shared.module';
import { PlanWidgetComponent } from '../shared/widgets/plan-widget/plan-widget.component';
import { CiAssessmentComponent } from './ci-assessment/ci-assessment.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedFormComponent } from './get-started/get-started-form/get-started-form.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { GuideMeRoutingModule } from './guide-me-routing.module';
import { HospitalPlanComponent } from './hospital-plan/hospital-plan.component';
import { IncomeComponent } from './income/income.component';
import { InsuranceResultComponent } from './insurance-results/insurance-result/insurance-result.component';
import { InsuranceResultsComponent } from './insurance-results/insurance-results.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { LifeProtectionFormComponent } from './life-protection/life-protection-form/life-protection-form.component';
import { LifeProtectionComponent } from './life-protection/life-protection.component';
import { LtcAssessmentComponent } from './ltc-assessment/ltc-assessment.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { OcpDisabilityComponent } from './ocp-disability/ocp-disability.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';

@NgModule({
  imports: [
    CommonModule, GuideMeRoutingModule, ReactiveFormsModule, NgbModule.forRoot(),
    TranslateModule.forChild(SharedModule.getTranslateConfig('guide-me')),
    NouisliderModule,
    FormsModule
  ],
  declarations: [
    ProfileComponent,
    GetStartedComponent,
    GetStartedFormComponent,
    ProtectionNeedsComponent,
    IncomeComponent,
    ExpensesComponent,
    MyAssetsComponent,
    LiabilitiesComponent,
    CurrencyInputDirective,
    FinAssessmentComponent,
    InsureAssessmentComponent,
    LifeProtectionComponent,
    LifeProtectionFormComponent,
    LtcAssessmentComponent,
    CiAssessmentComponent,
    OcpDisabilityComponent,
    HospitalPlanComponent,
    InsuranceResultsComponent,
    InsuranceResultComponent,
    RecommendationsComponent,
    PlanWidgetComponent,
    CustomCurrencyPipe
  ],
  providers: [CurrencyPipe, CustomCurrencyPipe]
})
export class GuideMeModule { }