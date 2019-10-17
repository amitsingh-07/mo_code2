import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PromotionLandingComponent } from './promotion-landing/promotion-landing.component';
import { PromotionPageComponent } from './promotion-page/promotion-page.component';

const routes: Routes = [
  { path: '', component: PromotionLandingComponent},
  { path: ':id', component: PromotionPageComponent},
  { path: '**', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule {}
