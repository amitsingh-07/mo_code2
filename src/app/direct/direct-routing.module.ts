import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EducationFormComponent } from 'src/app/direct/product-info/education-form/education-form.component';

import { ComparePlansComponent } from './compare-plans/compare-plans.component';
import { DirectResultsComponent } from './direct-results/direct-results.component';
import { DIRECT_ROUTES } from './direct-routes.constants';
import { DirectComponent } from './direct.component';
import { CriticalIllnessFormComponent } from './product-info/critical-illness-form/critical-illness-form.component';
import { LifeProtectionFormComponent } from './product-info/life-protection-form/life-protection-form.component';
import { LongTermCareFormComponent } from './product-info/long-term-care-form/long-term-care-form.component';
import { OcpDisabilityFormComponent } from './product-info/ocp-disability-form/ocp-disability-form.component';
import { RetirementIncomeFormComponent } from './product-info/retirement-income-form/retirement-income-form.component';
import { SrsApprovedPlansFormComponent } from './product-info/srs-approved-plans-form/srs-approved-plans-form.component';

const routes: Routes = [
  { path: '', component: DirectComponent},
  { path: DIRECT_ROUTES.COMPARE_PLANS, component: ComparePlansComponent }
];

/*
children: [
      { path: 'life-protection', component: LifeProtectionFormComponent},
      { path: 'critical-illness', component: CriticalIllnessFormComponent},
      { path: 'education', component: EducationFormComponent},
      { path: 'long-term-care', component: LongTermCareFormComponent},
      { path: 'retirement-income-plan', component: RetirementIncomeFormComponent},
      { path: 'occupational-disability', component: OcpDisabilityFormComponent},
      { path: 'srs-approved-plans', component: SrsApprovedPlansFormComponent}
    ]
  },
*/
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectRoutingModule {}
