import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PromotionLandingComponent } from './promotion-landing/promotion-landing.component';

const routes: Routes = [
  { path: '', component: PromotionLandingComponent},
//   { path: 'category/:name', component: ArticleCategoryComponent},
//   { path: 'entry/:id', component: ArticleEntryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule {}
