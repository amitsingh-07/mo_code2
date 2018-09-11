import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DirectComponent } from './direct.component';
import { CriticalIllnessFormComponent } from './product-info/critical-illness-form/critical-illness-form.component';
import { LifeProtectionFormComponent } from './product-info/life-protection-form/life-protection-form.component';

const routes: Routes = [
  { path: 'direct', component: DirectComponent,
    children: [
      { path: '', redirectTo: 'life-protection', pathMatch: 'full' },
      { path: 'life-protection', component: LifeProtectionFormComponent},
      { path: 'critical-illness', component: CriticalIllnessFormComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectRoutingModule {}