import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PromoCodeLandingComponent } from './promo-code-landing/promo-code-landing.component';

const routes: Routes = [
  { path: 'promo-code', component: PromoCodeLandingComponent },
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoCodeRoutingModule { }
