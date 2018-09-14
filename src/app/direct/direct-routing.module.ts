import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetirementIncomeFormComponent } from './product-info/retirement-income-form/retirement-income-form.component';

import { EducationFormComponent } from 'src/app/direct/product-info/education-form/education-form.component';
import { DirectComponent } from './direct.component';
import { CriticalIllnessFormComponent } from './product-info/critical-illness-form/critical-illness-form.component';
import { LifeProtectionFormComponent } from './product-info/life-protection-form/life-protection-form.component';
import { LongTermCareFormComponent } from './product-info/long-term-care-form/long-term-care-form.component';

const routes: Routes = [
  { path: '', component: DirectComponent,
    children: [
      { path: '', redirectTo: 'life-protection', pathMatch: 'full' },
      { path: 'life-protection', component: LifeProtectionFormComponent},
      { path: 'critical-illness', component: CriticalIllnessFormComponent},
      { path: 'education', component: EducationFormComponent},
      { path: 'long-term-care', component: LongTermCareFormComponent},
      { path: 'retirement-income-plan', component: RetirementIncomeFormComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectRoutingModule {}
